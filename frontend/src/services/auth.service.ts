import api from './api';
import { User } from '../types';

interface LoginResponse {
  token: string;
  user: User;
}

export const authService = {
  login: async (email: string, password: string): Promise<LoginResponse> => {
    const res = await api.post<{ success: boolean; data: LoginResponse }>(
      '/auth/login',
      { email, password }
    );
    return res.data.data;
  },

  logout: async (): Promise<void> => {
    await api.post('/auth/logout');
  },

  getMe: async (): Promise<User> => {
    const res = await api.get<{ success: boolean; data: { user: User } }>('/auth/me');
    return res.data.data.user;
  },
};
