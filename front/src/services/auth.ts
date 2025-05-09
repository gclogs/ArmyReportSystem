import { User } from '../schemas/user';
import api from './apiClient';

const TOKEN_KEY = 'auth_token';
const USER_KEY = 'auth_user';

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
      try {
        this.user = JSON.parse(userStr);
      } catch (error) {
        console.error('Failed to parse user data:', error);
        // 잘못된 데이터는 제거
        localStorage.removeItem(USER_KEY);
      }
    }
  }

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  public async login(userId: string, password: string): Promise<void> {
    try {
      const response = await api.post<LoginResponse>('/api/auth/login', {
        userId, 
        password
      });

      const data = response.data;
      
      // 로그인 실패 처리
      if (!data.success) {
        throw new Error(data.message || 'Login failed');
      }
      
      // 토큰과 사용자 데이터 확인
      if (!data.token || !data.user) {
        throw new Error('Invalid response data');
      }

      this.token = data.token;
      this.user = data.user;

      localStorage.setItem(TOKEN_KEY, data.token);
      localStorage.setItem(USER_KEY, JSON.stringify(data.user));
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
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
    try {
      await api.post('/api/auth/register', {
        userId,
        password,
        name,
        rank,
        unitName,
        phoneNumber,
        email,
      });
      
      // Registration successful, but no need to set token or user
      // as the user will need to be approved before logging in
    } catch (error: any) {
      console.error('Registration error:', error);
      const errorMessage = error.response?.data?.message || '회원가입에 실패했습니다.';
      throw new Error(errorMessage);
    }
  }

  public async getCurrentUser(): Promise<User | null> {
    if (!this.token) {
      return null;
    }

    if (this.user) {
      return this.user;
    }

    try {
      const response = await api.get('/api/auth/me');
      this.user = response.data.user;
      return this.user;
    } catch (error) {
      console.error('Failed to get current user:', error);
      this.logout();
      return null;
    }
  }

  public logout(): void {
    this.token = null;
    this.user = null;
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  }

  public getToken(): string | null {
    return this.token;
  }

  public getUser(): User | null {
    return this.user;
  }

  public isAuthenticated(): boolean {
    return !!this.token;
  }

  public getAuthHeaders(): Record<string, string> {
    return this.token
      ? {
          Authorization: `Bearer ${this.token}`,
          'Content-Type': 'application/json',
        }
      : {
          'Content-Type': 'application/json',
        };
  }
}

export default AuthService;
