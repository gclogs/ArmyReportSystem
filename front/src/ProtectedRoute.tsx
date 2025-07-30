import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { getCookie } from './lib/cookies';

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const accessToken = getCookie('access_token');
  
    useEffect(() => {
      // 로그인 및 회원가입 페이지는 검사 제외
      if (['/login', '/register'].includes(location.pathname)) {
        return;
      }
      
      // 인증되지 않은 사용자는 로그인 페이지로 리디렉션
      if (!accessToken) {
        navigate('/login', { replace: true });
      }
    }, [location.pathname, navigate]);
  
    return <>{children}</>;
}