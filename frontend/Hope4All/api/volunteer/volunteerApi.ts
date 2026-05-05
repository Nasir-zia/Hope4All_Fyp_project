import { apiClient } from '../../utils/apiClient';

export const fetchVolunteerTasks = async (volunteerId: string, token?: string) => {
  const data = await apiClient(`/tasks/volunteer/${volunteerId}`, { token });
  return data.tasks || [];
};

export const fetchVolunteerStats = async (volunteerId: string, token?: string) => {
  const data = await apiClient(`/tasks/stats/${volunteerId}`, { token });
  return data.stats;
};

export const updateTaskStatusApi = async (taskId: string, statusData: any, token?: string, isFormData: boolean = false) => {
  return apiClient(`/tasks/${taskId}/status`, {
    method: 'PUT',
    body: statusData,
    token,
    isFormData,
  });
};
