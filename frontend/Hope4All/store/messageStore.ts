import { create } from 'zustand';
import { messageService } from '../services/messages/messageService';

interface MessageState {
  conversations: any[];
  messages: any[];
  loading: boolean;
  sending: boolean;
  
  // Actions
  setMessages: (messages: any[]) => void;
  addMessage: (message: any) => void;
  fetchConversations: (token?: string) => Promise<void>;
  fetchMessages: (otherUserId: string, token?: string) => Promise<void>;
  sendMessage: (receiverId: string, content: string, token?: string) => Promise<any>;
  handleIncomingMessage: (message: any, selectedUserId: string | null) => void;
}

export const useMessageStore = create<MessageState>((set, get) => ({
  conversations: [],
  messages: [],
  loading: false,
  sending: false,

  setMessages: (messages) => set({ messages }),

  addMessage: (message) => set((state) => {
    // Avoid duplicates
    if (state.messages.some(m => m._id === message._id)) return state;
    return { messages: [...state.messages, message] };
  }),

  fetchConversations: async (token) => {
    try {
      const data = await messageService.getConversations(token);
      set({ conversations: data });
    } catch (error) {
      console.error('Store: Fetch conversations failed', error);
    }
  },

  fetchMessages: async (otherUserId, token) => {
    set({ loading: true });
    try {
      const data = await messageService.getMessages(otherUserId, token);
      set({ messages: data });
    } catch (error) {
      console.error('Store: Fetch messages failed', error);
    } finally {
      set({ loading: false });
    }
  },

  sendMessage: async (receiverId, content, token) => {
    set({ sending: true });
    try {
      const sentMsg = await messageService.sendMessage(receiverId, content, token);
      set((state) => ({
        messages: [...state.messages, sentMsg]
      }));
      // Refresh conversations list
      const updatedConversations = await messageService.getConversations(token);
      set({ conversations: updatedConversations });
      return sentMsg;
    } catch (error) {
      console.error('Store: Send message failed', error);
      throw error;
    } finally {
      set({ sending: false });
    }
  },

  handleIncomingMessage: (message, selectedUserId) => {
    const senderId = message.senderId?._id || message.senderId;
    
    // 1. If it's the current chat, add to messages
    if (selectedUserId && String(senderId) === String(selectedUserId)) {
      get().addMessage(message);
    }

    // 2. Always refresh conversation list for unread counts/sorting
    // Note: We might need the token here if we want to fetch the updated list
    // For now, we just update the specific conversation's last message locally if we want to be fancy
    // But a simple refresh is more reliable
  }
}));
