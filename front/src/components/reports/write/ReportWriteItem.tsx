import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { ReportFormData, ReportPriority, ReportType } from "../../../schemas/report";
import useAuthStore from "../../../stores/authStore";
import { useReports } from "../../../hooks/useReports";
import { Button } from "../../common/Button";

// Styled Components
const FormContainer = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
  background: #fff;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  font-weight: 600;
  color: #333;
  font-size: 16px;
`;

const Input = styled.input`
  padding: 14px;
  border: 1px solid #e1e1e1;
  border-radius: 8px;
  font-size: 16px;
  transition: all 0.2s ease;
  background-color: #fff;
  color: #333;

  &:focus {
    outline: none;
    border-color: #007AFF;
    box-shadow: 0 0 0 3px rgba(0, 122, 255, 0.1);
  }
  
  &::placeholder {
    color: #aaa;
  }
`;

const TextArea = styled.textarea`
  padding: 14px;
  border: 1px solid #e1e1e1;
  border-radius: 8px;
  font-size: 16px;
  min-height: 150px;
  resize: vertical;
  transition: all 0.2s ease;
  background-color: #fff;
  color: #333;

  &:focus {
    outline: none;
    border-color: #007AFF;
    box-shadow: 0 0 0 3px rgba(0, 122, 255, 0.1);
  }
  
  &::placeholder {
    color: #aaa;
  }
`;

const Select = styled.select`
  padding: 14px;
  border: 1px solid #e1e1e1;
  border-radius: 8px;
  font-size: 16px;
  transition: all 0.2s ease;
  background-color: #fff;
  color: #333;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: #007AFF;
    box-shadow: 0 0 0 3px rgba(0, 122, 255, 0.1);
  }
`;

const ErrorMessage = styled.div`
  color: #e74c3c;
  font-size: 14px;
  margin-top: 8px;
  padding: 10px;
  background-color: rgba(231, 76, 60, 0.1);
  border-radius: 6px;
  border-left: 3px solid #e74c3c;
`;

const SubmitButton = styled(Button)`
  align-self: flex-end;
  padding: 14px 24px;
  font-size: 16px;
  font-weight: 600;
  border-radius: 8px;
  transition: all 0.2s ease;
`;

interface ReportWriteItemProps {
    reportId?: string;
    isEditMode?: boolean;
}

const ReportWriteItem: React.FC<ReportWriteItemProps> = () => {
    const navigate = useNavigate();
    
    // 인증 및 보고서 훅
    const { user } = useAuthStore();
    const { writeReport } = useReports();
    
    // 폼 상태 관리
    const [formData, setFormData] = useState<ReportFormData>({
        type: '일반' as ReportType,
        title: '',
        content: '',
        priority: '중간' as ReportPriority,
    });
    
    // 에러 상태
    const [error, setError] = useState<string | null>(null);
    // 로딩 상태
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    
    // 폼 입력값 변경 처리
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev: ReportFormData) => ({
            ...prev,
            [name]: value
        }));
        // 입력이 변경되면 에러 메시지 초기화
        setError(null);
    };
    
    // 폼 제출 처리
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // 필수 필드 유효성 검사
        if (!formData.title.trim()) {
            setError('제목을 입력해주세요.');
            return;
        }
        
        if (!formData.content.trim()) {
            setError('내용을 입력해주세요.');
            return;
        }
        
        try {
            setError(null);
            setIsSubmitting(true);
            
            // FormData 객체 생성
            const formDataToSend = new FormData();
            formDataToSend.append('title', formData.title);
            formDataToSend.append('content', formData.content);
            formDataToSend.append('type', formData.type);
            formDataToSend.append('priority', formData.priority);
            
            // TanStack Query의 writeReport 뮤테이션 실행
            const result = await writeReport.mutateAsync(formDataToSend);
            
            // 성공 시 상세 페이지로 이동
            if (result?.data?.reportId) {
                navigate(`/reports/${result.data.reportId}`);
            } else {
                // 응답에 report_id가 없는 경우 목록 페이지로 이동
                navigate('/reports');
            }
        } catch (err) {
            console.error('보고서 작성 오류:', err);
            setError('보고서 작성 중 오류가 발생했습니다. 다시 시도해주세요.');
        } finally {
            setIsSubmitting(false);
        }
    };
    
    // 인증 상태 확인 및 리디렉션 처리
    useEffect(() => {
        // 로그인하지 않은 사용자는 로그인 페이지로 리디렉션
        if (!user) {
            navigate('/login', { replace: true });
        }
    }, [user, navigate]);

    return (
        <FormContainer onSubmit={handleSubmit}>
            {error && <ErrorMessage>{error}</ErrorMessage>}
            
            <FormGroup>
                <Label htmlFor="type">보고서 유형</Label>
                <Select
                    id="type"
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                >
                    <option value="일반">일반</option>
                    <option value="긴급">긴급</option>
                    <option value="정기">정기</option>
                </Select>
            </FormGroup>

            <FormGroup>
                <Label htmlFor="priority">중요도</Label>
                <Select
                    id="priority"
                    name="priority"
                    value={formData.priority}
                    onChange={handleChange}
                >
                    <option value="낮음">낮음</option>
                    <option value="중간">중간</option>
                    <option value="높음">높음</option>
                </Select>
            </FormGroup>
            
            <FormGroup>
                <Label htmlFor="title">제목</Label>
                <Input
                    id="title"
                    name="title"
                    type="text"
                    placeholder="보고서 제목"
                    value={formData.title}
                    onChange={handleChange}
                />
            </FormGroup>
            
            <FormGroup>
                <Label htmlFor="content">내용</Label>
                <TextArea
                    id="content"
                    name="content"
                    placeholder="보고서 내용을 작성하세요"
                    value={formData.content}
                    onChange={handleChange}
                />
            </FormGroup>

            <SubmitButton 
                type="submit" 
                disabled={isSubmitting}
            >
                {isSubmitting ? '제출 중...' : '보고서 제출'}
            </SubmitButton>
        </FormContainer>
    );
}

export default ReportWriteItem;
