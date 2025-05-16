import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { login } from '../lib/api/auth';
import { FaUser, FaLock, FaStar, FaSignInAlt } from 'react-icons/fa';

// 군대 테마에 맞는 색상 정의
const colors = {
    primary: '#2E4057', // 군복 느낌의 짙은 청록색
    secondary: '#4F6D7A', // 짙은 청록색의 밝은 버전
    accent: '#5C946E', // 군대 녹색
    highlight: '#F6BD60', // 군대 배지 색상 (금빛)
    background: '#F5F5F5', // 배경색
    text: '#333333', // 텍스트 색상
    textLight: '#6E6E6E', // 밝은 텍스트 색상
    border: '#E0E0E0', // 테두리 색상
    error: '#D32F2F', // 에러 메시지 색상
    success: '#388E3C', // 성공 메시지 색상
    white: '#FFFFFF', // 흰색
    shadow: 'rgba(0, 0, 0, 0.08)' // 그림자 색상
};

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const pulse = keyframes`
  0% { box-shadow: 0 0 0 0 rgba(48, 76, 137, 0.4); }
  70% { box-shadow: 0 0 0 10px rgba(48, 76, 137, 0); }
  100% { box-shadow: 0 0 0 0 rgba(48, 76, 137, 0); }
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 20px;
  background: ${colors.background};
`;

const LoginBox = styled.div`
  width: 100%;
  max-width: 400px;
  padding: 40px;
  background: ${colors.white};
  border-radius: 16px;
  box-shadow: 0 16px 32px ${colors.shadow};
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  border: 1px solid ${colors.border};
  position: relative;
  overflow: hidden;
  
  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 6px;
    background: linear-gradient(90deg, ${colors.primary}, ${colors.secondary});
  }
`;

const LogoContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 32px;
`;

const LogoIcon = styled.div`
  width: 80px;
  height: 80px;
  background: ${colors.primary};
  color: ${colors.white};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
  font-size: 36px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  position: relative;
  
  &:after {
    content: '';
    position: absolute;
    width: 90px;
    height: 90px;
    border-radius: 50%;
    border: 2px solid ${colors.primary};
    animation: ${pulse} 2s infinite;
  }
`;

const Title = styled.h1`
  margin: 0;
  font-size: 28px;
  font-weight: 700;
  text-align: center;
  color: ${colors.primary};
  letter-spacing: 1px;
`;

const Subtitle = styled.p`
  margin: 8px 0 0;
  font-size: 16px;
  color: ${colors.textLight};
  text-align: center;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  position: relative;
`;

const Label = styled.label`
  font-weight: 600;
  color: ${colors.text};
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 6px;
  
  svg {
    color: ${colors.primary};
  }
`;

const Input = styled.input`
  padding: 12px;
  border: 2px solid ${colors.border};
  border-radius: 8px;
  font-size: 16px;
  background-color: ${colors.white};
  color: ${colors.text};
  transition: all 0.3s;
  position: relative;
  z-index: 1;

  &:focus {
    outline: none;
    border-color: ${colors.primary};
    box-shadow: 0 0 0 4px rgba(48, 76, 137, 0.1);
  }
  
  &::placeholder {
    color: #B0BEC5;
  }
`;

const Button = styled.button`
  padding: 14px;
  background: ${colors.primary};
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  text-transform: uppercase;
  letter-spacing: 1px;
  box-shadow: 0 4px 6px rgba(48, 76, 137, 0.25);
  position: relative;
  overflow: hidden;

  &:hover {
    background: ${colors.secondary};
    transform: translateY(-2px);
    box-shadow: 0 6px 12px rgba(48, 76, 137, 0.3);
  }

  &:active {
    transform: translateY(0);
    box-shadow: 0 2px 4px rgba(48, 76, 137, 0.2);
  }

  &:disabled {
    background: #B0BEC5;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
  
  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    transition: all 0.6s;
  }
  
  &:hover:before {
    left: 100%;
  }
`;

const ErrorMessage = styled.div`
  color: ${colors.error};
  font-size: 14px;
  text-align: center;
  margin-top: 16px;
  padding: 10px;
  background-color: rgba(211, 47, 47, 0.05);
  border-radius: 8px;
  border-left: 3px solid ${colors.error};
  animation: ${fadeIn} 0.3s ease-out;
`;

const SuccessMessage = styled.div`
  color: ${colors.success};
  font-size: 14px;
  text-align: center;
  margin-top: 16px;
  margin-bottom: 16px;
  padding: 10px;
  background-color: rgba(56, 142, 60, 0.05);
  border-radius: 8px;
  border-left: 3px solid ${colors.success};
  animation: ${fadeIn} 0.3s ease-out;
`;

const Divider = styled.div`
  display: flex;
  align-items: center;
  color: ${colors.textLight};
  margin: 12px 0;
  font-size: 14px;
  
  &:before, &:after {
    content: '';
    flex: 1;
    height: 1px;
    background: ${colors.border};
  }
  
  &:before {
    margin-right: 10px;
  }
  
  &:after {
    margin-left: 10px;
  }
`;

const RegisterLink = styled.button`
  background: none;
  border: 2px solid ${colors.primary};
  color: ${colors.primary};
  border-radius: 8px;
  padding: 12px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  margin-top: 16px;
  text-align: center;
  width: 100%;
  transition: all 0.3s;
  text-transform: uppercase;
  letter-spacing: 0.5px;

  &:hover {
    background: rgba(48, 76, 137, 0.05);
    transform: translateY(-2px);
  }
`;

const Login: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Redirect after login
  const from = location.state?.from?.pathname || '/';

  useEffect(() => {
    // Check if there's a message in the location state (e.g., from registration)
    if (location.state?.message) {
      setSuccessMessage(location.state.message);
      // Clear the location state to prevent showing the message again on refresh
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setIsLoading(true);

    const formData = new FormData(event.currentTarget);
    const userId = formData.get('userId') as string;
    const password = formData.get('password') as string;

    try {
      await login(userId, password);
      navigate(from, { replace: true });
    } catch (error) {
      setError('로그인에 실패했습니다. 군번과 비밀번호를 확인해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container>
      <LoginBox>
        <LogoContainer>
          <LogoIcon>
            <FaStar />
          </LogoIcon>
          <Title>군대보고체계</Title>
          <Subtitle>육군 병사 보고 시스템</Subtitle>
        </LogoContainer>
        
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label htmlFor="userId">
              <FaUser /> 군번
            </Label>
            <Input
              id="userId"
              name="userId"
              type="text"
              required
              autoComplete="username"
              placeholder="군번을 입력하세요"
            />
          </FormGroup>
          
          <FormGroup>
            <Label htmlFor="password">
              <FaLock /> 비밀번호
            </Label>
            <Input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
              placeholder="비밀번호를 입력하세요"
            />
          </FormGroup>
          
          <Button type="submit" disabled={isLoading}>
            {isLoading ? '로그인 중...' : '로그인'} <FaSignInAlt />
          </Button>
          
          {successMessage && <SuccessMessage>{successMessage}</SuccessMessage>}
          {error && <ErrorMessage>{error}</ErrorMessage>}
        </Form>
        
        <Divider>또는</Divider>
        
        <RegisterLink onClick={() => navigate('/register')}>
          회원가입
        </RegisterLink>
      </LoginBox>
    </Container>
  );
};

export default Login;
