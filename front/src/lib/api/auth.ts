import { getApiClient } from '../client';

export interface Tokens {
    accessToken: string;
    refreshToken: string;
}

export async function login(userId: string, password: string) {
      const response = await getApiClient().post('/auth/login', {
        userId, 
        password
      });

      const data = response.data;
      
      return data;
  }

export async function register(
    userId: string,
    password: string,
    name: string,
    rank: string,
    unitName: string,
    phoneNumber?: string,
    email?: string
  ) {
      const result = await getApiClient().post('/auth/register', {
        userId,
        password,
        name,
        rank,
        unitName,
        phoneNumber,
        email,
      });

      return result;
  }

export async function getMyAccount(accessToken?: string) {
      const response = await getApiClient().get('/auth/me', {
        headers: accessToken
        ? {
          Authorization: `Bearer ${accessToken}`,
        } 
        : {}, 
      });
      return response.data;
  }

export async function logout() {
    await getApiClient().post('/auth/logout');
}

export async function refreshTokens() {
    const response = await getApiClient().post<Tokens>('/auth/refresh');
    const tokens = response.data;
    const headers = response.headers;
    
    return { tokens, headers };
}