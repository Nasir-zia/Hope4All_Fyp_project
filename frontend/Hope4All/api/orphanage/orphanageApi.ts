import { apiClient } from '../../utils/apiClient';

export const fetchOrphanageOptions = async () => {
  const data = await apiClient('/orphanages/all');
  return data.data || [];
};

export const fetchOrphanages = fetchOrphanageOptions;

export const fetchOrphanageProfile = async (userId: string) => {
  try {
    const data = await apiClient(`/orphanages/profile/${userId}`, { silent: true });
    return data.orphanage;
  } catch (error: any) {
    if (error.status === 404 || error.message.includes('404') || error.message.includes('Orphanage not found')) return null;
    throw error;
  }
};

export const registerOrphanageApi = async (formData: FormData) => {
  const result = await apiClient('/orphanages/register', {
    method: 'POST',
    body: formData,
    isFormData: true,
  });
  return result.data;
};
