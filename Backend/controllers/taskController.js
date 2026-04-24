import Task from '../model/task_model.js';
import User from '../model/user_model.js';
import Notification from '../model/notification_model.js';

export const createTask = async (req, res) => {
  try {
    const { volunteerId, title, description, type, school, orphanageId, date, priority, notes, assignedBy } = req.body;

    // Support bulk assignment if volunteerId is an array
    const ids = Array.isArray(volunteerId) ? volunteerId : [volunteerId];
    const tasks = [];

    for (const vId of ids) {
      const newTask = new Task({
        volunteerId: vId,
        title,
        description,
        type: type || 'other',
        school: school || 'N/A',
        orphanageId,
        date: date || new Date(),
        priority: priority || 'medium',
        assignedBy: assignedBy || vId,
        notes,
      });

      await newTask.save();
      tasks.push(newTask);

      // Notify the assigned volunteer
      const notification = new Notification({
        recipientId: vId,
        type: 'task',
        title: 'New Task Assigned',
        message: `New task "${title}" has been assigned to you`,
      });
      await notification.save();
    }

    res.status(201).json({ 
      message: ids.length > 1 ? 'Tasks broadcasted to all volunteers' : 'Task created successfully', 
      task: tasks[0], 
      allTasks: tasks 
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creating task', error: error.message });
  }
};

export const getTasksByVolunteer = async (req, res) => {
  try {
    const tasks = await Task.find({ volunteerId: req.params.volunteerId })
      .populate('orphanageId', 'name')
      .sort({ date: 1 });

    res.status(200).json({ tasks });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching tasks', error: error.message });
  }
};

export const getAllTasks = async (req, res) => {
  try {
    const { status, type } = req.query;
    let filter = {};

    if (status) filter.status = status;
    if (type) filter.type = type;

    const tasks = await Task.find(filter)
      .populate('volunteerId', 'username email')
      .populate('orphanageId', 'name')
      .sort({ date: 1 });

    res.status(200).json({ tasks });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching tasks', error: error.message });
  }
};

export const updateTaskStatus = async (req, res) => {
  try {
    const { status, notes } = req.body;

    const updatedTask = await Task.findByIdAndUpdate(
      req.params.taskId,
      { status, notes, updatedAt: Date.now() },
      { new: true }
    ).populate('volunteerId', 'username');

    if (!updatedTask) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Notify the volunteer about the status change via recipientId (User ref)
    const notification = new Notification({
      recipientId: updatedTask.volunteerId._id,
      type: 'task_update',
      title: `Task ${status}`,
      message: `Task "${updatedTask.title}" status updated to ${status}`,
    });

    await notification.save();

    res.status(200).json({ message: 'Task status updated', task: updatedTask });
  } catch (error) {
    res.status(500).json({ message: 'Error updating task status', error: error.message });
  }
};

export const getVolunteerStats = async (req, res) => {
  try {
    const volunteerId = req.params.volunteerId;

    const totalTasks = await Task.countDocuments({ volunteerId });
    const completedTasks = await Task.countDocuments({ volunteerId, status: 'completed' });
    const activeTasks = await Task.countDocuments({
      volunteerId,
      status: { $in: ['assigned', 'in_progress'] }
    });

    const recentTasks = await Task.find({ volunteerId })
      .sort({ createdAt: -1 })
      .limit(5)
      .select('title status createdAt');

    res.status(200).json({
      stats: {
        totalTasks,
        completedTasks,
        activeTasks,
        completionRate: totalTasks > 0 ? (completedTasks / totalTasks * 100).toFixed(1) : 0
      },
      recentTasks
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching volunteer stats', error: error.message });
  }
};
