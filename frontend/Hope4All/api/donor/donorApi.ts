import { apiClient } from '../../utils/apiClient';
import { DonorData, DonationData } from '../../types/apiTypes';

export const fetchDonorProfile = async (userId: string) => {
  try {
    const data = await apiClient(`/donors/profile/${userId}`);
    return data.donor;
  } catch (error: any) {
    if (error.message.includes('404') || error.message.includes('Donor not found')) return null;
    throw error;
  }
};

export const registerDonorProfile = async (data: DonorData) => {
  const result = await apiClient('/donors/register', {
    method: 'POST',
    body: data,
  });
  return result.donor;
};

export const updateDonorProfile = async (userId: string, data: Partial<DonorData>) => {
  const result = await apiClient(`/donors/profile/${userId}`, {
    method: 'PUT',
    body: data,
  });
  return result.donor;
};

export const fetchApprovedRequests = async () => {
  const data = await apiClient('/requests/approved');
  return data.requests || [];
};

export const fetchMatchedOrphans = async (donorId: string) => {
  try {
    const data = await apiClient(`/donors/matched-orphans/${donorId}`);
    return data.orphans || [];
  } catch (error) {
    console.error('Error fetching matched orphans:', error);
    return [];
  }
};

export const makeDonation = async (data: DonationData, token?: string) => {
  return apiClient('/donors/donate', {
    method: 'POST',
    body: data,
    token,
  });
};

export const fetchDonationHistory = async (userId: string) => {
  const data = await apiClient(`/donors/history/${userId}`);
  return data.donations || [];
};

export const deleteDonationApi = async (donationId: string) => {
  return apiClient(`/donors/donation/${donationId}`, {
    method: 'DELETE',
  });
};

export const fetchOrphanAidFeed = async (orphanId: string) => {
  const data = await apiClient(`/donors/aid/${orphanId}`);
  return data.donations || [];
};

export const uploadDonationPhotoApi = async (donationId: string, photoFormData: FormData, token: string) => {
  return apiClient(`/donors/donation/${donationId}/photo`, {
    method: 'POST',
    body: photoFormData,
    token,
    isFormData: true,
  });
};
