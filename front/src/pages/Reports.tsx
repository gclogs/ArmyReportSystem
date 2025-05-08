import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ReportForm } from '../components/reports/ReportForm';
import { ReportList } from '../components/reports/ReportList';
import { ReportDetail } from '../components/reports/ReportDetail';
import { Button } from '../components/common/Button';
import type { ReportFormData, Report, ReportStatus } from '../schemas/report';
import { useAuth } from '../contexts/AuthContext';
import apiClient from '../services/apiClient';
import HomeTab from '../components/home/HomeTab';
import { useLocation } from 'react-router-dom';
import { IoAddCircle, IoFilter, IoSearch, IoGrid, IoList } from 'react-icons/io5';

// 군대 테마에 맞는 색상 정의
const colors = {
    primary: '#2E4057', // 군복 느낌의 짙은 청록색
    secondary: '#4F6D7A', // 짙은 청록색의 밝은 버전
    accent: '#5C946E', // 군대 녹색
    highlight: '#F6BD60', // 군대 배지 색상 (금빛)
    background: '#F5F5F5', // 배경색
    text: '#333333', // 텍스트 색상
    textLight: '#6E6E6E', // 밝은 텍스트 색상
    border: '#E0E0E0' // 테두리 색상
};

const Container = styled.div`
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;
  min-height: 100vh;
  background-color: #F8F8F8;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  background-color: white;
  padding: 16px 24px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
`;

const Title = styled.h1`
  margin: 0;
  font-size: 24px;
  font-weight: 600;
  color: ${colors.primary};
  display: flex;
  align-items: center;
  
  &::after {
    content: '';
    display: inline-block;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background-color: ${colors.accent};
    margin-left: 8px;
  }
`;

const Content = styled.div`
  display: grid;
  gap: 24px;
  margin-top: 24px;
`;

const FilterBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: white;
  padding: 12px 16px;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  margin-bottom: 16px;
`;

const SearchInput = styled.div`
  display: flex;
  align-items: center;
  background-color: #F0F0F0;
  border-radius: 8px;
  padding: 8px 12px;
  flex: 1;
  max-width: 300px;
  margin-right: 16px;
  
  input {
    border: none;
    background: transparent;
    outline: none;
    width: 100%;
    margin-left: 8px;
    font-size: 14px;
  }
`;

const ButtonsContainer = styled.div`
  display: flex;
  gap: 8px;
`;

const IconButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: white;
  border: 1px solid ${colors.border};
  color: ${colors.textLight};
  border-radius: 8px;
  width: 36px;
  height: 36px;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: ${colors.background};
    color: ${colors.primary};
  }
  
  &.active {
    background-color: ${colors.accent};
    color: white;
    border-color: ${colors.accent};
  }
`;

const StyledButton = styled(Button)`
  display: flex;
  align-items: center;
  gap: 8px;
  background-color: ${colors.accent};
  color: white;
  border: none;
  padding: 10px 16px;
  border-radius: 8px;
  font-weight: 500;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: ${colors.primary};
  }
`;

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  padding: 24px;
  border-radius: 12px;
  width: 90%;
  max-width: 800px;
  max-height: 90vh;
  overflow-y: auto;
