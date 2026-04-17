import Donor from '../model/donor_model.js';
import Donation from '../model/donation_model.js';
import Notification from '../model/notification_model.js';
import Request from '../model/request_model.js';
import Orphan from '../model/orphan_model.js';


export const registerDonor = async (req, res) => {
  try {
    const { userId, name, email, phone, city } = req.body;

    const newDonor = new Donor({
      userId,
      name,
      email,
      phone,
      city,
    });

    await newDonor.save();
    res.status(201).json({ message: 'Donor registered successfully', donor: newDonor });
  } catch (error) {
    res.status(500).json({ message: 'Error registering donor', error: error.message });
  }
};

// New registration endpoint with file uploads
export const registerDonorWithFiles = async (req, res) => {
  try {
    const { userId, name, email, phone, city } = req.body;

    // Create base donor object
    const donorData = {
      userId,
      name,
      email,
      phone,
      city,
    };

    // Handle profile picture upload
    if (req.files && req.files.profilePic && req.files.profilePic[0]) {
      donorData.profilePic = req.files.profilePic[0].path;
    }

    // Handle document uploads
    if (req.files && req.files.documents) {
      const documents = req.files.documents.map(file => ({
        name: file.originalname,
        url: file.path,
        type: file.mimetype,
        uploadedAt: new Date()
      }));
      donorData.documents = documents;
    }

    const newDonor = new Donor(donorData);
    await newDonor.save();
    
    res.status(201).json({ message: 'Donor registered successfully', donor: newDonor });
  } catch (error) {
    res.status(500).json({ message: 'Error registering donor with files', error: error.message });
  }
};

export const getDonors = async (req, res) => {
  try {
    const donors = await Donor.find();
    res.status(200).json({ donors });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching donors', error: error.message });
  }
};


export const getDonorProfile = async (req, res) => {
  try {
    // Handle both userId and donorId parameters
    const { id } = req.params;
    let donor;
    
    // Check if it's a userId (string) or donorId (MongoDB ObjectId)
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      // It's a valid ObjectId, try as donorId first
      donor = await Donor.findById(id);
    }
    
    if (!donor) {
      // Try as userId
      donor = await Donor.findOne({ userId: id });
    }
    
    if (!donor) {
      return res.status(404).json({ message: 'Donor not found' });
    }
    res.status(200).json({ donor });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching donor profile', error: error.message });
  }
};

export const updateDonorProfile = async (req, res) => {
  try {
    const { name, email, phone, city, preferences, notificationSettings } = req.body;

    const updateData = { name, email, phone, city, preferences, notificationSettings };

    // Handle profile picture upload
    if (req.files && req.files.profilePic && req.files.profilePic[0]) {
      updateData.profilePic = req.files.profilePic[0].path;
    }

    // Handle document uploads
    if (req.files && req.files.documents) {
      const documents = req.files.documents.map(file => ({
        name: file.originalname,
        url: file.path,
        type: file.mimetype,
        uploadedAt: new Date()
      }));

      // Get existing documents and append new ones
      const existingDonor = await Donor.findOne({ userId: req.params.id });
      if (existingDonor) {
        updateData.documents = [...(existingDonor.documents || []), ...documents];
      } else {
        updateData.documents = documents;
      }
    }

    const updatedDonor = await Donor.findOneAndUpdate(
      { userId: req.params.id },
      updateData,
      { new: true }
    );

    if (!updatedDonor) {
      return res.status(404).json({ message: 'Donor not found' });
    }

    res.status(200).json({ message: 'Profile updated successfully', donor: updatedDonor });
  } catch (error) {
    res.status(500).json({ message: 'Error updating profile', error: error.message });
  }
};

