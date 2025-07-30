import axios, { AxiosInstance } from 'axios';
import { deleteCookie, getCookie, setCookie } from './cookies';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

let apiClientInstance: AxiosInstance | null = null;
export function createApiClient(): AxiosInstance {
  const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
      'Content-Type': 'application/json',
    },
    withCredentials: true // 모든 요청에 쿠키 포함
  });

  // 요청 인터셉터 설정
  apiClient.interceptors.request.use(
    (config) => {
      const accessToken = getCookie('accessToken');
      if (accessToken) {
        config.headers['Authorization'] = `Bearer ${accessToken}`;
      }
      
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // 응답 인터셉터 설정
  apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
      // 현재 구현: 401 오류 시 즉시 로그아웃
      if (error.response && error.response.status === 401) {
        deleteCookie('access_token');
        window.location.href = '/login';
      }

      // 개선 방향: 리프레시 토큰으로 새 액세스 토큰 요청
      if (error.response && error.response.status === 401) {
        try {
          // 리프레시 토큰으로 새 액세스 토큰 요청
          const { data } = await axios.post(`${API_BASE_URL}/auth/refresh`);
          setCookie('access_token', data.access_token, 1);
          
          // 원래 요청 재시도 (헤더 갱신)
          error.config.headers['Authorization'] = `Bearer ${data.access_token}`;
          return axios(error.config);
        } catch (refreshError) {
          // 리프레시 실패 시 로그아웃
          deleteCookie('accessToken');
          deleteCookie('refreshToken');
          window.location.href = '/login';
        }
      }
    }
  );

  return apiClient;
}

// API 클라이언트 인스턴스를 가져오는 함수
export function getApiClient(): AxiosInstance {
  if (!apiClientInstance) {
    apiClientInstance = createApiClient();
  }
  return apiClientInstance;
}
