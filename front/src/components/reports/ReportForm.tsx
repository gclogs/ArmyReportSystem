import React, { useState } from 'react';
import styled from 'styled-components';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ReportFormSchema, type ReportFormData } from '../../schemas/report';
import CameraModal from './CameraModal';
import { Button } from '../common/Button';
import { toast } from 'react-toastify';

const PageContainer = styled.div`
  max-width: 900px;
  margin: 0 auto;
  padding: 24px 16px;
`;

const FormContainer = styled.form`
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 28px;
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const Label = styled.label`
  font-weight: 600;
  color: #333;
  text-align: left;
  font-size: 15px;
`;

const Input = styled.input`
  padding: 14px;
  border: 1px solid #e1e1e1;
  border-radius: 8px;
  font-size: 16px;
  background: white;
  color: #333;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: #007AFF;
    box-shadow: 0 0 0 3px rgba(0, 122, 255, 0.1);
  }
`;

const TextArea = styled.textarea`
  padding: 14px;
  border: 1px solid #e1e1e1;
  border-radius: 8px;
  font-size: 16px;
  min-height: 160px;
  resize: vertical;
  background: white;
  color: #333;
  transition: all 0.2s ease;
  line-height: 1.5;

  &:focus {
    outline: none;
    border-color: #007AFF;
    box-shadow: 0 0 0 3px rgba(0, 122, 255, 0.1);
  }
`;

const Select = styled.select`
  padding: 14px;
  border: 1px solid #e1e1e1;
  border-radius: 8px;
  font-size: 16px;
  background: white;
  color: #333;
  transition: all 0.2s ease;
  cursor: pointer;
  appearance: menulist;

  &:focus {
    outline: none;
    border-color: #007AFF;
    box-shadow: 0 0 0 3px rgba(0, 122, 255, 0.1);
  }
`;

const ErrorMessage = styled.span`
  color: #ff3b30;
  font-size: 14px;
  margin-top: -4px;
`;

const FileInput = styled.input`
  display: none;
`;

const FileButton = styled(Button)`
  width: fit-content;
  background-color: #f0f0f0;
  color: #555;
  padding: 10px 16px;
  border-radius: 8px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 8px;
  &:hover {
    background-color: #e0e0e0;
  }
  &:active {
    background-color: #d0d0d0;
  }
`;

const FileList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 8px 0;
`;

const FileItem = styled.li`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 14px;
  background: #f8f8f8;
  border-radius: 6px;
  margin-bottom: 6px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
  font-size: 14px;
`;

const ImagePreview = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 16px;
  margin-top: 12px;
`;

const PreviewCard = styled.div`
  position: relative;
  border-radius: 10px;
  overflow: hidden;
  aspect-ratio: 1;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.1);
`;

const PreviewImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const RemoveButton = styled.button`
  position: absolute;
  top: 8px;
  right: 8px;
  width: 28px;
  height: 28px;
  border: none;
  border-radius: 14px;
  background: rgba(255, 59, 48, 0.8);
  color: white;
  font-size: 16px;
  line-height: 1;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);

  &:hover {
    background: rgba(255, 59, 48, 1);
    transform: scale(1.05);
  }
  
  &:active {
    transform: scale(0.95);
  }