export const makeDonation = async (req, res) => {
  try {
    const { donorId, requestId, units, recipientName } = req.body;

    // Fetch the request to get details
    const request = await Request.findById(requestId).populate('orphanId', 'name');
    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    const donation = new Donation({
      donorId,
      requestId,
      units,
      recipientName,
      recipientId: request.orphanId._id,
    });

    await donation.save();

    // Update donor stats
    await Donor.findByIdAndUpdate(donorId, {
      $inc: { totalDonated: units, childrenHelped: 1 }
    });

    await Request.findByIdAndUpdate(requestId, { status: 'fulfilled' });

    // Create notification
    const notification = new Notification({
      donorId,
      type: 'delivery',
      title: 'Donation Processed',
      message: `Your donation of ${units} ${request.unitType} has been processed successfully.`,
    });

    await notification.save();

    // Add orphan to donor's matched orphans if not already matched
    const donor = await Donor.findById(donorId);
    if (!donor.matchedOrphans.includes(request.orphanId._id)) {
      donor.matchedOrphans.push(request.orphanId._id);
      await donor.save();
    }

    res.status(201).json({ message: 'Donation successful', donation });
  } catch (error) {
    res.status(500).json({ message: 'Error processing donation', error: error.message });
  }
};


export const getDonationHistory = async (req, res) => {
  try {
    // Handle both userId and donorId parameters
    const { id } = req.params;
    let donor;
    
    // Check if it's a userId (string) or donorId (MongoDB ObjectId)
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      // It's a valid ObjectId, try as donorId first
      donor = await Donor.findById(id);
    }
    
    if (!donor) {
      // Try as userId
      donor = await Donor.findOne({ userId: id });
    }
    
    if (!donor) {
      return res.status(404).json({ message: 'Donor not found' });
    }

    const donations = await Donation.find({ donorId: donor._id })
      .populate('requestId', 'type unitType description school')
      .populate('recipientId', 'name age gender location profilePic')
      .sort({ createdAt: -1 });

    res.status(200).json({ donations });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching donation history', error: error.message });
  }
};

// Get orphans that donor has donated to
export const getDonorOrphans = async (req, res) => {
  try {
    const donations = await Donation.find({ donorId: req.params.id })
      .populate('recipientId', 'name age gender location profilePic')
      .sort({ createdAt: -1 });

    // Get unique orphans
    const orphanMap = new Map();
    donations.forEach(donation => {
      if (donation.recipientId && !orphanMap.has(donation.recipientId._id.toString())) {
        orphanMap.set(donation.recipientId._id.toString(), donation.recipientId);
      }
    });

    const orphans = Array.from(orphanMap.values());
    res.status(200).json({ orphans });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching donor orphans', error: error.message });
  }
};

// Update donation
export const updateDonation = async (req, res) => {
  try {
    const { units, status } = req.body;
    
    const donation = await Donation.findById(req.params.donationId);
    if (!donation) {
      return res.status(404).json({ message: 'Donation not found' });
    }

    // Update donation
    if (units !== undefined) donation.units = units;
    if (status !== undefined) donation.status = status;
    
    await donation.save();

    res.status(200).json({ message: 'Donation updated successfully', donation });
  } catch (error) {
    res.status(500).json({ message: 'Error updating donation', error: error.message });
  }
};

// Delete donation
export const deleteDonation = async (req, res) => {
  try {
    const donation = await Donation.findByIdAndDelete(req.params.donationId);
    
    if (!donation) {
      return res.status(404).json({ message: 'Donation not found' });
    }

    // Update donor stats
    await Donor.findByIdAndUpdate(donation.donorId, {
      $inc: { totalDonated: -donation.units, childrenHelped: -1 }
    });

    res.status(200).json({ message: 'Donation deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting donation', error: error.message });
  }
};


export const getNotifications = async (req, res) => {
  try {
    // Handle both userId and donorId parameters
    const { id } = req.params;
    let donor;
    
    // Check if it's a userId (string) or donorId (MongoDB ObjectId)
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      // It's a valid ObjectId, try as donorId first
      donor = await Donor.findById(id);
    }
    
    if (!donor) {
      // Try as userId
      donor = await Donor.findOne({ userId: id });
    }
    
    if (!donor) {
      return res.status(404).json({ message: 'Donor not found' });
    }

    const notifications = await Notification.find({ donorId: donor._id })
      .sort({ createdAt: -1 });

    res.status(200).json({ notifications });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching notifications', error: error.message });
  }
};

