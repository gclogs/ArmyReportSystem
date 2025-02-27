import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { z } from 'zod';
import { RankSchema } from '../schemas/auth';
import AuthService from '../services/auth';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 20px;
  background: #f8f9fa;
`;

const RegisterBox = styled.div`
  width: 100%;
  max-width: 500px;
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

const FormRow = styled.div`
  display: flex;
  gap: 16px;
  
  & > * {
    flex: 1;
  }
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

const Select = styled.select`
  padding: 12px;
  border: 1px solid #e1e1e1;
  border-radius: 8px;
  font-size: 16px;
  background-color: white;
  color: #333;

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

const LoginLink = styled.button`
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

const HelperText = styled.p`
  font-size: 12px;
  color: #666;
  margin: 4px 0 0;
`;

// Registration form validation schema
const registerSchema = z.object({
  userId: z.string().min(1, '군번은 필수 입력사항입니다.'),
  password: z.string().min(8, '비밀번호는 최소 8자 이상이어야 합니다.'),
  confirmPassword: z.string().min(1, '비밀번호 확인은 필수 입력사항입니다.'),
  name: z.string().min(1, '이름은 필수 입력사항입니다.'),
  rank: z.string().min(1, '계급은 필수 입력사항입니다.'),
  unitName: z.string().min(1, '소속 부대는 필수 입력사항입니다.'),
  phoneNumber: z.string().optional(),
  email: z.string().email('유효한 이메일 주소를 입력해주세요.').optional().or(z.literal('')),
}).refine(data => data.password === data.confirmPassword, {
  message: '비밀번호가 일치하지 않습니다.',
  path: ['confirmPassword'],
});

type RegisterFormData = z.infer<typeof registerSchema>;

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof RegisterFormData, string>>>({});
  const [generalError, setGeneralError] = useState<string | null>(null);
  
  // Get the rank options directly from the RankSchema enum
  const rankOptions = Object.values(RankSchema.enum);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrors({});
    setGeneralError(null);
    
    const formData = new FormData(event.currentTarget);
    const formValues = {
      userId: formData.get('userId') as string,
      password: formData.get('password') as string,
      confirmPassword: formData.get('confirmPassword') as string,
      name: formData.get('name') as string,
      rank: formData.get('rank') as string,
      unitName: formData.get('unitName') as string,
      phoneNumber: formData.get('phoneNumber') as string || undefined,
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
      const auth = AuthService.getInstance();
      await auth.register(
        formValues.userId,
        formValues.password,
        formValues.name,
        formValues.rank,
        formValues.unitName,
        formValues.phoneNumber,
        formValues.email
      );
      
      // Registration successful, redirect to login page with success message
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
            <Label htmlFor="userId">군번</Label>
            <Input
              id="userId"
              name="userId"
              type="text"
              required
              placeholder="예: 22-12345678"
            />
            {errors.userId && <ErrorMessage>{errors.userId}</ErrorMessage>}
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
              <Label htmlFor="confirmPassword">비밀번호 확인</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                autoComplete="new-password"
              />
              {errors.confirmPassword && <ErrorMessage>{errors.confirmPassword}</ErrorMessage>}
            </FormGroup>
          </FormRow>
          
          <FormRow>
            <FormGroup>
              <Label htmlFor="name">이름</Label>
              <Input
                id="name"
                name="name"
                type="text"
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
                {rankOptions.map(rank => (
                  <option key={rank} value={rank}>
                    {getRankDisplayName(rank)}
                  </option>
                ))}
              </Select>
              {errors.rank && <ErrorMessage>{errors.rank}</ErrorMessage>}
            </FormGroup>
          </FormRow>
          
          <FormGroup>
            <Label htmlFor="unitName">소속 부대</Label>
            <Input
              id="unitName"
              name="unitName"
              type="text"
              required
              placeholder="예: 제00사단 00연대 00대대"
            />
            {errors.unitName && <ErrorMessage>{errors.unitName}</ErrorMessage>}
          </FormGroup>
          
          <FormGroup>
            <Label htmlFor="phoneNumber">전화번호 (선택)</Label>
            <Input
              id="phoneNumber"
              name="phoneNumber"
              type="tel"
              placeholder="예: 010-1234-5678"
            />
            {errors.phoneNumber && <ErrorMessage>{errors.phoneNumber}</ErrorMessage>}
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

// Helper function to display rank names in Korean
function getRankDisplayName(rank: string): string {
  const rankMap: Record<string, string> = {
    'PVT': '이등병',
    'PFC': '일병',
    'CPL': '상병',
    'SGT': '병장',
    'SSG': '하사',
    'SFC': '중사',
    'MSG': '상사',
    'SGM': '원사',
    'LT': '소위',
    'CPT': '중위',
    'MAJ': '대위',
    'LTC': '소령',
    'COL': '중령',
    'BG': '대령',
  };
  
  return rankMap[rank] || rank;
}

export default Register;