`;

interface ReportFormProps {
  onSubmit: (formData: FormData) => void;
  isLoading?: boolean;
  onSuccess?: () => void;
}

const ReportForm: React.FC<ReportFormProps> = ({ onSubmit, isLoading: externalLoading, onSuccess }) => {
  const [files, setFiles] = useState<File[]>([]);
  const [images, setImages] = useState<{ id: string; blob: Blob }[]>([]);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { register, handleSubmit, formState: { errors } } = useForm<ReportFormData>({
    resolver: zodResolver(ReportFormSchema)
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const handleCameraCapture = (imageBlob: Blob) => {
    setImages(prev => [...prev, { id: Date.now().toString(), blob: imageBlob }]);
  };

  const handleImageRemove = (id: string) => {
    setImages(prev => prev.filter(img => img.id !== id));
  };

  const handleFormSubmit = async (data: ReportFormData) => {
    try {
      setIsSubmitting(true);

      // FormData 생성
      const formData = new FormData();

      // 기본 데이터 추가
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined) {
          formData.append(key, value as string);
        }
      });

      // 파일 첨부
      files.forEach((file, index) => {
        formData.append(`attachment${index}`, file);
      });

      // 카메라로 찍은 이미지 추가
      images.forEach((image, index) => {
        formData.append(`image${index}`, image.blob, `image${index}.jpg`);
      });

      // 원본 데이터와 FormData 모두 전달
      onSubmit(formData);

      // 성공 콜백 호출
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('보고서 제출 중 오류:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isLoading = externalLoading || isSubmitting;

  return (
    <PageContainer>
      <FormContainer onSubmit={handleSubmit(handleFormSubmit)}>
        <FormGroup>
          <Label>보고 유형</Label>
          <Select {...register('type')}>
            <option value="normal">일반</option>
            <option value="emergency">긴급</option>
            <option value="maintenance">정비</option>
            <option value="incident">사고</option>
          </Select>
          {errors.type && <ErrorMessage>{errors.type.message}</ErrorMessage>}
        </FormGroup>

        <FormGroup>
          <Label>제목</Label>
          <Input {...register('title')} placeholder="제목을 입력하세요" />
          {errors.title && <ErrorMessage>{errors.title.message}</ErrorMessage>}
        </FormGroup>

        <FormGroup>
          <Label>내용</Label>
          <TextArea {...register('content')} placeholder="상세 내용을 입력하세요" />
          {errors.content && <ErrorMessage>{errors.content.message}</ErrorMessage>}
        </FormGroup>

        <FormGroup>
          <Label>우선순위</Label>
          <Select {...register('priority')}>
            <option value="low">낮음</option>
            <option value="medium">중간</option>
            <option value="high">높음</option>
            <option value="urgent">긴급</option>
          </Select>
          {errors.priority && <ErrorMessage>{errors.priority.message}</ErrorMessage>}
        </FormGroup>

        <FormGroup>
          <Label>첨부 파일</Label>
          <FileButton as="label">
            파일 선택
            <FileInput type="file" multiple onChange={handleFileChange} />
          </FileButton>
          <FileList>
            {files.map((file, index) => (
              <FileItem key={index}>
                {file.name}
                <Button
                  variant="danger"
                  onClick={() => setFiles(files.filter((_, i) => i !== index))}
                >
                  삭제
                </Button>
              </FileItem>
            ))}
          </FileList>
        </FormGroup>

        <FormGroup>
          <Label>사진</Label>
            <Button
              type="button"
              variant="secondary"
              onClick={() => setIsCameraOpen(true)}
            >
              사진 촬영
            </Button>
          
          <ImagePreview>
            {images.map(image => (
              <PreviewCard key={image.id}>
                <PreviewImage
                  src={URL.createObjectURL(image.blob)}
                  alt="Preview"
                />
                <RemoveButton
                  onClick={() => handleImageRemove(image.id)}
                  type="button"
                >
                  ×
                </RemoveButton>
              </PreviewCard>
            ))}
          </ImagePreview>
        </FormGroup>

        <Button 
          type="submit" 
          disabled={isLoading}
          style={{
            padding: '14px',
            fontSize: '16px',
            fontWeight: 600,
            borderRadius: '8px',
            transition: 'all 0.2s ease',
            boxShadow: '0 2px 6px rgba(0, 122, 255, 0.2)',
          }}
        >
          {isLoading ? (
            <>
              <span className="spinner" style={{ marginRight: '8px' }}></span>
              제출 중...
            </>
          ) : '보고서 제출'}
        </Button>
      </FormContainer>

      <CameraModal
        isOpen={isCameraOpen}
        onClose={() => setIsCameraOpen(false)}
        onCapture={handleCameraCapture}
      />
    </PageContainer>
  );
};

export { ReportForm };
