import { apiClient } from '../../utils/apiClient';
import { MaterialRequestData } from '../../types/apiTypes';

export const submitMaterialRequest = async (data: MaterialRequestData) => {
  return apiClient('/requests/submit', {
    method: 'POST',
    body: data,
  });
};

export const fetchOrphanageRequests = async (orphanageId: string) => {
  const data = await apiClient(`/requests/orphanage/${orphanageId}`);
  return data.requests || [];
};

export const submitRequirement = async (data: any) => {
  return apiClient('/requests/submit', {
    method: 'POST',
    body: { ...data, isInstitutional: true },
  });
};

export const fetchOrphanRequests = async (orphanId: string) => {
  const data = await apiClient(`/requests/orphan/${orphanId}`);
  return data.requests || [];
};
