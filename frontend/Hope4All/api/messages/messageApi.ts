import { apiClient } from '../../utils/apiClient';

export const fetchConversations = async (token?: string) => {
  const data = await apiClient('/messages', { token });
  return data.conversations || [];
};

export const fetchMessages = async (otherUserId: string, token?: string) => {
  const data = await apiClient(`/messages/${otherUserId}`, { token });
  return data.messages || [];
};

export const sendMessageApi = async (receiverId: string, payload: string | FormData, token?: string) => {
  if (payload instanceof FormData) {
    payload.append('receiverId', receiverId);
    return apiClient('/messages', {
      method: 'POST',
      body: payload,
      token,
      isFormData: true,
    });
  }
  
  return apiClient('/messages', {
    method: 'POST',
    body: { receiverId, message: payload },
    token,
  });
};
