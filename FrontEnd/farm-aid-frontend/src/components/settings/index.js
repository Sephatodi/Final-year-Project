// Settings components index file
import DataManagement from './DataManagement';
import FarmDetailsForm from './FarmDetailsForm';
import LanguageSettings from './LanguageSettings';
import NotificationSettings from './NotificationSettings';
import ProfileForm from './ProfileForm';
import SecuritySettings from './SecuritySettings';
import SyncSettings from './SyncSettings';

export {
  DataManagement,
  FarmDetailsForm,
  LanguageSettings,
  NotificationSettings,
  ProfileForm,
  SecuritySettings,
  SyncSettings,
};

// Re-export all settings components as a single object
const SettingsComponents = {
  ProfileForm,
  FarmDetailsForm,
  LanguageSettings,
  NotificationSettings,
  SyncSettings,
  SecuritySettings,
  DataManagement,
};

export default SettingsComponents;
