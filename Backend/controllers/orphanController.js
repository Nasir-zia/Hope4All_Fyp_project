import Orphan from '../model/orphan_model.js';

export const registerOrphan = async (req, res) => {
  try {
    const { name, age, gender, location } = req.body;
    const profilePic = req.files && req.files.profilePic ? req.files.profilePic[0].path : '';
    const supportingDocs = req.files && req.files.supportingDocs ? req.files.supportingDocs[0].path : '';

    const newOrphan = new Orphan({
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
