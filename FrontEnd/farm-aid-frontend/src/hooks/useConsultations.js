import { useEffect, useState } from 'react';
import io from 'socket.io-client';
import api from '../services/api';
import { useOffline } from './useOffline';

export const useConsultations = (userId, role) => {
  const [consultations, setConsultations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [socket, setSocket] = useState(null);
  const [typingUsers, setTypingUsers] = useState({});
  const { isOffline, addToQueue } = useOffline();

  useEffect(() => {
    loadConsultations();

    // Connect to socket for real-time updates
    if (!isOffline) {
      const token = localStorage.getItem('token');
      const newSocket = io(process.env.REACT_APP_SOCKET_URL, {
        auth: { token }
      });

      newSocket.on('connect', () => {
        console.log('Connected to consultation socket');
      });

      newSocket.on('newMessage', handleNewMessage);
      newSocket.on('userTyping', handleUserTyping);
      newSocket.on('consultationUpdated', handleConsultationUpdated);

      setSocket(newSocket);

      return () => {
        newSocket.disconnect();
      };
    }
  }, [userId, isOffline]);

  const loadConsultations = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.get('/consultations');
      setConsultations(response.data);
    } catch (err) {
      setError(err.message);
      console.error('Failed to load consultations:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleNewMessage = (data) => {
    setConsultations(prev => prev.map(c => 
      c.id === data.consultationId
        ? { ...c, lastMessage: data.message, unreadCount: (c.unreadCount || 0) + 1 }
        : c
    ));
  };

  const handleUserTyping = ({ consultationId, userId, isTyping }) => {
    setTypingUsers(prev => ({
      ...prev,
      [consultationId]: { userId, isTyping }
    }));
  };

  const handleConsultationUpdated = (updatedConsultation) => {
    setConsultations(prev => prev.map(c => 
      c.id === updatedConsultation.id ? updatedConsultation : c
    ));
  };

  const createConsultation = async (consultationData) => {
    try {
      if (isOffline) {
        // Save locally and queue for sync
        const offlineId = `offline_${Date.now()}`;
        const newConsultation = {
          id: offlineId,
          ...consultationData,
          status: 'pending',
          createdAt: new Date().toISOString(),
          offline: true
        };

        setConsultations(prev => [newConsultation, ...prev]);

        addToQueue({
          entity: 'consultations',
          action: 'create',
          data: consultationData
        });

        return { success: true, data: newConsultation };
      } else {
        const response = await api.post('/consultations', consultationData);
        setConsultations(prev => [response.data, ...prev]);
        return { success: true, data: response.data };
      }
    } catch (err) {
      console.error('Failed to create consultation:', err);
      return { success: false, error: err.message };
    }
  };

  const sendMessage = async (consultationId, content, attachments = []) => {
    try {
      const messageData = {
        consultationId,
        content,
        attachments,
        timestamp: new Date().toISOString()
      };

      if (isOffline) {
        // Save locally and queue for sync
        const offlineId = `msg_${Date.now()}`;
        const newMessage = {
          id: offlineId,
          ...messageData,
          status: 'pending',
          offline: true
        };

        // Update local consultation with new message
        setConsultations(prev => prev.map(c => 
          c.id === consultationId
            ? { ...c, lastMessage: content, unreadCount: 0 }
            : c
        ));

        addToQueue({
          entity: 'messages',
          action: 'create',
          data: messageData
        });

        return { success: true, data: newMessage };
      } else {
        const response = await api.post(`/consultations/${consultationId}/messages`, messageData);
        
        if (socket) {
          socket.emit('sendMessage', {
            consultationId,
            message: response.data
          });
        }

        return { success: true, data: response.data };
      }
    } catch (err) {
      console.error('Failed to send message:', err);
      return { success: false, error: err.message };
    }
  };

  const sendTyping = (consultationId, isTyping) => {
    if (socket && !isOffline) {
      socket.emit('typing', { consultationId, isTyping });
    }
  };

  const joinConsultation = (consultationId) => {
    if (socket && !isOffline) {
      socket.emit('joinConsultation', consultationId);
    }
  };

  const leaveConsultation = (consultationId) => {
    if (socket && !isOffline) {
      socket.emit('leaveConsultation', consultationId);
    }
  };

  const markAsRead = async (consultationId) => {
    try {
      setConsultations(prev => prev.map(c => 
        c.id === consultationId ? { ...c, unreadCount: 0 } : c
      ));

      if (!isOffline) {
        await api.post(`/consultations/${consultationId}/read`);
      }
    } catch (err) {
      console.error('Failed to mark as read:', err);
    }
  };

  const resolveConsultation = async (consultationId, resolution) => {
    try {
      if (isOffline) {
        setConsultations(prev => prev.map(c => 
          c.id === consultationId ? { ...c, status: 'resolved' } : c
        ));

        addToQueue({
          entity: 'consultations',
          action: 'resolve',
          data: { id: consultationId, ...resolution }
        });

        return { success: true };
      } else {
        const response = await api.post(`/consultations/${consultationId}/resolve`, resolution);
        setConsultations(prev => prev.map(c => 
          c.id === consultationId ? response.data : c
        ));
        return { success: true };
      }
    } catch (err) {
      console.error('Failed to resolve consultation:', err);
      return { success: false, error: err.message };
    }
  };

  const rateConsultation = async (consultationId, rating, feedback) => {
    try {
      await api.post(`/consultations/${consultationId}/rate`, { rating, feedback });
      return { success: true };
    } catch (err) {
      console.error('Failed to rate consultation:', err);
      return { success: false, error: err.message };
    }
  };

  const getConsultation = (consultationId) => {
    return consultations.find(c => c.id === consultationId);
  };

  const getUnreadCount = () => {
    return consultations.reduce((sum, c) => sum + (c.unreadCount || 0), 0);
  };

  return {
    consultations,
    loading,
    error,
    typingUsers,
    createConsultation,
    sendMessage,
    sendTyping,
    joinConsultation,
    leaveConsultation,
    markAsRead,
    resolveConsultation,
    rateConsultation,
    getConsultation,
    getUnreadCount,
    refresh: loadConsultations,
  };
};