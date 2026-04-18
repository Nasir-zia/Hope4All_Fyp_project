import Request from '../model/request_model.js';
import Orphan from '../model/orphan_model.js';
import Notification from '../model/notification_model.js';

export const submitRequest = async (req, res) => {
  try {
    const { orphanId, orphanageId, type, units, unitType, description, school, class: classLevel } = req.body;
    const documents = req.files ? req.files.map(file => file.path) : [];

    // Verify orphan exists - try by direct ID first, then by userId
    let orphan = await Orphan.findById(orphanId);
    if (!orphan) {
      orphan = await Orphan.findOne({ userId: orphanId });
    }

    if (!orphan) {
      return res.status(404).json({ message: 'Orphan profile not found' });
    }

    const newRequest = new Request({
      orphanId,
      orphanageId,
      type,
      units,
      unitType,
      description,
      school,
      class: classLevel,
      documents,
    });

    await newRequest.save();

    // Create notification for admin
    const notification = new Notification({
      type: 'request',
      title: 'New Request Submitted',
      message: `New ${type} request submitted for ${orphan.name}`,
    });

    await notification.save();

    res.status(201).json({ message: 'Request submitted successfully', request: newRequest });
  } catch (error) {
    res.status(500).json({ message: 'Error submitting request', error: error.message });
  }
};

export const getRequestsByOrphan = async (req, res) => {
  try {
    const requests = await Request.find({ orphanId: req.params.orphanId })
      .populate('orphanId', 'name')
      .sort({ createdAt: -1 });

    res.status(200).json({ requests });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching requests', error: error.message });
  }
};

export const getAllRequests = async (req, res) => {
  try {
    const { status, type } = req.query;
    let filter = {};

    if (status) filter.status = status;
    if (type) filter.type = type;

    const requests = await Request.find(filter)
      .populate('orphanId', 'name age gender')
      .populate('orphanageId', 'name')
      .sort({ createdAt: -1 });

    res.status(200).json({ requests });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching requests', error: error.message });
  }
};

export const updateRequestStatus = async (req, res) => {
  try {
    const { status, adminComments } = req.body;

    const updatedRequest = await Request.findByIdAndUpdate(
      req.params.requestId,
      { status, adminComments, updatedAt: Date.now() },
      { new: true }
    ).populate('orphanId', 'name');

    if (!updatedRequest) {
      return res.status(404).json({ message: 'Request not found' });
    }

    // Skipping notification for now as Notification model requires donorId
    // which is not applicable for orphan notifications.

    res.status(200).json({ message: 'Request status updated', request: updatedRequest });
  } catch (error) {
    res.status(500).json({ message: 'Error updating request status', error: error.message });
  }
};

export const rejectRequest = async (req, res) => {
  try {
    const { donorId } = req.body;
    const request = await Request.findById(req.params.requestId);
    
    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    if (!request.rejectedBy.includes(donorId)) {
      request.rejectedBy.push(donorId);
      await request.save();
    }

    res.status(200).json({ message: 'Request dismissed for this donor' });
  } catch (error) {
    res.status(500).json({ message: 'Error dismissing request', error: error.message });
  }
};
