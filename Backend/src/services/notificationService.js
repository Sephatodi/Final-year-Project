const nodemailer = require('nodemailer');
const twilio = require('twilio');
const { User } = require('../models');
const { Op } = require('sequelize');

class NotificationService {
  constructor() {
    this.emailTransporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: process.env.SMTP_PORT === '465',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });

    // Initialize SMS client if configured and valid
    if (process.env.TWILIO_ACCOUNT_SID && 
        process.env.TWILIO_ACCOUNT_SID.startsWith('AC') && 
        process.env.TWILIO_AUTH_TOKEN) {
      this.smsClient = twilio(
        process.env.TWILIO_ACCOUNT_SID,
        process.env.TWILIO_AUTH_TOKEN
      );
    } else {
      console.log('⚠️ Twilio SMS service not initialized: Missing or invalid TWILIO_ACCOUNT_SID (must start with "AC")');
    }

    this.io = null;
  }

  setSocketIO(io) {
    this.io = io;
  }

  async notifyVetsNewConsultation(consultation) {
    try {
      // Find available veterinarians in the same region
      const vets = await User.findAll({
        where: {
          role: 'veterinarian',
          region: consultation.Farmer?.region,
          isVerified: true
        }
      });

      const notifications = [];

      for (const vet of vets) {
        // Send email notification
        if (vet.email) {
          notifications.push(
            this.sendEmail({
              to: vet.email,
              subject: `New Consultation Request: ${consultation.subject}`,
              template: 'new-consultation',
              data: {
                vetName: vet.firstName,
                farmerName: consultation.Farmer?.firstName,
                subject: consultation.subject,
                priority: consultation.priority,
                consultationId: consultation.id,
                link: `${process.env.FRONTEND_URL}/consultations/${consultation.id}`
              }
            })
          );
        }

        // Send SMS if phone number available and priority is high
        if (vet.phoneNumber && ['high', 'emergency'].includes(consultation.priority)) {
          notifications.push(
            this.sendSMS({
              to: vet.phoneNumber,
              message: `New ${consultation.priority} consultation request from ${consultation.Farmer?.firstName}. Subject: ${consultation.subject}`
            })
          );
        }

        // Send real-time notification if online
        if (this.io) {
          this.io.to(`user-${vet.id}`).emit('new-consultation', {
            id: consultation.id,
            subject: consultation.subject,
            farmerName: consultation.Farmer?.firstName,
            priority: consultation.priority,
            timestamp: new Date()
          });
        }
      }

      await Promise.all(notifications);
    } catch (error) {
      console.error('Notify vets error:', error);
    }
  }

  async sendEmergencyAlert(consultation) {
    try {
      // Find all available vets for emergency
      const vets = await User.findAll({
        where: {
          role: 'veterinarian',
          isVerified: true
        }
      });

      const alerts = [];

      for (const vet of vets) {
        if (vet.phoneNumber) {
          alerts.push(
            this.sendSMS({
              to: vet.phoneNumber,
              message: `🚨 EMERGENCY: Urgent consultation needed for ${consultation.Farmer?.firstName}'s livestock. Subject: ${consultation.subject}`
            })
          );
        }

        if (this.io) {
          this.io.to(`user-${vet.id}`).emit('emergency-alert', {
            id: consultation.id,
            subject: consultation.subject,
            farmerName: consultation.Farmer?.firstName,
            farmerPhone: consultation.Farmer?.phoneNumber,
            symptoms: consultation.symptoms,
            timestamp: new Date()
          });
        }
      }

      // Also notify the farmer that help is on the way
      if (consultation.Farmer?.phoneNumber) {
        alerts.push(
          this.sendSMS({
            to: consultation.Farmer.phoneNumber,
            message: `Your emergency consultation request has been received. A veterinarian will respond shortly.`
          })
        );
      }

      await Promise.all(alerts);
    } catch (error) {
      console.error('Send emergency alert error:', error);
    }
  }

  async notifyAssignment(consultation) {
    try {
      const notifications = [];

      // Notify farmer
      if (consultation.Farmer?.email) {
        notifications.push(
          this.sendEmail({
            to: consultation.Farmer.email,
            subject: 'Veterinarian Assigned to Your Consultation',
            template: 'consultation-assigned',
            data: {
              farmerName: consultation.Farmer.firstName,
              vetName: consultation.Veterinarian?.firstName,
              consultationId: consultation.id,
              link: `${process.env.FRONTEND_URL}/consultations/${consultation.id}`
            }
          })
        );
      }

      // Notify vet
      if (consultation.Veterinarian?.email) {
        notifications.push(
          this.sendEmail({
            to: consultation.Veterinarian.email,
            subject: 'Consultation Assignment Confirmed',
            template: 'assignment-confirmed',
            data: {
              vetName: consultation.Veterinarian.firstName,
              consultationId: consultation.id,
              link: `${process.env.FRONTEND_URL}/consultations/${consultation.id}`
            }
          })
        );
      }

      // Real-time notifications
      if (this.io) {
        this.io.to(`user-${consultation.farmerId}`).emit('consultation-assigned', {
          id: consultation.id,
          vetName: consultation.Veterinarian?.firstName,
          timestamp: new Date()
        });

        this.io.to(`user-${consultation.veterinarianId}`).emit('assignment-confirmed', {
          id: consultation.id,
          farmerName: consultation.Farmer?.firstName,
          timestamp: new Date()
        });
      }

      await Promise.all(notifications);
    } catch (error) {
      console.error('Notify assignment error:', error);
    }
  }

  async notifyConsultationComplete(consultation) {
    try {
      // Notify farmer
      if (consultation.Farmer?.email) {
        await this.sendEmail({
          to: consultation.Farmer.email,
          subject: 'Your Consultation is Complete',
          template: 'consultation-complete',
          data: {
            farmerName: consultation.Farmer.firstName,
            consultationId: consultation.id,
            link: `${process.env.FRONTEND_URL}/consultations/${consultation.id}`
          }
        });
      }

      if (this.io) {
        this.io.to(`user-${consultation.farmerId}`).emit('consultation-complete', {
          id: consultation.id,
          timestamp: new Date()
        });
      }
    } catch (error) {
      console.error('Notify consultation complete error:', error);
    }
  }

  async notifyCancellation(consultation, cancelledBy) {
    try {
      const cancelledByUser = cancelledBy === consultation.farmerId ? 'Farmer' : 'Veterinarian';
      const notifyUserId = cancelledBy === consultation.farmerId ? 
        consultation.veterinarianId : consultation.farmerId;

      const user = await User.findByPk(notifyUserId);

      if (user?.email) {
        await this.sendEmail({
          to: user.email,
          subject: 'Consultation Cancelled',
          template: 'consultation-cancelled',
          data: {
            userName: user.firstName,
            cancelledBy: cancelledByUser,
            consultationId: consultation.id
          }
        });
      }

      if (this.io) {
        this.io.to(`user-${notifyUserId}`).emit('consultation-cancelled', {
          id: consultation.id,
          cancelledBy: cancelledByUser,
          timestamp: new Date()
        });
      }
    } catch (error) {
      console.error('Notify cancellation error:', error);
    }
  }

  async sendDiseaseAlert(disease, affectedRegion) {
    try {
      // Find farmers in affected region
      const farmers = await User.findAll({
        where: {
          role: 'farmer',
          region: affectedRegion
        }
      });

      const alerts = [];

      for (const farmer of farmers) {
        if (farmer.phoneNumber) {
          alerts.push(
            this.sendSMS({
              to: farmer.phoneNumber,
              message: `⚠️ DISEASE ALERT: ${disease.name} reported in your area. Symptoms: ${disease.symptoms.join(', ')}. Take preventive measures.`
            })
          );
        }

        if (farmer.email) {
          alerts.push(
            this.sendEmail({
              to: farmer.email,
              subject: `⚠️ Disease Alert: ${disease.name}`,
              template: 'disease-alert',
              data: {
                farmerName: farmer.firstName,
                diseaseName: disease.name,
                symptoms: disease.symptoms,
                prevention: disease.prevention,
                region: affectedRegion
              }
            })
          );
        }
      }

      await Promise.all(alerts);
    } catch (error) {
      console.error('Send disease alert error:', error);
    }
  }

  async sendVaccinationReminders() {
    try {
      const { Livestock, User } = require('../models');
      
      // Find livestock with upcoming vaccinations
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      const nextWeek = new Date();
      nextWeek.setDate(nextWeek.getDate() + 7);

      const livestock = await Livestock.findAll({
        where: {
          status: 'active',
          vaccinationStatus: {
            nextDue: {
              [Op.between]: [tomorrow, nextWeek]
            }
          }
        },
        include: [{
          model: User,
          as: 'User',
          attributes: ['id', 'firstName', 'email', 'phoneNumber']
        }]
      });

      const reminders = [];

      for (const animal of livestock) {
        const user = animal.User;
        
        if (user?.phoneNumber) {
          reminders.push(
            this.sendSMS({
              to: user.phoneNumber,
              message: `Reminder: ${animal.name || animal.tagNumber} (${animal.species}) is due for vaccination on ${new Date(animal.vaccinationStatus.nextDue).toLocaleDateString()}.`
            })
          );
        }

        if (user?.email) {
          reminders.push(
            this.sendEmail({
              to: user.email,
              subject: 'Vaccination Reminder',
              template: 'vaccination-reminder',
              data: {
                farmerName: user.firstName,
                animalName: animal.name || animal.tagNumber,
                species: animal.species,
                dueDate: animal.vaccinationStatus.nextDue,
                vaccineType: animal.vaccinationStatus.vaccines?.join(', ') || 'scheduled'
              }
            })
          );
        }
      }

      await Promise.all(reminders);
    } catch (error) {
      console.error('Send vaccination reminders error:', error);
    }
  }

  async sendEmail({ to, subject, template, data }) {
    try {
      // This would use a template engine like handlebars
      const html = this.renderTemplate(template, data);
      
      await this.emailTransporter.sendMail({
        from: process.env.SMTP_FROM || 'noreply@farm-aid.com',
        to,
        subject,
        html
      });
      
      console.log(`Email sent to ${to}`);
    } catch (error) {
      console.error('Send email error:', error);
    }
  }

  async sendSMS({ to, message }) {
    try {
      if (this.smsClient) {
        await this.smsClient.messages.create({
          body: message,
          from: process.env.TWILIO_PHONE_NUMBER,
          to: this.formatPhoneNumber(to)
        });
        console.log(`SMS sent to ${to}`);
      }
    } catch (error) {
      console.error('Send SMS error:', error);
    }
  }

  formatPhoneNumber(phone) {
    // Format Botswana phone numbers
    if (phone.startsWith('0')) {
      return '+267' + phone.substring(1);
    }
    return phone;
  }

  renderTemplate(template, data) {
    // Simple template rendering - would use proper template engine in production
    const templates = {
      'new-consultation': `
        <h2>New Consultation Request</h2>
        <p>Hello ${data.vetName},</p>
        <p>A new consultation has been requested by ${data.farmerName}.</p>
        <p><strong>Subject:</strong> ${data.subject}</p>
        <p><strong>Priority:</strong> ${data.priority}</p>
        <p><a href="${data.link}">View Consultation</a></p>
      `,
      'consultation-assigned': `
        <h2>Veterinarian Assigned</h2>
        <p>Hello ${data.farmerName},</p>
        <p>Dr. ${data.vetName} has been assigned to your consultation.</p>
        <p><a href="${data.link}">View Consultation</a></p>
      `,
      'consultation-complete': `
        <h2>Consultation Complete</h2>
        <p>Hello ${data.farmerName},</p>
        <p>Your consultation has been completed. You can view the recommendations in the app.</p>
        <p><a href="${data.link}">View Recommendations</a></p>
      `,
      'disease-alert': `
        <h2>⚠️ Disease Alert: ${data.diseaseName}</h2>
        <p>Hello ${data.farmerName},</p>
        <p><strong>Disease:</strong> ${data.diseaseName}</p>
        <p><strong>Symptoms:</strong> ${data.symptoms}</p>
        <p><strong>Prevention:</strong> ${data.prevention}</p>
        <p><strong>Affected Region:</strong> ${data.region}</p>
      `,
      'vaccination-reminder': `
        <h2>Vaccination Reminder</h2>
        <p>Hello ${data.farmerName},</p>
        <p>Your ${data.species} <strong>${data.animalName}</strong> is due for vaccination on ${new Date(data.dueDate).toLocaleDateString()}.</p>
        <p><strong>Vaccine:</strong> ${data.vaccineType}</p>
      `
    };

    return templates[template] || '<p>Notification</p>';
  }
}

module.exports = new NotificationService();