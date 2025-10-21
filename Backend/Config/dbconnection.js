import mongoose from 'mongoose';

const dbconnection = () => {
  mongoose.connect(process.env.MONGO_URI).then(() => console.log('MongoDB connected' )).catch(err => console.log(err));
};

export default dbconnection;
