class SMSService {
  async sendVerificationCode(phone) {
    const response = await fetch('/api/sms/verification', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ phone }),
    });
    return response.json();
  }

  async sendAlert(phone, alert) {
    const response = await fetch('/api/sms/alert', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ phone, alert }),
    });
    return response.json();
  }

  async sendBulkAlerts(phones, alert) {
    const response = await fetch('/api/sms/bulk-alert', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ phones, alert }),
    });
    return response.json();
  }

  async sendReminder(phone, reminder) {
    const response = await fetch('/api/sms/reminder', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ phone, reminder }),
    });
    return response.json();
  }

  async checkBalance() {
    const response = await fetch('/api/sms/balance');
    return response.json();
  }

  formatPhoneNumber(phone) {
    // Remove all non-numeric characters
    let cleaned = phone.replace(/\D/g, '');
    
    // Botswana numbers: add country code if missing
    if (cleaned.length === 8) {
      cleaned = '267' + cleaned;
    } else if (cleaned.length === 9 && cleaned.startsWith('0')) {
      cleaned = '267' + cleaned.substring(1);
    }
    
    // Format for display
    if (cleaned.length === 11) {
      return `+${cleaned.substring(0, 3)} ${cleaned.substring(3, 5)} ${cleaned.substring(5, 8)} ${cleaned.substring(8)}`;
    }
    
    return phone;
  }

  validatePhoneNumber(phone) {
    const cleaned = phone.replace(/\D/g, '');
    // Botswana numbers: 8 digits local, or 11 digits with country code
    return cleaned.length === 8 || cleaned.length === 11;
  }

  createAlertMessage(alert) {
    let message = `FARM-AID ALERT: ${alert.title}\n\n`;
    message += `${alert.message}\n\n`;
    
    if (alert.action) {
      message += `ACTION REQUIRED: ${alert.action}\n`;
    }
    
    if (alert.link) {
      message += `\nMore info: ${alert.link}`;
    }
    
    return message;
  }

  createReminderMessage(reminder) {
    let message = `FARM-AID REMINDER: ${reminder.title}\n\n`;
    message += `${reminder.description}\n\n`;
    message += `Due: ${reminder.dueDate}`;
    
    return message;
  }
}

export default new SMSService();