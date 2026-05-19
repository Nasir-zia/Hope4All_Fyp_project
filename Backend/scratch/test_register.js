import dns from "dns";
dns.setServers(['8.8.8.8', '8.8.4.4']);
import mongoose from "mongoose";
import dotenv from "dotenv";
import { createOrphanAge } from "../controllers/orphan_agecontroller.js";

dotenv.config();

const run = async () => {
  await mongoose.connect(process.env.MONGO_URI, { dbName: 'Hope4AllDB' });
  console.log("Connected to DB");

  // Fetch a user to use as userId
  const User = mongoose.model('User');
  const user = await User.findOne({ role: 'orphanage' });
  if (!user) {
    console.error("No orphanage user found in DB!");
    process.exit(1);
  }
  console.log("Using User ID:", user._id);

  const mockReq = {
    files: [],
    body: {
      userId: user._id.toString(),
      name: "Debug Orphanage",
      registrationNumber: "REG-DEBUG-1234",
      establishedYear: 2020,
      managerName: "Debug Manager",
      staffCount: 10,
      'location[address]': "123 Street",
      'location[city]': "Faisalabad",
      'location[state]': "Punjab",
      'location[zipCode]': "38000",
      'contactInfo[phone]': "03001234567",
      'contactInfo[email]': "debug@orphanage.com",
      'capacity[current]': "0",
      'capacity[max]': "100"
    }
  };

  const mockRes = {
    status: function(code) {
      console.log("Response status:", code);
      return this;
    },
    json: function(data) {
      console.log("Response JSON:", JSON.stringify(data, null, 2));
      process.exit(0);
    }
  };

  try {
    await createOrphanAge(mockReq, mockRes);
  } catch (err) {
    console.error("Caught error:", err);
    process.exit(1);
  }
};

run();
