import { getApiClient } from '../client';
import { deleteCookie, setCookie } from '../cookies';

export interface AuthResponse {
    accessToken: string;
    accessTokenExpiresIn: number;
    createdAt: string;
    email: string;
    message: string;
    name: string;
    phoneNumber: string;
    rank: string;
    refreshToken: string;
    refreshTokenExpiresIn: number;
    role: number;
    success: boolean;
    tokenType: string;
    unitId: string;
    unitName: string;
    userId: string;
}

export async function login(userId: string, password: string): Promise<AuthResponse> {
    const response = await getApiClient().post('/auth/login', {
        userId: userId, 
        password
    });

    console.log(response.data);

    setCookie('accessToken', response.data.accessToken, 1);
    setCookie('refreshToken', response.data.refreshToken, 1);
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
        userId: userId,
        password,
        name,
        rank,
        unitName: unitName,
        phoneNumber,
        email,
    });

    return result;
}

export async function logout() {
    await getApiClient().post('/auth/logout');
    deleteCookie('accessToken');
}

export async function refreshTokens(): Promise<AuthResponse> {
    const response = await getApiClient().post('/auth/refresh');
    setCookie('refreshToken', response.data.refreshToken, 1);
    return response.data;
}