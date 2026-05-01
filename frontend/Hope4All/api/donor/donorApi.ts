import { apiClient } from '../../utils/apiClient';
import { DonorData, DonationData } from '../../types/apiTypes';

export const fetchDonorProfile = async (userId: string) => {
  try {
    const data = await apiClient(`/donors/profile/${userId}`);
    return data.donor;
  } catch (error: any) {
    if (error.message.includes('404')) return null;
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
    // Try the other endpoint if this one fails
    const altData = await apiClient(`/donors/${donorId}/matches`);
    return altData.orphans || [];
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
