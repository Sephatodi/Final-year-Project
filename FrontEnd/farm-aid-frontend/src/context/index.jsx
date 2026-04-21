import { AlertProvider, useAlert } from './AlertContext.jsx';
import { AuthProvider, useAuth } from './AuthContext.jsx';
import { LanguageProvider, useLanguage } from './LanguageContext.jsx';
import { OfflineProvider, useOffline } from './OfflineContext.jsx';
import { SyncProvider, useSync } from './SyncContext.jsx';
import { ThemeProvider, useTheme } from './ThemeContext.jsx';

export {
  AlertProvider, useAlert,
  AuthProvider, useAuth,
  LanguageProvider, useLanguage,
  OfflineProvider, useOffline,
  SyncProvider, useSync,
  ThemeProvider, useTheme
};

// Combined provider for easy wrapping
export const AppProviders = ({ children }) => {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <OfflineProvider>
            <SyncProvider>
              <AlertProvider>
                {children}
              </AlertProvider>
            </SyncProvider>
          </OfflineProvider>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
};