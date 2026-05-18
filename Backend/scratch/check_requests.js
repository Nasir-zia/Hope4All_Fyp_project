import mongoose from 'mongoose';
import dns from 'dns';

dns.setServers(['8.8.8.8', '8.8.4.4']);

const MONGO_URI = 'mongodb+srv://Admin123:Admin123@hope4all.a8mk8y5.mongodb.net/?appName=Hope4AllDB';

const requestSchema = new mongoose.Schema({
  orphanId: { type: mongoose.Schema.Types.ObjectId, ref: 'Orphan' },
  orphanageId: { type: mongoose.Schema.Types.ObjectId, ref: 'OrphanAge' },
  isInstitutional: Boolean,
  isUrgent: Boolean,
  type: String,
  units: Number,
  status: String,
  description: String
});

const Request = mongoose.model('Request', requestSchema);

const orphanSchema = new mongoose.Schema({
  name: String,
  classLevel: String,
  location: String
});
mongoose.model('Orphan', orphanSchema);

const preferences = {
  urgentOnly: true,
  causeType: ["Books"],
  area: ["Peshawar", "Multan", "Faisalabad"],
  schoolLevel: ["Primary"]
};

async function run() {
  try {
    await mongoose.connect(MONGO_URI, { dbName: 'Hope4AllDB' });
    console.log('Connected to MongoDB');
    
    const requests = await Request.find({ status: 'approved' }).populate('orphanId');
    console.log(`Found ${requests.length} approved requests in total.`);
    
    const matched = requests.filter(reqDoc => {
      // 1. Cause matching
      if (preferences.causeType?.length > 0) {
        const prefCauses = preferences.causeType.map(c => c.toLowerCase());
        if (!reqDoc.type || !prefCauses.includes(reqDoc.type.toLowerCase())) {
          return false;
        }
      }

      // 2. Urgent matching
      if (preferences.urgentOnly && !reqDoc.isUrgent) {
        return false;
      }

      // 3. School Level matching
      if (preferences.schoolLevel?.length > 0) {
        if (reqDoc.orphanId) {
          const prefLevels = preferences.schoolLevel.map(l => l.toLowerCase());
          const classLevel = reqDoc.orphanId.classLevel?.toLowerCase();
          if (classLevel && !prefLevels.includes(classLevel)) {
            return false;
          }
        }
      }

      // 4. Area/City matching
      if (preferences.area?.length > 0) {
        const prefAreas = preferences.area.map(a => a.trim().toLowerCase());
        const orphanCity = reqDoc.orphanId?.location?.trim().toLowerCase();
        const orphanageCity = (reqDoc.orphanageId?.location?.city || reqDoc.orphanageId?.location)?.trim().toLowerCase();
        
        const matchesOrphanArea = orphanCity && prefAreas.some(pref => orphanCity.includes(pref) || pref.includes(orphanCity));
        const matchesOrphanageArea = orphanageCity && prefAreas.some(pref => orphanageCity.includes(pref) || pref.includes(orphanageCity));

        if (!matchesOrphanArea && !matchesOrphanageArea) {
          return false;
        }
      }

      return true;
    });

    console.log(`Matched requests count after our safe logic: ${matched.length}`);
    matched.forEach(m => {
      console.log(`- ${m.description} (${m.type}) for orphan ${m.orphanId?.name}`);
    });

  } catch (err) {
    console.error('Error:', err);
  } finally {
    await mongoose.disconnect();
  }
}

run();
