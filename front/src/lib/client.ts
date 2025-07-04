import axios, { AxiosInstance } from 'axios';
import { deleteCookie, getCookie } from './cookies';

// 사용자 캐시 키 (민감하지 않은 정보용)
const USER_CACHE_KEY = import.meta.env.VITE_AUTH_USER_KEY || 'auth_user_cache';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

// API 클라이언트 싱글톤 인스턴스
let apiClientInstance: AxiosInstance | null = null;

// API 클라이언트 생성 함수
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
      const accessToken = getCookie('access_token');
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
      // 401 에러 처리 등 공통 에러 핸들링
      if (error.response && error.response.status === 401) {
        // 로컬 스토리지의 캐시된 사용자 정보만 삭제
        deleteCookie('access_token');
        
        // 로그인 페이지로 리다이렉트
        window.location.href = '/login';
      }
      return Promise.reject(error);
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
