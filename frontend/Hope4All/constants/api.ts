const API_BASE_URL = 'http://192.168.1.3:5000/api';
export const SOCKET_URL = 'http://192.168.1.3:5000';

interface LoginCredentials {
  email: string;
  password: string;
}

interface SignupData {
  username: string;
  email: string;
  password: string;
  role: string;
}

interface ApiResponse {
  success: boolean;
  message: string;
  token?: string;
  user?: {
    id: string;
    username?: string;
    email: string;
    role: string;
  };
}

export const loginApi = async (credentials: LoginCredentials): Promise<ApiResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    let data: any;
    try {
      data = await response.json();
    } catch (e) {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    }

    if (!response.ok) {
      throw new Error(data?.message || `HTTP error! status: ${response.status}`);
    }
    if (!data.success) {
      throw new Error(data.message || 'Login failed');
    }

    return data;
  } catch (error) {
    console.error('Login API error:', error);
    throw error;
  }
};

export const signupApi = async (data: SignupData): Promise<ApiResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    let result: any;
    try {
      result = await response.json();
    } catch (e) {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    }

    if (!response.ok) {
      throw new Error(result?.message || `HTTP error! status: ${response.status}`);
    }
    if (!result.success) {
      throw new Error(result.message || 'Signup failed');
    }

    return result;
  } catch (error) {
    console.error('Signup API error:', error);
    throw error;
  }
};

// --- Donor API Endpoints ---

export interface DonorData {
  userId: string;
  name: string;
  email: string;
  phone: string;
  city: string;
}

export const fetchDonorProfile = async (userId: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/donors/profile/${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      if (response.status === 404) return null; // Expected when donor is not registered yet
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.donor;
  } catch (error) {
    console.error('Fetch Donor Profile error:', error);
    throw error;
  }
};

export const registerDonorProfile = async (data: DonorData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/donors/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    let result: any;
    try {
      result = await response.json();
    } catch (e) {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    }

    if (!response.ok) {
      throw new Error(result?.message || `HTTP error! status: ${response.status}`);
    }

    return result.donor;
  } catch (error) {
    console.error('Register Donor Profile error:', error);
    throw error;
  }
};

export const fetchApprovedRequests = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/requests/approved`);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();
    return data.requests;
  } catch (error) {
    console.error('Fetch Approved Requests error:', error);
    throw error;
  }
};

export const fetchMatchedOrphans = async (donorId: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/donors/matched-orphans/${donorId}`);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();
    return data.orphans;
  } catch (error) {
    console.error('Fetch Matched Orphans error:', error);
    throw error;
  }
};

export interface DonationData {
  donorId: string;
  requestId: string;
  units: number;
  recipientName: string;
}

export const makeDonation = async (data: DonationData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/donors/donate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    let result: any;
    try { result = await response.json(); } catch(e) {}
    
    if (!response.ok) {
      throw new Error(result?.message || `HTTP error! status: ${response.status}`);
    }
    return result;
  } catch (error) {
    console.error('Make Donation error:', error);
    throw error;
  }
};

// --- Fee Management API Endpoints ---

export interface FeeData {
  orphanId: string;
  title: string;
  amount: number;
  dueDate: string;
}

export const createOrphanFee = async (data: FeeData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/fees/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    let result: any;
    try { result = await response.json(); } catch(e) {}
    if (!response.ok) throw new Error(result?.message || 'Error creating fee');
    return result;
  } catch (error) {
    console.error('Create fee error:', error);
    throw error;
  }
};

export const fetchOrphanFees = async (orphanId: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/fees/orphan/${orphanId}`);
    if (!response.ok) throw new Error('Error fetching orphan fees');
    const data = await response.json();
    return data.fees || [];
  } catch (error) {
    console.error('Fetch orphan fees error:', error);
    throw error;
  }
};

export const fetchAvailableFees = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/fees/available`);
    if (!response.ok) throw new Error('Error fetching available fees');
    const data = await response.json();
    return data.fees || [];
  } catch (error) {
    console.error('Fetch available fees error:', error);
    throw error;
  }
};

export const pledgeFee = async (feeId: string, donorId: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/fees/pledge/${feeId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ donorId }),
    });
    let result: any;
    try { result = await response.json(); } catch(e) {}
    if (!response.ok) throw new Error(result?.message || 'Error pledging fee');
    return result;
  } catch (error) {
    console.error('Pledge fee error:', error);
    throw error;
  }
};

// --- Messaging API Endpoints ---

export const fetchConversations = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/messages`);
    const data = await response.json();
    return data.conversations || [];
  } catch (error) {
    console.error('Fetch conversations error:', error);
    throw error;
  }
};

export const fetchMessages = async (otherUserId: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/messages/${otherUserId}`);
    const data = await response.json();
    return data.messages || [];
  } catch (error) {
    console.error('Fetch messages error:', error);
    throw error;
  }
};

export const sendMessageApi = async (receiverId: string, message: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ receiverId, message }),
    });
    return await response.json();
  } catch (error) {
    console.error('Send message error:', error);
    throw error;
  }
};

// --- Orphan API Endpoints ---

export const fetchOrphanProfile = async (userId: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/orphans/profile/${userId}`);
    if (!response.ok) {
      if (response.status === 404) return null;
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data.orphan;
  } catch (error) {
    console.error('Fetch Orphan Profile error:', error);
    throw error;
  }
};

export const registerOrphanProfile = async (formData: FormData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/orphans/register`, {
      method: 'POST',
      body: formData, // No Content-Type header needed for FormData
    });

    let result: any;
    try { result = await response.json(); } catch(e) {}

    if (!response.ok) {
      throw new Error(result?.message || `HTTP error! status: ${response.status}`);
    }
    return result.orphan;
  } catch (error) {
    console.error('Register Orphan Profile error:', error);
    throw error;
  }
};

