import { apiClient } from '../../utils/apiClient';

export const fetchOrphanProfile = async (userId: string) => {
  try {
    const data = await apiClient(`/orphans/profile/${userId}`);
    return data.orphan;
  } catch (error: any) {
    if (error.message.includes('404')) return null;
    throw error;
  }
};

export const registerOrphanProfile = async (formData: FormData) => {
  const result = await apiClient('/orphans/register', {
    method: 'POST',
    body: formData,
    isFormData: true,
  });
  return result.orphan;
};

export const updateOrphanProfile = async (userId: string, formData: FormData) => {
  const result = await apiClient(`/orphans/profile/${userId}`, {
    method: 'PUT',
    body: formData,
    isFormData: true,
  });
  return result.orphan;
};
