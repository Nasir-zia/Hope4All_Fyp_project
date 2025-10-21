import Message from '../model/message_model.js';
import User from '../model/user_model.js';

export const sendMessage = async (req, res) => {
  try {
    const { receiverId, message, type } = req.body;

    const newMessage = new Message({
      senderId: req.user.id, // Assuming auth middleware sets req.user
      receiverId,
      message,
      type: type || 'text',
    });

    await newMessage.save();

    // Populate sender info
    await newMessage.populate('senderId', 'username role');

    res.status(201).json({ message: 'Message sent successfully', messageData: newMessage });
  } catch (error) {
    res.status(500).json({ message: 'Error sending message', error: error.message });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { otherUserId } = req.params;

    const messages = await Message.find({
      $or: [
        { senderId: req.user.id, receiverId: otherUserId },
        { senderId: otherUserId, receiverId: req.user.id }
      ]
    })
    .populate('senderId', 'username role')
    .populate('receiverId', 'username role')
    .sort({ createdAt: 1 });

    // Mark messages as read
    await Message.updateMany(
      { senderId: otherUserId, receiverId: req.user.id, read: false },
      { read: true }
    );

    res.status(200).json({ messages });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching messages', error: error.message });
  }
};

export const getConversations = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get unique conversation partners
    const sentMessages = await Message.find({ senderId: userId })
      .distinct('receiverId');

    const receivedMessages = await Message.find({ receiverId: userId })
      .distinct('senderId');

    const conversationUserIds = [...new Set([...sentMessages, ...receivedMessages])];

    const conversations = await User.find({ _id: { $in: conversationUserIds } })
      .select('username role')
      .lean();

    // Add last message and unread count for each conversation
    const conversationsWithDetails = await Promise.all(
      conversations.map(async (user) => {
        const lastMessage = await Message.findOne({
          $or: [
            { senderId: userId, receiverId: user._id },
            { senderId: user._id, receiverId: userId }
          ]
        }).sort({ createdAt: -1 });

        const unreadCount = await Message.countDocuments({
          senderId: user._id,
          receiverId: userId,
          read: false
        });

        return {
          user,
          lastMessage,
          unreadCount
        };
      })
    );

    res.status(200).json({ conversations: conversationsWithDetails });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching conversations', error: error.message });
  }
};

export const markMessagesRead = async (req, res) => {
  try {
    const { otherUserId } = req.params;

    await Message.updateMany(
      { senderId: otherUserId, receiverId: req.user.id, read: false },
      { read: true }
    );

    res.status(200).json({ message: 'Messages marked as read' });
  } catch (error) {
    res.status(500).json({ message: 'Error marking messages as read', error: error.message });
  }
};
