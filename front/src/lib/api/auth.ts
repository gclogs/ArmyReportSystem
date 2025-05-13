import { User } from '../../schemas/auth';
import { getApiClient } from '../client';

const TOKEN_KEY = import.meta.env.VITE_AUTH_TOKEN_KEY || 'auth_token';
const USER_KEY = import.meta.env.VITE_AUTH_USER_KEY || 'auth_user';

interface LoginResponse {
  token: string;
  user: User;
  success: boolean;
  message?: string;
}

class AuthService {
  private static instance: AuthService;
  private token: string | null = null;
  private user: User | null = null;

  private constructor() {
    const tokenStr = localStorage.getItem(TOKEN_KEY);
    const userStr = localStorage.getItem(USER_KEY);

    if (tokenStr) {
      this.token = tokenStr;
    }

    if (userStr) {
      this.user = JSON.parse(userStr);
    }
  }

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  public async login(userId: string, password: string): Promise<void> {
      const api = getApiClient();
      const response = await api.post<LoginResponse>('/auth/login', {
        userId, 
        password
      });

      const data = response.data;
      
      if (!data.success) {
        throw new Error(data.message || 'Login failed');
      }
      
      if (!data.token || !data.user) {
        throw new Error('Invalid response data');
      }

      this.token = data.token;
      this.user = data.user;

      localStorage.setItem(TOKEN_KEY, data.token);
      localStorage.setItem(USER_KEY, JSON.stringify(data.user));
  }

  public async register(
    userId: string,
    password: string,
    name: string,
    rank: string,
    unitName: string,
    phoneNumber?: string,
    email?: string
  ): Promise<void> {
      const api = getApiClient();
      await api.post('/auth/register', {
        userId,
        password,
        name,
        rank,
        unitName,
        phoneNumber,
        email,
      });
  }

  public async getCurrentUser(): Promise<User | null> {
    if (!this.token) {
      return null;
    }

    if (this.user) {
      return this.user;
    }

    try {
      const api = getApiClient();
      const response = await api.get('/auth/me', { 
        withCredentials: true 
      });
      
      if (response.data && response.data.user) {
        this.user = response.data.user;
        return this.user;
      }
      return null;
    } catch (error) {
      console.error('Failed to get current user:', error);
      this.logout();
      return null;
    }
  }

  public async getMyAccount(accessToken?: string): Promise<User | null> {
      const api = getApiClient();
      const response = await api.get('/auth/me', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      return response.data.user;
  }

  public logout(): void {
    this.token = null;
    this.user = null;
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  }
}

export default AuthService;