export const markNotificationRead = async (req, res) => {
  try {
    await Notification.findByIdAndUpdate(req.params.notificationId, { unread: false });
    res.status(200).json({ message: 'Notification marked as read' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating notification', error: error.message });
  }
};


// Get matched orphans based on donor preferences
export const getMatchedOrphans = async (req, res) => {
  try {
    // Handle both userId and donorId parameters
    const { id } = req.params;
    let donor;
    
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      donor = await Donor.findById(id);
    }
    
    if (!donor) {
      donor = await Donor.findOne({ userId: id });
    }
    
    if (!donor) {
      return res.status(404).json({ message: 'Donor not found' });
    }

    // Determine if we should apply strict matching
    const hasAreaPref = donor.preferences.area && donor.preferences.area.length > 0;
    const hasLevelPref = donor.preferences.schoolLevel && donor.preferences.schoolLevel.length > 0;
    const hasCausePref = donor.preferences.causeType && donor.preferences.causeType.length > 0;

    let matchCriteria = {};

    // 1. Filter by Location if preference exists
    if (hasAreaPref) {
      matchCriteria.location = { $in: donor.preferences.area };
    }

    // 2. Filter by School Level/Age if preference exists
    if (hasLevelPref) {
      const ageRanges = [];
      donor.preferences.schoolLevel.forEach(level => {
        switch (level.toLowerCase()) {
          case 'primary': ageRanges.push({ $gte: 5, $lte: 12 }); break;
          case 'secondary': ageRanges.push({ $gte: 13, $lte: 18 }); break;
          case 'higher': ageRanges.push({ $gte: 19 }); break;
        }
      });
      if (ageRanges.length > 0) {
        matchCriteria.$or = ageRanges.map(range => ({ age: range }));
      }
    }

    // Find orphans matching base criteria (location + age)
    let orphans = await Orphan.find(matchCriteria);

    // 3. Filter by Cause Type ONLY if explicitly requested
    if (hasCausePref) {
      const causeTypeMap = {
        'education': ['school_fees', 'books', 'stationery'],
        'healthcare': ['medical'],
        'clothing': ['uniforms'],
        'other': ['other']
      };

      const matchingTypes = [];
      donor.preferences.causeType.forEach(cause => {
        if (causeTypeMap[cause.toLowerCase()]) {
          matchingTypes.push(...causeTypeMap[cause.toLowerCase()]);
        }
      });

      if (matchingTypes.length > 0) {
        const activeRequests = await Request.find({
          type: { $in: matchingTypes },
          status: 'approved'
        }).select('orphanId');

        const orphanWithRequests = activeRequests.map(r => r.orphanId.toString());
        orphans = orphans.filter(o => orphanWithRequests.includes(o._id.toString()));
      }
    }

    // 4. Exclude already matched orphans
    const matchedOrphanIds = donor.matchedOrphans.map(id => id.toString());
    orphans = orphans.filter(orphan => !matchedOrphanIds.includes(orphan._id.toString()));

    // Fallback: If strict matching resulted in 0 orphans but there are orphans available, 
    // maybe we return some relevant orphans regardless of minor preference mismatch? 
    // For now, we stick to the more lenient base find above.

    res.status(200).json({ orphans });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching matched orphans', error: error.message });
  }
};

export const getPreferenceOptions = async (req, res) => {
  try {
    const options = {
      causeTypes: ['Education', 'Healthcare', 'Clothing', 'Other'],
      schoolLevels: ['Primary', 'Secondary', 'Higher'],
      areas: ['Karachi', 'Lahore', 'Islamabad', 'Peshawar', 'Quetta', 'Multan']
    };
    res.status(200).json({ options });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching preference options', error: error.message });
  }
};

export const deleteDonor = async (req, res) => {
  try {
    const donor = await Donor.findOneAndDelete({ userId: req.params.id });
    if (!donor) {
      return res.status(404).json({ message: 'Donor not found' });
    }
    res.status(200).json({ message: 'Donor deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting donor', error: error.message });
  }
};
