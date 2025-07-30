import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { z } from 'zod';
import { RankSchema } from '../schemas/unit';
import { register } from '../lib/api/auth';

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

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 20px;
  background: ${colors.background};
`;


const RegisterBox = styled.div`
  width: 100%;
  max-width: 720px;
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

const FormRow = styled.div`
  display: flex;
  gap: 16px;
  
  & > * {
    flex: 1;
  }
`;

const Label = styled.label`
  font-weight: 500;
  color: ${colors.text};
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

const Select = styled.select`
  padding: 12px;
  border: 1px solid ${colors.border};
  border-radius: 8px;
  font-size: 16px;
  background-color: ${colors.white};
  color: ${colors.text};

  &:focus {
    outline: none;
    border-color: ${colors.primary};
  }
`;

const Button = styled.button`
  padding: 12px;
  background: ${colors.primary};
  color: ${colors.white};
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background: ${colors.secondary};
  }

  &:disabled {
    background: ${colors.border};
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.div`
  color: ${colors.error};
  font-size: 14px;
  text-align: center;
  margin-top: 16px;
`;

const LoginLink = styled.button`
  background: none;
  border: none;
  color: ${colors.primary};
  font-size: 14px;
  cursor: pointer;
  margin-top: 16px;
  text-align: center;
  width: 100%;

  &:hover {
    text-decoration: underline;
  }
`;

const HelperText = styled.p`
  font-size: 12px;
  color: ${colors.textLight};
  margin: 4px 0 0;
`;

// Registration form validation schema
const registerSchema = z.object({
  user_id: z.string().min(1, '군번은 필수 입력사항입니다.'),
  password: z.string().min(8, '비밀번호는 최소 8자 이상이어야 합니다.'),
  confirm_password: z.string().min(1, '비밀번호 확인은 필수 입력사항입니다.'),
  name: z.string().min(1, '이름은 필수 입력사항입니다.'),
  rank: z.string().min(1, '계급은 필수 입력사항입니다.'),
  unit_name: z.string().min(1, '소속 부대는 필수 입력사항입니다.'),
  phone_number: z.string().optional(),
  email: z.string().email('유효한 이메일 주소를 입력해주세요.').optional().or(z.literal('')),
}).refine(data => data.password === data.confirm_password, {
  message: '비밀번호가 일치하지 않습니다.',
  path: ['confirm_password'],
});

type RegisterFormData = z.infer<typeof registerSchema>;

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof RegisterFormData, string>>>({});
  const [generalError, setGeneralError] = useState<string | null>(null);
  
  const rankOptions = Object.values(RankSchema.enum);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrors({});
    setGeneralError(null);
    
    const formData = new FormData(event.currentTarget);
    const formValues = {
      user_id: formData.get('user_id') as string,
      password: formData.get('password') as string,
      confirm_password: formData.get('confirm_password') as string,
      name: formData.get('name') as string,
      rank: formData.get('rank') as string,
      unit_name: formData.get('unit_name') as string,
      phone_number: formData.get('phone_number') as string || undefined,
      email: formData.get('email') as string || undefined,
    };
    
    // Validate form data
    const result = registerSchema.safeParse(formValues);
    if (!result.success) {
      const formattedErrors: Partial<Record<keyof RegisterFormData, string>> = {};
      result.error.errors.forEach(error => {
        const path = error.path[0] as keyof RegisterFormData;
        formattedErrors[path] = error.message;
      });
      setErrors(formattedErrors);
      return;
    }
    
    setIsLoading(true);
    
    try {
      await register(
        formValues.user_id,
        formValues.password,
        formValues.name,
        formValues.rank,
        formValues.unit_name,
        formValues.phone_number,
        formValues.email
      );
      
      navigate('/login', { 
        state: { 
          message: '회원가입이 완료되었습니다. 관리자 승인 후 로그인이 가능합니다.' 
        } 
      });
    } catch (error) {
      console.error('회원가입 중 오류:', error);
      setGeneralError('회원가입에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container>
      <RegisterBox>
        <Title>회원가입</Title>
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label htmlFor="user_id">군번</Label>
            <Input 
              id="user_id"
              name="user_id"
              type="text"
              required
              placeholder="예: 22-12345678"
            />
            {errors.user_id && <ErrorMessage>{errors.user_id}</ErrorMessage>}
          </FormGroup>
          
          <FormRow>
            <FormGroup>
              <Label htmlFor="password">비밀번호</Label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                autoComplete="new-password"
              />
              <HelperText>8자 이상 입력해주세요</HelperText>
              {errors.password && <ErrorMessage>{errors.password}</ErrorMessage>}
            </FormGroup>
            
            <FormGroup>
              <Label htmlFor="confirm_password">비밀번호 확인</Label>
              <Input
                id="confirm_password"
                name="confirm_password"
                type="password"
                required
                autoComplete="new-password"
              />
              {errors.confirm_password && <ErrorMessage>{errors.confirm_password}</ErrorMessage>}
            </FormGroup>
          </FormRow>
          
          <FormRow>
            <FormGroup>
              <Label htmlFor="name">이름</Label>
              <Input
                id="name"
                name="name"
                type="text"
                placeholder='홍길동'
                required
              />
              {errors.name && <ErrorMessage>{errors.name}</ErrorMessage>}
            </FormGroup>
            
            <FormGroup>
              <Label htmlFor="rank">계급</Label>
              <Select
                id="rank"
                name="rank"
                required
              >
                <option value="">선택해주세요</option>
                {rankOptions.map((rank: string) => (
                  <option key={rank} value={rank}>
                    {rank}
                  </option>
                ))}
              </Select>
              {errors.rank && <ErrorMessage>{errors.rank}</ErrorMessage>}
            </FormGroup>
          </FormRow>
          
          <FormGroup>
            <Label htmlFor="unit_name">소속 부대</Label>
            <Input
              id="unit_name"
              name="unit_name"
              type="text"
              required
              placeholder="예: 제00사단 00연대 00대대"
            />
            {errors.unit_name && <ErrorMessage>{errors.unit_name}</ErrorMessage>}
          </FormGroup>
          
          <FormGroup>
            <Label htmlFor="phone_number">전화번호 (선택)</Label>
            <Input
              id="phone_number"
              name="phone_number"
              type="tel"
              placeholder="예: 010-1234-5678"
            />
            {errors.phone_number && <ErrorMessage>{errors.phone_number}</ErrorMessage>}
          </FormGroup>
          
          <FormGroup>
            <Label htmlFor="email">이메일 (선택)</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="예: example@army.mil.kr"
            />
            {errors.email && <ErrorMessage>{errors.email}</ErrorMessage>}
          </FormGroup>
          
          <Button type="submit" disabled={isLoading}>
            {isLoading ? '가입 중...' : '회원가입'}
          </Button>
          
          {generalError && <ErrorMessage>{generalError}</ErrorMessage>}
        </Form>
        
        <LoginLink onClick={() => navigate('/login')}>
          이미 계정이 있으신가요? 로그인
        </LoginLink>
      </RegisterBox>
    </Container>
  );
};

export default Register;
