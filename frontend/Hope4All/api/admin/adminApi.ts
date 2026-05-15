import { apiClient } from '../../utils/apiClient';

export const fetchAdminStats = async (token?: string) => {
  return apiClient('/admin/stats', { token });
};

export const fetchAllRequests = async (token?: string) => {
  const data = await apiClient('/requests', { token });
  return data.requests || [];
};

export const fetchAllTasks = async (token?: string) => {
  const data = await apiClient('/tasks', { token });
  return data.tasks || [];
};

export const fetchAllCourses = async (token?: string) => {
  const data = await apiClient('/courses', { token });
  return data.courses || [];
};

export const rejectRequestApi = async (requestId: string, donorId: string, token: string) => {
  return apiClient(`/requests/${requestId}/reject`, {
    method: 'PUT',
    body: { donorId },
    token,
  });
};

export const updateRequestStatus = async (requestId: string, status: string, token?: string) => {
  return apiClient(`/requests/${requestId}/status`, {
    method: 'PUT',
    body: { status },
    token,
  });
};

export const fetchAllVolunteers = async (token?: string) => {
  const data = await apiClient('/admin/volunteers', { token });
  return data.volunteers || [];
};

export const createTaskApi = async (taskData: any, token?: string) => {
  return apiClient('/tasks', {
    method: 'POST',
    body: taskData,
    token,
  });
};

export const fetchAllUsers = async (token?: string) => {
  const data = await apiClient('/admin/users', { token });
  return data.users || [];
};

export const fetchAllDonations = async (token?: string) => {
  const data = await apiClient('/admin/donations', { token });
  return data.donations || [];
};

export const updateUserStatusApi = async (userId: string, status: string, token?: string) => {
  return apiClient(`/admin/users/${userId}/status`, {
    method: 'PUT',
    body: { status },
    token,
  });
};

export const suspendUserApi = async (userId: string, reason: string, token: string) => {
  return apiClient(`/admin/users/${userId}/suspend`, {
    method: 'PUT',
    body: { reason },
    token,
  });
};

export const unsuspendUserApi = async (userId: string, token: string) => {
  return apiClient(`/admin/users/${userId}/unsuspend`, {
    method: 'PUT',
    token,
  });
};

export const forwardDonationApi = async (donationId: string, token: string) => {
  return apiClient(`/admin/donations/${donationId}/forward`, {
    method: 'PUT',
    token,
  });
};

export const completeDonationApi = async (donationId: string, token: string) => {
  return apiClient(`/admin/donations/${donationId}/complete`, {
    method: 'PUT',
    token,
  });
};

export const updateDonationStatusApi = async (donationId: string, status: string, token: string) => {
  return apiClient(`/admin/donations/${donationId}/status`, {
    method: 'PUT',
    token,
    body: { status },
  });
};

export const deleteUserApi = async (userId: string, token: string) => {
  return apiClient(`/admin/users/${userId}`, {
    method: 'DELETE',
    token,
  });
};
