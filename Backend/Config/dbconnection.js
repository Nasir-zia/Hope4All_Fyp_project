import mongoose from 'mongoose';

const dbConnection = async () => {
  const MAX_RETRIES = 5; 
  let attempt = 0;

  const connectWithRetry = async () => {
    try {
      await mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });

      console.log('MongoDB connected successfully');
    } catch (error) {
      attempt++;
      console.error(` MongoDB connection failed (Attempt ${attempt}/${MAX_RETRIES}):`, error.message);

      if (attempt < MAX_RETRIES) {
        console.log(' Retrying in 5 seconds...');
        setTimeout(connectWithRetry, 5000); // retry after 5 seconds
      } else {
        console.error(' Maximum connection attempts reached. Exiting application.');
        process.exit(1);
      }
    }
  };

  mongoose.connection.on('disconnected', () => {
    console.warn(' MongoDB disconnected! Trying to reconnect...');
    connectWithRetry();
  });

  mongoose.connection.on('connected', () => {
    console.log(' Mongoose connected to DB');
  });

  mongoose.connection.on('error', (err) => {
    console.error(' Mongoose connection error:', err.message);
  });

  // Initial connection
  connectWithRetry();
};

export default dbConnection;
