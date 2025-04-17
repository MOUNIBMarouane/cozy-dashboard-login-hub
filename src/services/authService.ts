
import { api } from './api';

// Define types for authentication
export interface LoginCredentials {
  emailOrUsername: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  username: string;
  passwordHash: string;
  firstName?: string;
  lastName?: string;
  [key: string]: any; // For additional fields
}

export interface UserInfo {
  id: number;
  email: string;
  username: string;
  firstName?: string;
  lastName?: string;
  role?: string;
  isActive?: boolean;
  profilePicture?: string;
  [key: string]: any; // For additional fields
}

export interface UpdateProfileRequest {
  firstName?: string;
  lastName?: string;
  username?: string;
  currentPassword?: string;
  newPassword?: string;
  [key: string]: any; // For additional fields
}

class AuthService {
  async login(credentials: LoginCredentials): Promise<any> {
    const response = await api.post('/api/Auth/login', credentials);
    return response.data;
  }

  async register(userData: RegisterCredentials): Promise<any> {
    const response = await api.post('/api/Auth/register', userData);
    return response.data;
  }

  async logout(userId?: number): Promise<void> {
    await api.post('/api/Auth/logout', { userId });
  }

  async getUserInfo(): Promise<UserInfo> {
    const response = await api.get('/api/Account/user-info');
    return response.data;
  }

  async forgotPassword(email: string): Promise<any> {
    const response = await api.post('/api/Account/forgot-password', { email });
    return response.data;
  }

  async updatePassword(email: string, newPassword: string): Promise<any> {
    const response = await api.put('/api/Account/update-password', { 
      email, 
      newPassword 
    });
    return response.data;
  }

  async updateProfile(data: UpdateProfileRequest): Promise<any> {
    const response = await api.put('/api/Account/update-profile', data);
    return response.data;
  }

  async updateEmail(email: string): Promise<any> {
    const response = await api.put('/api/Account/update-email', { email });
    return response.data;
  }

  async uploadProfileImage(file: File): Promise<any> {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await api.post('/api/Account/upload-image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  }

  async validateUsername(username: string): Promise<boolean> {
    const response = await api.post('/api/Auth/valide-username', { username });
    return response.data;
  }

  async validateEmail(email: string): Promise<boolean> {
    const response = await api.post('/api/Auth/valide-email', { email });
    return response.data;
  }

  async verifyEmail(email: string, verificationCode: string): Promise<boolean> {
    const response = await api.post('/api/Auth/verify-email', { 
      email, 
      verificationCode 
    });
    return response.data;
  }

  async resendVerificationCode(email: string): Promise<any> {
    const response = await api.post('/api/Account/resend-code', { email });
    return response.data;
  }
}

export default new AuthService();
