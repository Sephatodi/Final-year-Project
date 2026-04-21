import PropTypes from 'prop-types';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Alert from '../common/Alert';
import Button from '../common/Button';
import Card from '../common/Card';

const NotificationSettings = ({ onUpdate }) => {
  const { t } = useTranslation();
  const [success, setSuccess] = useState(false);

  const [settings, setSettings] = useState({
    // Push Notifications
    pushEnabled: true,
    diseaseAlerts: true,
    weatherAlerts: true,
    movementRestrictions: true,
    marketUpdates: false,
    consultationMessages: true,
    
    // Email Notifications
    emailEnabled: false,
    emailDiseaseAlerts: true,
    emailWeeklyDigest: false,
    emailReports: true,
    
    // SMS Notifications
    smsEnabled: true,
    smsCriticalAlerts: true,
    smsDailySummary: false,
    
    // In-App Notifications
    inAppEnabled: true,
    soundEnabled: true,
    vibrationEnabled: true,
    previewEnabled: true,
    
    // Quiet Hours
    quietHoursEnabled: false,
    quietHoursStart: '22:00',
    quietHoursEnd: '07:00',
  });

  const handleToggle = (key) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSettings(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
    if (onUpdate) {
      onUpdate(settings);
    }
  };

  const NotificationSection = ({ title, icon, children }) => (
    <div className="mb-8">
      <div className="flex items-center gap-2 mb-4">
        <span className="material-icons-outlined text-primary">{icon}</span>
        <h3 className="font-bold text-lg">{title}</h3>
      </div>
      <div className="space-y-4">{children}</div>
    </div>
  );

  const NotificationToggle = ({ label, description, checked, onChange, disabled }) => (
    <label className={`flex items-center justify-between p-4 bg-sage-50 dark:bg-sage-900/20 rounded-lg cursor-pointer ${disabled ? 'opacity-50' : ''}`}>
      <div>
        <p className="font-medium">{label}</p>
        {description && <p className="text-xs text-sage-500">{description}</p>}
      </div>
      <div className="relative">
        <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
          disabled={disabled}
          className="sr-only peer"
        />
        <div className="w-11 h-6 bg-sage-300 rounded-full peer-checked:bg-primary peer-disabled:bg-sage-200 peer-focus:ring-2 peer-focus:ring-primary/50 transition-colors"></div>
        <div className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-5"></div>
      </div>
    </label>
  );

  return (
    <Card className="max-w-3xl mx-auto">
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-6">{t('settings.notifications') || 'Notification Settings'}</h2>

        {success && (
          <Alert
            type="success"
            message={t('settings.notificationsUpdated') || 'Notification settings updated!'}
            className="mb-6"
            dismissible
            autoDismiss
          />
        )}

        {/* Push Notifications */}
        <NotificationSection title={t('settings.pushNotifications') || 'Push Notifications'} icon="notifications">
          <NotificationToggle
            label={t('settings.enablePush') || 'Enable Push Notifications'}
            description={t('settings.pushHelp') || 'Receive notifications on your device'}
            checked={settings.pushEnabled}
            onChange={() => handleToggle('pushEnabled')}
          />

          <div className={`space-y-4 ml-6 ${!settings.pushEnabled ? 'opacity-50 pointer-events-none' : ''}`}>
            <NotificationToggle
              label={t('settings.diseaseAlerts') || 'Disease Alerts'}
              description={t('settings.diseaseHelp') || 'Critical disease outbreaks in your area'}
              checked={settings.diseaseAlerts}
              onChange={() => handleToggle('diseaseAlerts')}
            />

            <NotificationToggle
              label={t('settings.weatherAlerts') || 'Weather Alerts'}
              description={t('settings.weatherHelp') || 'Severe weather warnings'}
              checked={settings.weatherAlerts}
              onChange={() => handleToggle('weatherAlerts')}
            />

            <NotificationToggle
              label={t('settings.movementRestrictions') || 'Movement Restrictions'}
              description={t('settings.movementHelp') || 'Updates on livestock movement bans'}
              checked={settings.movementRestrictions}
              onChange={() => handleToggle('movementRestrictions')}
            />

            <NotificationToggle
              label={t('settings.marketUpdates') || 'Market Updates'}
              description={t('settings.marketHelp') || 'Price changes and market news'}
              checked={settings.marketUpdates}
              onChange={() => handleToggle('marketUpdates')}
            />

            <NotificationToggle
              label={t('settings.consultationMessages') || 'Consultation Messages'}
              description={t('settings.consultationHelp') || 'New messages from veterinarians'}
              checked={settings.consultationMessages}
              onChange={() => handleToggle('consultationMessages')}
            />
          </div>
        </NotificationSection>

        {/* Email Notifications */}
        <NotificationSection title={t('settings.emailNotifications') || 'Email Notifications'} icon="email">
          <NotificationToggle
            label={t('settings.enableEmail') || 'Enable Email Notifications'}
            description={t('settings.emailHelp') || 'Receive notifications via email'}
            checked={settings.emailEnabled}
            onChange={() => handleToggle('emailEnabled')}
          />

          <div className={`space-y-4 ml-6 ${!settings.emailEnabled ? 'opacity-50 pointer-events-none' : ''}`}>
            <NotificationToggle
              label={t('settings.emailDiseaseAlerts') || 'Disease Alerts'}
              checked={settings.emailDiseaseAlerts}
              onChange={() => handleToggle('emailDiseaseAlerts')}
            />

            <NotificationToggle
              label={t('settings.weeklyDigest') || 'Weekly Digest'}
              description={t('settings.digestHelp') || 'Summary of weekly activities'}
              checked={settings.emailWeeklyDigest}
              onChange={() => handleToggle('emailWeeklyDigest')}
            />

            <NotificationToggle
              label={t('settings.emailReports') || 'Reports'}
              description={t('settings.reportsHelp') || 'Monthly herd reports and analytics'}
              checked={settings.emailReports}
              onChange={() => handleToggle('emailReports')}
            />
          </div>
        </NotificationSection>

        {/* SMS Notifications */}
        <NotificationSection title={t('settings.smsNotifications') || 'SMS Notifications'} icon="sms">
          <NotificationToggle
            label={t('settings.enableSMS') || 'Enable SMS Notifications'}
            description={t('settings.smsHelp') || 'Receive text messages for critical alerts'}
            checked={settings.smsEnabled}
            onChange={() => handleToggle('smsEnabled')}
          />

          <div className={`space-y-4 ml-6 ${!settings.smsEnabled ? 'opacity-50 pointer-events-none' : ''}`}>
            <NotificationToggle
              label={t('settings.smsCriticalAlerts') || 'Critical Alerts Only'}
              description={t('settings.criticalHelp') || 'Only FMD and emergency alerts'}
              checked={settings.smsCriticalAlerts}
              onChange={() => handleToggle('smsCriticalAlerts')}
            />

            <NotificationToggle
              label={t('settings.smsDailySummary') || 'Daily Summary'}
              description={t('settings.smsSummaryHelp') || 'End-of-day summary via SMS'}
              checked={settings.smsDailySummary}
              onChange={() => handleToggle('smsDailySummary')}
            />
          </div>
        </NotificationSection>

        {/* In-App Settings */}
        <NotificationSection title={t('settings.inAppSettings') || 'In-App Settings'} icon="settings_applications">
          <NotificationToggle
            label={t('settings.inAppEnabled') || 'Enable In-App Notifications'}
            checked={settings.inAppEnabled}
            onChange={() => handleToggle('inAppEnabled')}
          />

          <div className={`space-y-4 ${!settings.inAppEnabled ? 'opacity-50 pointer-events-none' : ''}`}>
            <NotificationToggle
              label={t('settings.sound') || 'Sound'}
              description={t('settings.soundHelp') || 'Play sound for notifications'}
              checked={settings.soundEnabled}
              onChange={() => handleToggle('soundEnabled')}
            />

            <NotificationToggle
              label={t('settings.vibration') || 'Vibration'}
              description={t('settings.vibrationHelp') || 'Vibrate on notification'}
              checked={settings.vibrationEnabled}
              onChange={() => handleToggle('vibrationEnabled')}
            />

            <NotificationToggle
              label={t('settings.messagePreview') || 'Message Preview'}
              description={t('settings.previewHelp') || 'Show message content in notification'}
              checked={settings.previewEnabled}
              onChange={() => handleToggle('previewEnabled')}
            />
          </div>
        </NotificationSection>

        {/* Quiet Hours */}
        <NotificationSection title={t('settings.quietHours') || 'Quiet Hours'} icon="bedtime">
          <NotificationToggle
            label={t('settings.enableQuietHours') || 'Enable Quiet Hours'}
            description={t('settings.quietHelp') || 'Mute notifications during specified hours'}
            checked={settings.quietHoursEnabled}
            onChange={() => handleToggle('quietHoursEnabled')}
          />

          {settings.quietHoursEnabled && (
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block text-sm font-medium mb-2">{t('settings.from') || 'From'}</label>
                <input
                  type="time"
                  name="quietHoursStart"
                  value={settings.quietHoursStart}
                  onChange={handleChange}
                  className="w-full p-2 rounded-lg border border-sage-200 dark:border-sage-800 bg-white dark:bg-sage-900"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">{t('settings.to') || 'To'}</label>
                <input
                  type="time"
                  name="quietHoursEnd"
                  value={settings.quietHoursEnd}
                  onChange={handleChange}
                  className="w-full p-2 rounded-lg border border-sage-200 dark:border-sage-800 bg-white dark:bg-sage-900"
                />
              </div>
            </div>
          )}
        </NotificationSection>

        {/* Save Button */}
        <div className="flex justify-end pt-6">
          <Button
            variant="primary"
            onClick={handleSave}
            icon="save"
          >
            {t('common.saveChanges') || 'Save Changes'}
          </Button>
        </div>
      </div>
    </Card>
  );
};

NotificationSettings.propTypes = {
  onUpdate: PropTypes.func,
};

export default NotificationSettings;