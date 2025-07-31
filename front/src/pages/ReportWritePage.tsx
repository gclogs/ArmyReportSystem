import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import styled from 'styled-components';
import ReportWriteItem from '../components/reports/write/ReportWriteItme';

// 군부대 디자인 테마 색상
const COLORS = {
  primary: '#2D4739', // 깊은 군용 녹색
  secondary: '#4A5E46', // 옅은 군용 녹색
  accent: '#8B7648', // 황토색 (군용 카키)
  background: '#F2F2F2', // 배경색
  border: '#BDC3BC', // 테두리 색상
  text: '#1A1A1A', // 텍스트 색상
  success: '#3B613E', // 성공 메시지 색상
  danger: '#8B2C2C', // 오류 메시지 색상
  white: '#FFFFFF',
  lightGray: '#E5E5E5',
};

// 군부대 스타일의 컨테이너
const Container = styled.div`
  max-width: 800px;
  margin: 2rem auto;
  padding: 1.5rem;
  background-color: ${COLORS.white};
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.15);
  border-radius: 4px;
  border-top: 5px solid ${COLORS.primary};
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    width: 30px;
    height: 30px;
    background: linear-gradient(135deg, transparent 50%, ${COLORS.accent} 50%);
  }
`;

// 페이지 제목 스타일
const Title = styled.h1`
  margin-bottom: 1.5rem;
  color: ${COLORS.primary};
  font-size: 1.8rem;
  font-weight: 600;
  border-bottom: 2px solid ${COLORS.border};
  padding-bottom: 0.8rem;
  display: flex;
  align-items: center;
  
  &::before {
    content: '●';
    color: ${COLORS.accent};
    margin-right: 0.5rem;
    font-size: 1rem;
  }
`;

const ReportWritePage: React.FC = () => {
    const location = useLocation();
    const [isEditMode, setIsEditMode] = useState<boolean>(false);
    const [reportId, setReportId] = useState<string>('');
    
    // URL 쿼리 파라미터에서 reportId 확인 (편집 모드용)
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const id = params.get('reportId');
        
        if (id) {
            setReportId(id);
            setIsEditMode(true);
        }
    }, [location.search]);
    
    return (
        <Container>
            <Title>{isEditMode ? '보고서 수정' : '보고서 작성'}</Title>
            
            <ReportWriteItem 
                reportId={reportId} 
                isEditMode={isEditMode}
            />
        </Container>
    );
};

export default ReportWritePage;