import { io } from 'socket.io-client';

class SocketService {
  constructor() {
    this.socket = null;
    this.listeners = new Map();
  }

  connect(token) {
    if (this.socket?.connected) return;

    this.socket = io(process.env.REACT_APP_SOCKET_URL, {
      auth: { token },
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    this.socket.on('connect', () => {
      console.log('Socket connected');
      this.emit('connect');
    });

    this.socket.on('disconnect', (reason) => {
      console.log('Socket disconnected:', reason);
      this.emit('disconnect', reason);
    });

    this.socket.on('error', (error) => {
      console.error('Socket error:', error);
      this.emit('error', error);
    });

    this.socket.on('reconnect', (attemptNumber) => {
      console.log('Socket reconnected after', attemptNumber, 'attempts');
      this.emit('reconnect', attemptNumber);
    });

    this.socket.on('reconnect_error', (error) => {
      console.error('Socket reconnection error:', error);
      this.emit('reconnect_error', error);
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event).add(callback);

    if (this.socket) {
      this.socket.on(event, callback);
    }
  }

  off(event, callback) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).delete(callback);
    }

    if (this.socket) {
      this.socket.off(event, callback);
    }
  }

  emit(event, data) {
    if (this.socket) {
      this.socket.emit(event, data);
    }
  }

  // Consultation events
  joinConsultation(consultationId) {
    this.emit('joinConsultation', consultationId);
  }

  leaveConsultation(consultationId) {
    this.emit('leaveConsultation', consultationId);
  }

  sendMessage(consultationId, message) {
    this.emit('sendMessage', { consultationId, message });
  }

  sendTyping(consultationId, isTyping) {
    this.emit('typing', { consultationId, isTyping });
  }

  // Alert events
  subscribeToZone(zoneId) {
    this.emit('subscribeZone', zoneId);
  }

  unsubscribeFromZone(zoneId) {
    this.emit('unsubscribeZone', zoneId);
  }

  acknowledgeAlert(alertId) {
    this.emit('acknowledgeAlert', alertId);
  }

  // Video call events
  requestVideoCall(consultationId) {
    this.emit('requestVideoCall', consultationId);
  }

  acceptVideoCall(consultationId) {
    this.emit('acceptVideoCall', consultationId);
  }

  endVideoCall(consultationId) {
    this.emit('endVideoCall', consultationId);
  }

  // WebRTC signaling
  sendSignal(consultationId, signal) {
    this.emit('signal', { consultationId, signal });
  }

  // Status
  isConnected() {
    return this.socket?.connected || false;
  }

  getSocketId() {
    return this.socket?.id;
  }
}

export default new SocketService();