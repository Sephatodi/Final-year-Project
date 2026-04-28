class PushNotificationService {
  constructor() {
    this.swRegistration = null;
    this.applicationServerKey = process.env.REACT_APP_VAPID_PUBLIC_KEY;
  }

  async init() {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
      console.warn('Push notifications not supported');
      return false;
    }

    try {
      this.swRegistration = await navigator.serviceWorker.ready;
      return true;
    } catch (error) {
      console.error('Failed to initialize push notifications:', error);
      return false;
    }
  }

  async subscribe() {
    try {
      if (!this.swRegistration) {
        await this.init();
      }

      const subscription = await this.swRegistration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: this.urlBase64ToUint8Array(this.applicationServerKey),
      });

      // Send subscription to server
      await this.sendSubscriptionToServer(subscription);

      return subscription;
    } catch (error) {
      console.error('Failed to subscribe to push notifications:', error);
      throw error;
    }
  }

  async unsubscribe() {
    try {
      const subscription = await this.swRegistration.pushManager.getSubscription();
      if (subscription) {
        await subscription.unsubscribe();
        // Notify server
        await this.removeSubscriptionFromServer(subscription);
      }
    } catch (error) {
      console.error('Failed to unsubscribe from push notifications:', error);
      throw error;
    }
  }

  async getSubscription() {
    if (!this.swRegistration) {
      await this.init();
    }
    return await this.swRegistration.pushManager.getSubscription();
  }

  async sendSubscriptionToServer(subscription) {
    const response = await fetch('/api/push/subscribe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(subscription),
    });
    return response.json();
  }

  async removeSubscriptionFromServer(subscription) {
    const response = await fetch('/api/push/unsubscribe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(subscription),
    });
    return response.json();
  }

  urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, '+')
      .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }

  async requestPermission() {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }

  showLocalNotification(title, options) {
    if (this.swRegistration) {
      this.swRegistration.showNotification(title, options);
    } else {
      new Notification(title, options);
    }
  }

  // Helper to create notification options
  createNotificationOptions({
    body,
    icon = '/icon-192x192.png',
    badge = '/badge-72x72.png',
    image,
    data = {},
    actions = [],
    tag,
    renotify = false,
    requireInteraction = false,
    silent = false,
    vibrate = [200, 100, 200],
  }) {
    return {
      body,
      icon,
      badge,
      image,
      data,
      actions,
      tag,
      renotify,
      requireInteraction,
      silent,
      vibrate,
    };
  }
}

export default new PushNotificationService();