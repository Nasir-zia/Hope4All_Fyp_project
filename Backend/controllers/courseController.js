import Course from '../model/course_model.js';
import Notification from '../model/notification_model.js';

export const createCourse = async (req, res) => {
  try {
    const { title, description, thumbnail, link, category, addedBy, addedByRole } = req.body;

    const newCourse = new Course({
      title,
      description,
      thumbnail,
      link,
      category,
      addedBy,
      addedByRole,
      status: addedByRole === 'admin' ? 'approved' : 'pending',
    });

    await newCourse.save();

    if (addedByRole === 'donor') {
      // Notify admin about new course request (using a generic notification for now or directed to admin if possible)
      // For now, we'll just log it or create a system notification
      console.log(`[LMS] New course request from donor: ${title}`);
    }

    res.status(201).json({ 
      message: addedByRole === 'admin' ? 'Course added successfully' : 'Course request submitted for approval', 
      course: newCourse 
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creating course', error: error.message });
  }
};

export const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find()
      .populate('addedBy', 'username email')
      .sort({ createdAt: -1 });
    res.status(200).json({ courses });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching all courses', error: error.message });
  }
};

export const getApprovedCourses = async (req, res) => {
  try {
    const courses = await Course.find({ status: 'approved' })
      .populate('addedBy', 'username')
      .sort({ createdAt: -1 });
    res.status(200).json({ courses });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching approved courses', error: error.message });
  }
};

export const updateCourseStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const { id } = req.params;

    const updatedCourse = await Course.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updatedCourse) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Notify the donor if their course was approved/rejected
    if (updatedCourse.addedByRole === 'donor') {
      try {
        const notification = new Notification({
          recipientId: updatedCourse.addedBy,
          type: 'course_update',
          title: `Course ${status}`,
          message: `Your course "${updatedCourse.title}" has been ${status} by Admin.`,
        });
        await notification.save();
      } catch (notifError) {
        console.error('[LMS] Notification error:', notifError);
        // Don't fail the whole request if only notification fails
      }
    }

    res.status(200).json({ message: `Course ${status}`, course: updatedCourse });
  } catch (error) {
    res.status(500).json({ message: 'Error updating course status', error: error.message });
  }
};

export const deleteCourse = async (req, res) => {
  try {
    await Course.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Course deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting course', error: error.message });
  }
};
