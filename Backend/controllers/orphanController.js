import Orphan from '../model/orphan_model.js';

export const registerOrphan = async (req, res) => {
  try {
    const { userId } = req.body;

    // Check if profile already exists
    const existingOrphan = await Orphan.findOne({ userId });
    if (existingOrphan) {
      return res.status(400).json({ message: 'Orphan profile already exists' });
    }

    const { name, age, gender, location } = req.body;
    const profilePic = req.files && req.files.profilePic && req.files.profilePic.length > 0 ? req.files.profilePic[0].path : '';
    const supportingDocs = req.files && req.files.supportingDocs && req.files.supportingDocs.length > 0 ? req.files.supportingDocs[0].path : '';

    const newOrphan = new Orphan({
      userId,
      name,
      age,
      gender,
      location,
      profilePic,
      supportingDocs,
    });

    await newOrphan.save();
    res.status(201).json({ message: 'Orphan registered successfully', orphan: newOrphan });
  } catch (error) {
    res.status(500).json({ message: 'Error registering orphan', error: error.message });
  }
};

export const getOrphanProfile = async (req, res) => {
  try {
    const orphan = await Orphan.findOne({ userId: req.params.id });
    if (!orphan) {
      return res.status(404).json({ message: 'Orphan not found' });
    }
    res.status(200).json({ orphan });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching orphan profile', error: error.message });
  }
};
