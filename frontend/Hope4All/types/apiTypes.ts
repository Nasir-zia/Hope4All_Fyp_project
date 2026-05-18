export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupData {
  username: string;
  email: string;
  password: string;
  role: string;
}

export interface ApiResponse {
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

export interface DonorData {
  userId: string;
  name: string;
  email?: string;
  phone: string;
  city: string;
  preferences?: {
    causeType: string[];
    area: string[];
    schoolLevel: string[];
    urgentOnly?: boolean;
  };
}

export interface DonationData {
  donorId: string;
  requestId?: string;
  units: number;
  recipientName?: string;
  type?: string;
  description?: string;
  unitType?: string;
  city?: string;
  itemName?: string;
}

export interface FeeData {
  orphanId: string;
  title: string;
  amount: number;
  dueDate: string;
  paymentNumber?: string;
}

export interface MaterialRequestData {
  orphanId: string;
  orphanageId: string;
  type: 'stationery' | 'uniforms' | 'books' | 'other';
  units: number;
  unitType: string;
  description: string;
  school: string;
  isUrgent?: boolean;
}

export interface CourseData {
  title: string;
  description: string;
  link: string;
  category: string;
  instructorId: string;
  duration?: string;
  thumbnail?: string;
  assignedOrphan?: string;
}
