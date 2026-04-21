// Logger middleware for development
const logger = (store) => (next) => (action) => {
  if (process.env.NODE_ENV !== 'production') {
    console.group(`Action: ${action.type}`);
    console.log('Payload:', action.payload);
    console.log('Previous State:', store.getState());
    
    const result = next(action);
    
    console.log('Next State:', store.getState());
    console.groupEnd();
    
    return result;
  }
  
  return next(action);
};

export default logger;