`;

const Reports: React.FC = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const location = useLocation();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isGridView, setIsGridView] = useState(false);

  // 보고서 데이터 가져오기
  const { data: reports = [], isLoading } = useQuery({
    queryKey: ['reports', location.pathname],
    queryFn: async (): Promise<Report[]> => {
      // 실제 API 호출
      try {
        const path = location.pathname;
        let endpoint = '/api/reports';
        
        // 경로에 따라 다른 API 엔드포인트 사용
        if (path.includes('/reports/recommended')) {
          endpoint = '/api/reports/recommended';
        } else if (path.includes('/reports/recent')) {
          endpoint = '/api/reports/recent';
        } else if (path.includes('/reports/me')) {
          endpoint = '/api/reports/me';
        }
        
        const response = await apiClient.get(endpoint);
        return response.data;
      } catch (error) {
        console.error('보고서 목록을 불러오는데 실패했습니다:', error);
        throw new Error('보고서 목록을 불러오는데 실패했습니다.');
      }
    },
  });

  const createReportMutation = useMutation({
    mutationFn: async ({ formData }: { formData: FormData }) => {
      const response = await apiClient.post('/reports', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reports'] });
      setIsFormOpen(false);
    },
    onError: (error) => {
      console.error('보고서 생성 중 오류:', error);
    },
  });

  const updateReportMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: ReportStatus }) => {
      const response = await apiClient.patch(`/reports/${id}`, {
        status
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reports'] });
    },
    onError: (error) => {
      console.error('상태 변경 중 오류:', error);
    },
  });

  const handleSubmit = async (_data: ReportFormData, formData: FormData) => {
    try {
      await createReportMutation.mutateAsync({ formData });
    } catch (error) {
      console.error('보고서 제출 중 오류:', error);
    }
  };

  const handleStatusChange = async (reportId: string, newStatus: ReportStatus) => {
    try {
      await updateReportMutation.mutateAsync({ id: reportId, status: newStatus });
    } catch (error) {
      console.error('상태 변경 중 오류:', error);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  // 경로 변경 시 검색어 초기화
  useEffect(() => {
    setSearchTerm('');
  }, [location.pathname]);
  
  // URL에 따라 필터링된 보고서 목록
  const getFilteredReports = () => {
    if (!reports || reports.length === 0) return [];
    
    return reports.filter(report => {
      const path = location.pathname;
      
      // 검색어로 필터링
      if (searchTerm && 
          !report.title?.toLowerCase().includes(searchTerm.toLowerCase()) && 
          !report.content?.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }
      
      if (path.includes('/reports/recommended')) {
        // 필독 목록 (우선순위가 'urgent' 또는 'high')
        return report.priority === 'urgent' || report.priority === 'high';
      } else if (path.includes('/reports/recent')) {
        // 최신 목록 (최근 7일 이내)
        const reportDate = new Date(report.createdAt);
        const now = new Date();
        const diff = now.getTime() - reportDate.getTime();
        const diffDays = Math.floor(diff / (1000 * 60 * 60 * 24));
        return diffDays < 7;
      } else if (path.includes('/reports/me')) {
        // 내 보고서 목록
        return report.authorId === user?.id;
      }
      
      return true; // 기본 경로면 모든 보고서 표시
    });
  };
  
  const filteredReports = getFilteredReports();

  return (
    <Container>
      <Header>
        <Title>군대 보고서 시스템</Title>
        <StyledButton onClick={() => setIsFormOpen(true)}>
          <IoAddCircle size={18} />
          새 보고서 작성
        </StyledButton>
      </Header>
      
      <HomeTab />
      
      <FilterBar>
        <SearchInput>
          <IoSearch size={18} color={colors.textLight} />
          <input 
            type="text" 
            placeholder="보고서 검색..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </SearchInput>
        
        <ButtonsContainer>
          <IconButton 
            className={!isGridView ? 'active' : ''}
            onClick={() => setIsGridView(false)}
            title="리스트 뷰"
          >
            <IoList size={18} />
          </IconButton>
          <IconButton 
            className={isGridView ? 'active' : ''}
            onClick={() => setIsGridView(true)}
            title="그리드 뷰"
          >
            <IoGrid size={18} />
          </IconButton>
          <IconButton title="필터">
            <IoFilter size={18} />
          </IconButton>
        </ButtonsContainer>
      </FilterBar>

      <Content>
        <ReportList
          reports={filteredReports}
          onReportClick={setSelectedReport}
        />
      </Content>

      {isFormOpen && (
        <Modal onClick={() => setIsFormOpen(false)}>
          <ModalContent onClick={e => e.stopPropagation()}>
            <ReportForm
              onSubmit={handleSubmit}
              isLoading={createReportMutation.isPending}
              onSuccess={() => setIsFormOpen(false)}
            />
          </ModalContent>
        </Modal>
      )}

      {selectedReport && (
        <Modal onClick={() => setSelectedReport(null)}>
          <ModalContent onClick={e => e.stopPropagation()}>
            <ReportDetail
              report={selectedReport}
              isOfficer={user?.role === 'OFFICER'}
              onStatusChange={(status: ReportStatus) => handleStatusChange(selectedReport.id, status)}
            />
          </ModalContent>
        </Modal>
      )}
    </Container>
  );
};

export default Reports;
