import { apiClient } from '../../utils/apiClient';
import { LoginCredentials, SignupData, ApiResponse } from '../../types/apiTypes';

export const loginApi = async (credentials: LoginCredentials): Promise<ApiResponse> => {
  return apiClient<ApiResponse>('/auth/login', {
    method: 'POST',
    body: credentials,
  });
};

export const signupApi = async (data: SignupData): Promise<ApiResponse> => {
  return apiClient<ApiResponse>('/auth/signup', {
    method: 'POST',
    body: data,
  });
};
