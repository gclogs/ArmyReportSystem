import axios from 'axios';
import AuthService from './auth';

// Axios 인스턴스 생성
const apiClient = axios.create({
  baseURL: '/api',
});

// 요청 인터셉터 설정
apiClient.interceptors.request.use(config => {
  const authService = AuthService.getInstance();
  const token = authService.getToken();
  const user = authService.getUser();
  
  if (token && user) {
    config.headers['Authorization'] = `Bearer ${token}`;
    config.headers['userId'] = user.id;
  }
  return config;
}, error => {
  return Promise.reject(error);
});

apiClient.interceptors.response.use(
  response => response,
  error => {
    // 401 에러 처리 등 공통 에러 핸들링
    if (error.response && error.response.status === 401) {
      AuthService.getInstance().logout();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default apiClient;