import { Platform } from 'react-native';
import { apiClient } from '../../utils/apiClient';

export interface DonationData {
  donorId: string;
  itemName: string;
  quantity: number;
  image: any;
  orphanId?: string;
  orphanageId?: string;
}

export const donationApi = {
  createDonation: async (data: DonationData) => {
    const formData = new FormData();
    formData.append('donorId', data.donorId);
    formData.append('itemName', data.itemName);
    formData.append('quantity', data.quantity.toString());
    
    if (data.orphanId) formData.append('orphanId', data.orphanId);
    if (data.orphanageId) formData.append('orphanageId', data.orphanageId);

    if (data.image) {
      const uri = data.image.uri;
      const fileName = uri.split('/').pop() || 'donation.jpg';
      const match = /\.(\w+)$/.exec(fileName);
      const type = match ? `image/${match[1]}` : `image`;

      if (Platform.OS === 'web') {
        const response = await fetch(uri);
        const blob = await response.blob();
        formData.append('image', blob, fileName);
      } else {
        formData.append('image', {
          uri: Platform.OS === 'android' ? uri : uri.replace('file://', ''),
          name: fileName,
          type: type,
        } as any);
      }
    }

    return apiClient('/donations', {
      method: 'POST',
      body: formData,
      isFormData: true,
    });
  },

  getDonations: async (params?: any) => {
    let endpoint = '/donations';
    if (params) {
      const query = new URLSearchParams(params).toString();
      endpoint += `?${query}`;
    }
    return apiClient(endpoint);
  },

  approveDonation: async (id: string) => {
    return apiClient(`/donations/${id}/approve`, {
      method: 'PATCH',
    });
  },

  receiveDonation: async (id: string, data: { orphanId?: string; orphanageId?: string }) => {
    return apiClient(`/donations/${id}/receive`, {
      method: 'PATCH',
      body: data,
    });
  },
};
