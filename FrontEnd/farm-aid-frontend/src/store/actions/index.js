// Actions index file
import authActions from './authActions';
import diseaseActions from './diseaseActions';
import livestockActions from './livestockActions';

// Re-export all action types for convenience
export * from './authActions';
export * from './diseaseActions';
export * from './livestockActions';

// Combine all actions for easy imports
const actions = {
  auth: authActions,
  livestock: livestockActions,
  disease: diseaseActions,
};

export default actions;