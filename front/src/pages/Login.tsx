import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../contexts/AuthContext';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 20px;
  background: #f8f9fa;
`;

const LoginBox = styled.div`
  width: 100%;
  max-width: 400px;
  padding: 32px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h1`
  margin: 0 0 24px;
  font-size: 24px;
  font-weight: 600;
  text-align: center;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  font-weight: 500;
  color: #333;
`;

const Input = styled.input`
  padding: 12px;
  border: 1px solid #e1e1e1;
  border-radius: 8px;
  font-size: 16px;

  &:focus {
    outline: none;
    border-color: #007AFF;
  }
`;

const Button = styled.button`
  padding: 12px;
  background: #007AFF;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background: #0056b3;
  }

  &:disabled {
    background: #cccccc;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.div`
  color: #ff3b30;
  font-size: 14px;
  text-align: center;
  margin-top: 16px;
`;

const SuccessMessage = styled.div`
  color: #34c759;
  font-size: 14px;
  text-align: center;
  margin-top: 16px;
  margin-bottom: 16px;
`;

const RegisterLink = styled.button`
  background: none;
  border: none;
  color: #007AFF;
  font-size: 14px;
  cursor: pointer;
  margin-top: 16px;
  text-align: center;
  width: 100%;

  &:hover {
    text-decoration: underline;
  }
`;

const Login: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const auth = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

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
      await auth.login(userId, password);
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
        <Title>군대보고체계</Title>
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label htmlFor="userId">군번</Label>
            <Input
              id="userId"
              name="userId"
              type="text"
              required
              autoComplete="username"
            />
          </FormGroup>
          <FormGroup>
            <Label htmlFor="password">비밀번호</Label>
            <Input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
            />
          </FormGroup>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? '로그인 중...' : '로그인'}
          </Button>
          {successMessage && <SuccessMessage>{successMessage}</SuccessMessage>}
          {error && <ErrorMessage>{error}</ErrorMessage>}
        </Form>
        <RegisterLink onClick={() => navigate('/register')}>
          회원가입
        </RegisterLink>
      </LoginBox>
    </Container>
  );
};

export default Login;
