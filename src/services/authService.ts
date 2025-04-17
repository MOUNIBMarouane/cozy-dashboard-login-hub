import { api } from './api';

class AuthService {
  async login(credentials: any): Promise<any> {
    const response = await api.post('/api/Auth/login', credentials);
    return response.data;
  }

  async register(userData: any): Promise<any> {
    const response = await api.post('/api/Auth/register', userData);
    return response.data;
  }

  async logout(): Promise<void> {
    await api.post('/api/Auth/logout');
  }

  async getCurrentUser(): Promise<any> {
    const response = await api.get('/api/Auth/current-user');
    return response.data;
  }
}

export default new AuthService();
