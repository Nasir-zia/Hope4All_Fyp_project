import { apiClient } from '../../utils/apiClient';
import { CourseData } from '../../types/apiTypes';

export const addCourseApi = async (data: CourseData, token?: string) => {
  return apiClient('/courses/add', {
    method: 'POST',
    body: data,
    token,
  });
};

export const fetchApprovedCourses = async (orphanId?: string) => {
  const endpoint = orphanId ? `/courses/approved?orphanId=${orphanId}` : '/courses/approved';
  const data = await apiClient(endpoint);
  return data.courses || [];
};

export const fetchPendingCourses = async (token?: string) => {
  const data = await apiClient('/courses/pending', { token });
  return data.courses || [];
};

export const updateCourseStatusApi = async (id: string, status: string) => {
  return apiClient(`/courses/${id}/status`, {
    method: 'PUT',
    body: { status },
  });
};

export const fetchDonorCourses = async (donorId: string) => {
  const data = await apiClient(`/courses/donor/${donorId}`);
  return data.courses || [];
};
