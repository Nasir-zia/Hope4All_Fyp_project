import OrphanAge from "../model/orphan_age.js";

export const createOrphanAge = async (req, res) => {
  try {
    // Filter files by fieldname
    const registrationCertFile = req.files ? req.files.find(file => file.fieldname === "registrationCert") : null;
    const buildingImagesFiles = req.files ? req.files.filter(file => file.fieldname === "buildingImages") : [];

    const registrationCert = registrationCertFile ? registrationCertFile.path : null;
    const buildingImages = buildingImagesFiles.map(file => file.path);

    const { 
      userId, name, registrationNumber, establishedYear, managerName, staffCount,
      "location[address]": address, "location[city]": city, "location[state]": state, "location[zipCode]": zipCode,
      "contactInfo[phone]": phone, "contactInfo[email]": email,
      "capacity[current]": currentCapacity, "capacity[max]": maxCapacity
    } = req.body;
    
    const newOrphanage = new OrphanAge({
      userId,
      name,
      registrationNumber,
      establishedYear,
      managerName,
      staffCount,
      location: { address, city, state, zipCode },
      contactInfo: { phone, email },
      capacity: { 
        current: parseInt(currentCapacity) || 0, 
        max: parseInt(maxCapacity) || 0 
      },
      documents: {
        registrationCert,
        buildingImages,
      },
    });

    await newOrphanage.save();

    res.status(201).json({
      success: true,
      message: "Orphanage created successfully!",
      data: newOrphanage,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error.",
      error: error.message,
    });
  }
};

export const getOrphanages = async (req, res) => {
  try {
    const orphanages = await OrphanAge.find({ status: 'approved' });
    res.status(200).json({ success: true, data: orphanages });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getOrphanageProfile = async (req, res) => {
  try {
    const orphanage = await OrphanAge.findOne({ userId: req.params.userId });
    if (!orphanage) return res.status(404).json({ message: 'Orphanage not found' });
    res.status(200).json({ orphanage });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
