// Config index file
import aiConfig from './ai.config';
import apiConfig from './api.config';
import appConfig from './app.config';
import offlineConfig from './offline.config';
import syncConfig from './sync.config';
import themeConfig from './theme.config';

// Environment detection
export const isDevelopment = process.env.NODE_ENV === 'development';
export const isProduction = process.env.NODE_ENV === 'production';
export const isTest = process.env.NODE_ENV === 'test';

// Get config based on environment
export const getConfig = () => {
  const config = {
    app: appConfig,
    api: apiConfig,
    theme: themeConfig,
    offline: offlineConfig,
    sync: syncConfig,
    ai: aiConfig,
    env: {
      isDevelopment,
      isProduction,
      isTest,
    },
  };

  // Override with environment-specific config if needed
  if (isProduction) {
    // Production overrides
    config.api.baseUrl = process.env.REACT_APP_API_URL;
    config.offline.debug.enabled = false;
    config.sync.debug.enabled = false;
    config.ai.debug.enabled = false;
  }

  return config;
};

// Export individual configs
export {
    aiConfig, apiConfig, appConfig, offlineConfig,
    syncConfig, themeConfig
};

// Export combined config
const config = {
  app: appConfig,
  api: apiConfig,
  theme: themeConfig,
  offline: offlineConfig,
  sync: syncConfig,
  ai: aiConfig,
  env: {
    isDevelopment,
    isProduction,
    isTest,
  },
};

export default config;