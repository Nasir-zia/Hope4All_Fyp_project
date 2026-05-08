import { apiClient } from '../../utils/apiClient';
import { FeeData } from '../../types/apiTypes';

export const createOrphanFee = async (data: FeeData) => {
  return apiClient('/fees/create', {
    method: 'POST',
    body: data,
  });
};

export const fetchOrphanFees = async (orphanId: string) => {
  const data = await apiClient(`/fees/orphan/${orphanId}`);
  return data.fees || [];
};

export const fetchAvailableFees = async () => {
  const data = await apiClient('/fees/available');
  return data.fees || [];
};

export const pledgeFee = async (feeId: string, donorId: string, token?: string) => {
  return apiClient(`/fees/pledge/${feeId}`, {
    method: 'POST',
    body: { donorId },
    token,
  });
};

export const deleteOrphanFee = async (feeId: string) => {
  return apiClient(`/fees/delete/${feeId}`, {
    method: 'DELETE',
  });
};
