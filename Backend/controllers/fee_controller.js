import Fee from "../model/fee_model.js";

// Add a fee request by/for an orphan
export const createFee = async (req, res) => {
  try {
    const { orphanId, title, amount, dueDate } = req.body;
    
    if (!orphanId || !title || !amount || !dueDate) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    const newFee = new Fee({
      orphanId,
      title,
      amount,
      dueDate
    });

    await newFee.save();
    res.status(201).json({ success: true, message: "Fee request created successfully", fee: newFee });
  } catch (error) {
    console.error("Create Fee error:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// Get fees specifically for one orphan
export const getOrphanFees = async (req, res) => {
  try {
    const { orphanId } = req.params;
    const fees = await Fee.find({ orphanId }).populate('pledgedBy', 'name email').sort({ dueDate: 1 });
    res.status(200).json({ success: true, fees });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// Get all pending fees for donors to view
export const getAvailableFees = async (req, res) => {
  try {
    const fees = await Fee.find({ status: "pending" })
      .populate('orphanId', 'name location profilePic')
      .sort({ dueDate: 1 });
    res.status(200).json({ success: true, fees });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// Donor pledges to pay the fee
export const pledgeFee = async (req, res) => {
  try {
    const { feeId } = req.params;
    const { donorId } = req.body;

    if (!donorId) {
      return res.status(400).json({ success: false, message: "Donor ID is required" });
    }

    const fee = await Fee.findById(feeId);
    if (!fee) {
      return res.status(404).json({ success: false, message: "Fee not found" });
    }

    if (fee.status !== "pending") {
      return res.status(400).json({ success: false, message: "Fee is already pledged or paid" });
    }

    fee.status = "pledged";
    fee.pledgedBy = donorId;
    await fee.save();

    res.status(200).json({ success: true, message: "Fee pledged successfully", fee });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// Donor confirms payment — transitions fee from pledged → paid
export const markFeePaid = async (req, res) => {
  try {
    const { feeId } = req.params;

    const fee = await Fee.findById(feeId);
    if (!fee) {
      return res.status(404).json({ success: false, message: "Fee not found" });
    }

    if (fee.status === "paid") {
      return res.status(400).json({ success: false, message: "Fee is already marked as paid" });
    }

    if (fee.status !== "pledged") {
      return res.status(400).json({ success: false, message: "Only pledged fees can be marked as paid" });
    }

    fee.status = "paid";
    await fee.save();

    res.status(200).json({ success: true, message: "Fee marked as paid successfully", fee });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};
