import { getApiClient } from '../client';

export interface AuthResponse {
    user_id: string;
    name: string;
    unit_name: string;
    email: string;
    rank: string;
    access_token: string;
    refresh_token: string;
    token_type: string;
    access_token_expires_in: number;
    refresh_token_expires_in: number;
    success: boolean;
    message: string;
}

export async function login(userId: string, password: string): Promise<AuthResponse> {
    const response = await getApiClient().post('/auth/login', {
        user_id: userId, 
        password
    });
      
    return response.data;
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
        user_id: userId,
        password,
        name,
        rank,
        unit_name: unitName,
        phone_number: phoneNumber,
        email,
    });

    return result;
}

export async function logout() {
    await getApiClient().post('/auth/logout');
}

export async function refreshTokens(): Promise<AuthResponse> {
    const response = await getApiClient().post('/auth/refresh');
    return response.data;
}