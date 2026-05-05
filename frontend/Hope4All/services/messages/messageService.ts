import { fetchConversations, fetchMessages, sendMessageApi } from '@/constants/api';

export const messageService = {
  getConversations: async (token?: string) => {
    try {
      return await fetchConversations(token);
    } catch (error) {
      console.error('Error in getConversations:', error);
      throw error;
    }
  },

  getMessages: async (otherUserId: string, token?: string) => {
    try {
      return await fetchMessages(otherUserId, token);
    } catch (error) {
      console.error('Error in getMessages:', error);
      throw error;
    }
  },

  sendMessage: async (receiverId: string, message: string | FormData, token?: string) => {
    try {
      const response = await sendMessageApi(receiverId, message, token);
      // Ensure we return the message object correctly
      return response.message || response;
    } catch (error) {
      console.error('Error in sendMessage:', error);
      throw error;
    }
  }
};
