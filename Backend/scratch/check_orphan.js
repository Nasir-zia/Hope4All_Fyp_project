import mongoose from 'mongoose';
import dns from 'dns';

dns.setServers(['8.8.8.8', '8.8.4.4']);

const MONGO_URI = 'mongodb+srv://Admin123:Admin123@hope4all.a8mk8y5.mongodb.net/?appName=Hope4AllDB';

const orphanSchema = new mongoose.Schema({}, { strict: false });
const Orphan = mongoose.model('Orphan', orphanSchema);

async function run() {
  try {
    await mongoose.connect(MONGO_URI, { dbName: 'Hope4AllDB' });
    console.log('Connected to MongoDB');
    
    const orphan = await Orphan.findById('6a05d2cd23f2b3e371ffbd55');
    console.log('Orphan profile:');
    console.log(JSON.stringify(orphan, null, 2));
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await mongoose.disconnect();
  }
}

run();
