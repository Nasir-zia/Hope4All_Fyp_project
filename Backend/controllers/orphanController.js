import Orphan from '../model/orphan_model.js';

export const registerOrphan = async (req, res) => {
  try {
    const { userId } = req.body;
    console.log('[RegisterOrphan] Request for UserID:', userId);
    console.log('[RegisterOrphan] Files:', req.files);

    // Check if profile already exists
    const existingOrphan = await Orphan.findOne({ userId });
    if (existingOrphan) {
      console.log('[RegisterOrphan] Profile already exists');
      return res.status(400).json({ message: 'Orphan profile already exists' });
    }

    const { name, age, gender, location, orphanageId, phone } = req.body;
    
    // Check files presence - handle various Cloudinary/Multer response structures
    const profilePic = req.files?.profilePic?.[0] 
      ? (req.files.profilePic[0].path || req.files.profilePic[0].url || req.files.profilePic[0].secure_url) 
      : '';
      
    const supportingDocs = req.files?.supportingDocs?.[0]
      ? (req.files.supportingDocs[0].path || req.files.supportingDocs[0].url || req.files.supportingDocs[0].secure_url)
      : '';

    console.log('[RegisterOrphan] Detetcted Paths:', { profilePic, supportingDocs });

    const newOrphan = new Orphan({
      userId,
      name,
      age,
      gender,
      location,
      phone,
      orphanageId: orphanageId || undefined,
      profilePic,
      supportingDocs,
    });

    await newOrphan.save();
    console.log('[RegisterOrphan] Successfully saved profile for:', name);
    res.status(201).json({ message: 'Orphan registered successfully', orphan: newOrphan });
  } catch (error) {
    console.error('[RegisterOrphan] DATABASE ERROR:', error);
    res.status(500).json({ 
      message: 'Error registering orphan', 
      error: error.message,
      details: error.errors // Include Mongoose validation details if any
    });
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

export const updateOrphanProfile = async (req, res) => {
  try {
    const { id } = req.params; // userId
    const updateData = { ...req.body };

    // Handle file updates if provided
    if (req.files) {
      if (req.files.profilePic) {
        updateData.profilePic = req.files.profilePic[0].path || req.files.profilePic[0].url || req.files.profilePic[0].secure_url;
      }
      if (req.files.supportingDocs) {
        updateData.supportingDocs = req.files.supportingDocs[0].path || req.files.supportingDocs[0].url || req.files.supportingDocs[0].secure_url;
      }
    }

    const updatedOrphan = await Orphan.findOneAndUpdate(
      { userId: id },
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!updatedOrphan) {
      return res.status(404).json({ message: 'Orphan profile not found' });
    }

    console.log('[UpdateOrphan] Successfully updated profile for:', updatedOrphan.name);
    res.status(200).json({ message: 'Profile updated successfully', orphan: updatedOrphan });
  } catch (error) {
    console.error('[UpdateOrphan] Error:', error);
    res.status(500).json({ message: 'Error updating orphan profile', error: error.message });
  }
};
