import mongoose from 'mongoose';
import dns from 'dns';

dns.setServers(['8.8.8.8', '8.8.4.4']);

const MONGO_URI = 'mongodb+srv://Admin123:Admin123@hope4all.a8mk8y5.mongodb.net/?appName=Hope4AllDB';

const donorSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  city: String,
  preferences: {
    causeType: [String],
    area: [String],
    schoolLevel: [String],
    urgentOnly: Boolean
  }
});

const Donor = mongoose.model('Donor', donorSchema);

async function run() {
  try {
    await mongoose.connect(MONGO_URI, { dbName: 'Hope4AllDB' });
    console.log('Connected to MongoDB');
    
    const donor = await Donor.findById('6a05d4d8b5f617fcd5abf889');
    console.log('Donor profile preferences:');
    console.log(JSON.stringify(donor, null, 2));
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await mongoose.disconnect();
  }
}

run();
