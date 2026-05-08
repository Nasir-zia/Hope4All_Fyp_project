import { apiClient } from '../../utils/apiClient';
import { MaterialRequestData } from '../../types/apiTypes';

export const submitMaterialRequest = async (data: MaterialRequestData) => {
  const formData = new FormData();
  Object.entries(data).forEach(([key, value]) => {
    formData.append(key, String(value));
  });

  return apiClient('/requests/submit', {
    method: 'POST',
    body: formData,
    isFormData: true,
  });
};

export const fetchOrphanageRequests = async (orphanageId: string) => {
  const data = await apiClient(`/requests/orphanage/${orphanageId}`);
  return data.requests || [];
};

export const submitRequirement = async (data: any) => {
  const formData = new FormData();
  Object.entries(data).forEach(([key, value]) => {
    formData.append(key, String(value));
  });
  formData.append('isInstitutional', 'true');

  return apiClient('/requests/submit', {
    method: 'POST',
    body: formData,
    isFormData: true,
  });
};

export const fetchOrphanRequests = async (orphanId: string) => {
  const data = await apiClient(`/requests/orphan/${orphanId}`);
  return data.requests || [];
};
