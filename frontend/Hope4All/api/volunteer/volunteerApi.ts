import { apiClient } from '../../utils/apiClient';

export const fetchVolunteerTasks = async (volunteerId: string, token?: string) => {
  const data = await apiClient(`/tasks/volunteer/${volunteerId}`, { token });
  return data.tasks || [];
};

export const fetchVolunteerStats = async (volunteerId: string, token?: string) => {
  const data = await apiClient(`/tasks/stats/${volunteerId}`, { token });
  return data.stats;
};

export const updateTaskStatusApi = async (taskId: string, status: string, token?: string, notes?: string) => {
  return apiClient(`/tasks/${taskId}/status`, {
    method: 'PUT',
    body: { status, notes },
    token,
  });
};
