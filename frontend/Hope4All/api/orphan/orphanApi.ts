import { apiClient } from '../../utils/apiClient';

export const fetchOrphanProfile = async (userId: string) => {
  try {
    const data = await apiClient(`/orphans/profile/${userId}`, { silent: true });
    return data.orphan;
  } catch (error: any) {
    if (error.status === 404 || error.message.includes('404') || error.message.includes('Orphan not found')) return null;
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

export const confirmDonationReceiptApi = async (donationId: string, formData: FormData, token: string) => {
  return apiClient(`/orphans/donations/${donationId}/confirm`, {
    method: 'PUT',
    token,
    body: formData,
    isFormData: true,
  });
};

export const fetchIncomingDonations = async (orphanId: string) => {
  const data = await apiClient(`/donors/aid/${orphanId}`);
  return data.donations || [];
};

export const reportDonationIssueApi = async (donationId: string, reason: string, token: string) => {
  return apiClient(`/orphans/donations/${donationId}/report`, {
    method: 'PUT',
    token,
    body: { reason },
  });
};
