import { apiClient } from '../../utils/apiClient';

export const fetchOrphanProgress = async (orphanId: string) => {
  const data = await apiClient(`/progress/orphan/${orphanId}`);
  return data.progress || [];
};

export const createProgressApi = async (formData: FormData) => {
  return apiClient('/progress/add', {
    method: 'POST',
    body: formData,
    isFormData: true,
  });
};

export const deleteProgressApi = async (id: string) => {
  return apiClient(`/progress/${id}`, {
    method: 'DELETE',
  });
};