export const updateOrphanProfile = async (userId: string, formData: FormData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/orphans/profile/${userId}`, {
      method: 'PUT',
      body: formData, // FormData handles the boundaries
    });

    let result: any;
    try { result = await response.json(); } catch(e) {}

    if (!response.ok) {
      throw new Error(result?.message || `HTTP error! status: ${response.status}`);
    }
    return result.orphan;
  } catch (error) {
    console.error('Update Orphan Profile error:', error);
    throw error;
  }
};

export const fetchOrphanageOptions = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/orphanages/all`);
    if (!response.ok) throw new Error('Error fetching orphanages');
    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('Fetch orphanages error:', error);
    throw error;
  }
};

export const fetchOrphanProgress = async (orphanId: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/progress/orphan/${orphanId}`);
    const data = await response.json();
    return data.progress || [];
  } catch (error) {
    console.error('Fetch progress error:', error);
    throw error;
  }
};

export const createProgressApi = async (formData: FormData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/progress/add`, {
      method: 'POST',
      body: formData,
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result?.message || 'Error adding progress');
    return result;
  } catch (error) {
    console.error('Create progress error:', error);
    throw error;
  }
};

export const deleteProgressApi = async (id: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/progress/${id}`, {
      method: 'DELETE',
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result?.message || 'Error deleting progress');
    return result;
  } catch (error) {
    console.error('Delete progress error:', error);
    throw error;
  }
};

export interface MaterialRequestData {
  orphanId: string;
  orphanageId: string;
  type: 'stationery' | 'uniforms' | 'books' | 'other';
  units: number;
  unitType: string;
  description: string;
  school: string;
}

export const submitMaterialRequest = async (data: MaterialRequestData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/requests/submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return await response.json();
  } catch (error) {
    console.error('Submit material request error:', error);
    throw error;
  }
};

export const fetchOrphanRequests = async (orphanId: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/requests/orphan/${orphanId}`);
    const data = await response.json();
    return data.requests || [];
  } catch (error) {
    console.error('Fetch orphan requests error:', error);
    throw error;
  }
};

export const fetchOrphanAidFeed = async (orphanId: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/donors/aid/${orphanId}`);
    if (!response.ok) throw new Error('Error fetching aid feed');
    const data = await response.json();
    return data.donations || [];
  } catch (error) {
    console.error('Fetch aid feed error:', error);
    throw error;
  }
};

// --- Volunteer & Task API Endpoints ---

export const fetchVolunteerTasks = async (volunteerId: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/tasks/volunteer/${volunteerId}`);
    const data = await response.json();
    return data.tasks || [];
  } catch (error) {
    console.error('Fetch volunteer tasks error:', error);
    throw error;
  }
};

export const fetchVolunteerStats = async (volunteerId: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/tasks/stats/${volunteerId}`);
    const data = await response.json();
    return data.stats;
  } catch (error) {
    console.error('Fetch volunteer stats error:', error);
    throw error;
  }
};

export const updateTaskStatusApi = async (taskId: string, status: string, notes?: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/tasks/${taskId}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, notes }),
    });
    return await response.json();
  } catch (error) {
    console.error('Update task status error:', error);
    throw error;
  }
};

// --- Admin API Endpoints ---

export const fetchAdminStats = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/stats`);
    if (!response.ok) throw new Error('Error fetching admin stats');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Fetch admin stats error:', error);
    throw error;
  }
};

export const fetchAllRequests = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/requests`);
    if (!response.ok) throw new Error('Error fetching requests');
    const data = await response.json();
    return data.requests || [];
  } catch (error) {
    console.error('Fetch all requests error:', error);
    throw error;
  }
};

export const rejectRequestApi = async (requestId: string, donorId: string, token: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/requests/${requestId}/reject`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ donorId })
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result?.message || 'Error rejecting request');
    return result;
  } catch (error) {
    console.error('Reject request error:', error);
    throw error;
  }
};

export const updateRequestStatus = async (requestId: string, status: string, token: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/requests/${requestId}/status`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ status }),
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result?.message || 'Error updating request');
    return result;
  } catch (error) {
    console.error('Update request status error:', error);
    throw error;
  }
};

export const fetchAllVolunteers = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/volunteers`);
    if (!response.ok) throw new Error('Error fetching volunteers');
    const data = await response.json();
    return data.volunteers || [];
  } catch (error) {
    console.error('Fetch volunteers error:', error);
    throw error;
  }
};

export const createTaskApi = async (taskData: any) => {
  try {
    const response = await fetch(`${API_BASE_URL}/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(taskData),
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result?.message || 'Error creating task');
    return result;
  } catch (error) {
    console.error('Create task error:', error);
    throw error;
  }
};

export const fetchAllUsers = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/users`);
    if (!response.ok) throw new Error('Error fetching users');
    const data = await response.json();
    return data.users || [];
  } catch (error) {
    console.error('Fetch users error:', error);
    throw error;
  }
};

export const fetchAllDonations = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/donations`);
    if (!response.ok) throw new Error('Error fetching donations');
    const data = await response.json();
    return data.donations || [];
  } catch (error) {
    console.error('Fetch donations error:', error);
    throw error;
  }
};

export const updateUserStatusApi = async (userId: string, status: string, token: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/users/${userId}/status`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ status }),
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result?.message || 'Error updating user status');
    return result;
  } catch (error) {
    console.error('Update user status error:', error);
    throw error;
  }
};
