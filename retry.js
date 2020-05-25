const pause = async ms => new Promise(resolve => setTimeout(resolve, ms));

const retry = async (callback, options = {}) => {
  const {
    count = 2,
    timeout = 100,
  } = options;
  
  const run = async (attempt = count) => {
    try {
      return await callback();
    } catch (error) {
      console.error(error);
      
      if (attempt) {
        await pause(timeout);
        
        return run(attempt - 1);
      }
      
      throw error;
    }
  };
  
  return run();
};

const retries = async (handlers, options) => Promise.all(handlers.map(handler => retry(handler, options)));

module.exports = { retry, retries };
