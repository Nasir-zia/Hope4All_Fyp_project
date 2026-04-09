import Message from './model/message_model.js';
import Notification from './model/notification_model.js';
import jwt from 'jsonwebtoken';

const activeUsers = new Map(); // socket.id -> {userId, role}

export const initSocket = (io) => {
  io.on('connection', async (socket) => {
    console.log('User connected:', socket.id);

    // Authenticate and join user room
    socket.on('join-user', (token) => {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id;
        activeUsers.set(socket.id, { userId, role: decoded.role });
        socket.join(userId.toString());
        console.log(`User ${userId} joined room ${userId}`);
        socket.emit('joined', { userId });
      } catch (err) {
        socket.emit('auth-error', 'Invalid token');
        socket.disconnect();
      }
    });

    // Real-time message
    socket.on('send-message', async ({ receiverId, message, type = 'text' }) => {
      try {
        const sender = activeUsers.get(socket.id);
        if (!sender) {
          return socket.emit('error', 'Not authenticated');
        }

        const newMessage = new Message({
          senderId: sender.userId,
          receiverId,
          message,
          type,
        });
        await newMessage.save();
        await newMessage.populate('senderId', 'username role');

        // Real-time emit to receiver room
        io.to(receiverId.toString()).emit('new-message', newMessage);
        // Confirm to sender
        socket.emit('message-sent', newMessage);
      } catch (err) {
        socket.emit('error', err.message);
      }
    });

    // Online status check
    socket.on('get-online-status', (userIds) => {
      const onlineUsers = [];
      userIds.forEach(uid => {
        for (let [sid, data] of activeUsers.entries()) {
          if (data.userId.toString() === uid.toString()) {
            onlineUsers.push({ userId: uid, online: true });
            break;
          }
        }
      });
      socket.emit('online-status', onlineUsers);
    });

    // Real-time notification
    socket.on('send-notification', async ({ receiverId, type, title, message }) => {
      try {
        const sender = activeUsers.get(socket.id);
        if (!sender) return socket.emit('error', 'Not authenticated');

        const notification = new Notification({
          donorId: receiverId,
          type,
          title,
          message,
        });
        await notification.save();

        // Emit to receiver
        io.to(receiverId.toString()).emit('new-notification', notification);
        socket.emit('notification-sent', notification);
      } catch (err) {
        socket.emit('error', err.message);
      }
    });

    socket.on('disconnect', () => {
      activeUsers.delete(socket.id);
      console.log('User disconnected:', socket.id);
    });
  });
};

export default initSocket;

