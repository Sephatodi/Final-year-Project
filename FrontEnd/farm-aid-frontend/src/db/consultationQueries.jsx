import { getDB } from './indexedDB';
import { validateData } from './schema';

export const consultationQueries = {
  // Create a new consultation
  createConsultation: async (consultationData) => {
    const validation = validateData('consultations', consultationData);
    if (!validation.valid) {
      throw new Error(`Invalid consultation data: ${validation.errors.join(', ')}`);
    }

    const db = await getDB();
    const consultation = {
      ...consultationData,
      status: consultationData.status || 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      synced: false,
    };
    
    const id = await db.add('consultations', consultation);
    return { ...consultation, id };
  },

  // Get consultations for a farmer
  getFarmerConsultations: async (farmerId) => {
    const db = await getDB();
    const tx = db.transaction('consultations', 'readonly');
    const store = tx.objectStore('consultations');
    const index = store.index('farmerId');
    const consultations = await index.getAll(farmerId);
    
    return consultations.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
  },

  // Get consultations for an expert
  getExpertConsultations: async (expertId) => {
    const db = await getDB();
    const tx = db.transaction('consultations', 'readonly');
    const store = tx.objectStore('consultations');
    const index = store.index('expertId');
    const consultations = await index.getAll(expertId);
    
    return consultations.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
  },

  // Get consultation by ID
  getConsultationById: async (id) => {
    const db = await getDB();
    return await db.get('consultations', id);
  },

  // Update consultation
  updateConsultation: async (id, updates) => {
    const db = await getDB();
    const consultation = await db.get('consultations', id);
    
    if (!consultation) {
      throw new Error('Consultation not found');
    }

    const updatedConsultation = {
      ...consultation,
      ...updates,
      updatedAt: new Date().toISOString(),
      synced: false,
    };

    const validation = validateData('consultations', updatedConsultation);
    if (!validation.valid) {
      throw new Error(`Invalid consultation data: ${validation.errors.join(', ')}`);
    }

    await db.put('consultations', updatedConsultation);
    return updatedConsultation;
  },

  // Get consultations by status
  getConsultationsByStatus: async (status) => {
    const db = await getDB();
    const tx = db.transaction('consultations', 'readonly');
    const store = tx.objectStore('consultations');
    const index = store.index('status');
    return await index.getAll(status);
  },

  // Add message to consultation
  addMessage: async (messageData) => {
    const validation = validateData('messages', messageData);
    if (!validation.valid) {
      throw new Error(`Invalid message data: ${validation.errors.join(', ')}`);
    }

    const db = await getDB();
    const message = {
      ...messageData,
      timestamp: messageData.timestamp || new Date().toISOString(),
      status: messageData.status || 'sending',
      synced: false,
    };
    
    const id = await db.add('messages', message);
    
    // Update consultation's updatedAt
    await consultationQueries.updateConsultation(messageData.consultationId, {
      updatedAt: new Date().toISOString(),
    });
    
    return { ...message, id };
  },

  // Get messages for a consultation
  getConsultationMessages: async (consultationId) => {
    const db = await getDB();
    const tx = db.transaction('messages', 'readonly');
    const store = tx.objectStore('messages');
    const index = store.index('consultationId');
    const messages = await index.getAll(consultationId);
    
    return messages.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
  },

  // Update message status
  updateMessageStatus: async (id, status) => {
    const db = await getDB();
    const message = await db.get('messages', id);
    
    if (!message) {
      throw new Error('Message not found');
    }

    const updatedMessage = {
      ...message,
      status,
      synced: status === 'sent' ? true : false,
    };

    await db.put('messages', updatedMessage);
    return updatedMessage;
  },

  // Get unread message count for a consultation
  getUnreadCount: async (consultationId, userId) => {
    const messages = await consultationQueries.getConsultationMessages(consultationId);
    return messages.filter(m => m.senderId !== userId && m.status !== 'read').length;
  },

  // Mark messages as read
  markMessagesAsRead: async (consultationId, userId) => {
    const db = await getDB();
    const messages = await consultationQueries.getConsultationMessages(consultationId);
    
    for (const message of messages) {
      if (message.senderId !== userId && message.status !== 'read') {
        const updatedMessage = {
          ...message,
          status: 'read',
          readAt: new Date().toISOString(),
        };
        await db.put('messages', updatedMessage);
      }
    }
    
    return { success: true };
  },

  // Get pending sync consultations
  getPendingSyncConsultations: async () => {
    const db = await getDB();
    const tx = db.transaction('consultations', 'readonly');
    const store = tx.objectStore('consultations');
    const consultations = await store.getAll();
    
    return consultations.filter(c => !c.synced);
  },

  // Get pending sync messages
  getPendingSyncMessages: async () => {
    const db = await getDB();
    const tx = db.transaction('messages', 'readonly');
    const store = tx.objectStore('messages');
    const messages = await store.getAll();
    
    return messages.filter(m => !m.synced);
  },
};