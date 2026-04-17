import OrphanAge from "../model/orphan_age.js";

export const createOrphanAge = async (req, res) => {
  try {
    // Filter files by fieldname
    const registrationCertFile = req.files ? req.files.find(file => file.fieldname === "registrationCert") : null;
    const buildingImagesFiles = req.files ? req.files.filter(file => file.fieldname === "buildingImages") : [];

    const registrationCert = registrationCertFile ? registrationCertFile.path : null;
    const buildingImages = buildingImagesFiles.map(file => file.path);

    const newOrphanage = new OrphanAge({
      ...req.body,
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
    const orphanages = await OrphanAge.find({}, 'name location.city');
    res.status(200).json({ success: true, data: orphanages });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
