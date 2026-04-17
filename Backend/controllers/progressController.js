import Progress from '../model/progress_model.js';

export const addProgress = async (req, res) => {
  try {
    const { orphanId, title, category, score, remarks, verifiedBy } = req.body;

    const newProgress = new Progress({
      orphanId,
      title,
      category,
      score,
      remarks,
      verifiedBy
    });

    await newProgress.save();
    res.status(201).json({ message: 'Progress report added successfully', progress: newProgress });
  } catch (error) {
    res.status(500).json({ message: 'Error adding progress report', error: error.message });
  }
};

export const getOrphanProgress = async (req, res) => {
  try {
    const { orphanId } = req.params;
    const progress = await Progress.find({ orphanId }).sort({ date: -1 });
    res.status(200).json({ progress });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching progress reports', error: error.message });
  }
};

export const deleteProgress = async (req, res) => {
  try {
    await Progress.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Progress report deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting progress report', error: error.message });
  }
};
