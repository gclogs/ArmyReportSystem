import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useQuery, useQueryClient } from '@tanstack/react-query';
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
  padding-left: 60px;
  padding-right: 60px;
  margin: 0 auto;
  min-height: 100vh;
  background-color: ${colors.background};
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
  
  input {
    margin-right: 16px;
    color: ${colors.text};
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

// 댓글 섹션 스타일 컴포넌트
const CommentsSection = styled.div`
  margin-top: 24px;
  border-top: 1px solid ${colors.border};
  padding-top: 16px;
`;

const CommentItem = styled.div`
  background-color: ${colors.background};
  border-radius: 8px;
  padding: 12px 16px;
  margin-bottom: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
`;

const CommentHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
`;

const CommentAuthor = styled.span`
  font-weight: 500;
  color: ${colors.primary};
  font-size: 14px;
`;

const CommentDate = styled.span`
  font-size: 12px;
  color: ${colors.textLight};
`;

const CommentContent = styled.p`
  margin: 0;
  color: ${colors.text};
  font-size: 14px;
  line-height: 1.5;
`;

const NoComments = styled.div`
  text-align: center;
  padding: 16px;
  color: ${colors.textLight};
  font-style: italic;
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
  const location = useLocation();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isGridView, setIsGridView] = useState(false);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const queryClient = useQueryClient();

  // 경로 변경 시 검색어 초기화
  useEffect(() => {
    setSearchTerm('');
  }, [location.pathname]);

  // 모든 보고서 가져오기
  const { data: reports, isLoading, error } = useQuery<Report[]>({
    queryKey: ['reports'],
    queryFn: async () => {
      try {
        const response = await apiClient.get('/reports/list');
        return response.data;
      } catch (error) {
        console.error('보고서 가져오기 실패:', error);
        return [];
      }
    }
  });

  const { data: comments } = useQuery<Comment[]>({
    queryKey: ['comments', selectedReport?.id],
    queryFn: async () => {
      try {
        const response = await apiClient.get(`/reports/${selectedReport?.id}/comments`);
        return response.data;
      } catch (error) {
        console.error('댓글 가져오기 실패:', error);
        return [];
      }
    }
  });

  // 보고서 작성 함수
  const createReport = async (formData: FormData) => {

    try {
      // 사용자 인증 확인
      if (!user) {
        throw new Error('로그인이 필요합니다. 로그인 후 다시 시도해주세요.');
      }

      if (!user.id) {
        console.error('사용자 ID가 없습니다:', user);
        throw new Error('사용자 정보가 올바르지 않습니다. 다시 로그인해주세요.');
      }

      
      const response = await apiClient.post('/reports', formData, {
        headers: {
          'userId': user.userId
        }
      });
      
      console.log('보고서 생성 응답:', response.data);
      queryClient.invalidateQueries({ queryKey: ['reports'] });
      return response.data;
    } catch (error) {
      console.error('보고서 생성 중 오류:', error);
      throw error;
    }
  };

  // 보고서 상태 업데이트 함수
  const updateReportStatus = async (id: string, status: ReportStatus) => {
    try {
      const response = await apiClient.put(`/reports/${id}/status`, { status });
      // 성공 시 보고서 목록 리프레시
      queryClient.invalidateQueries({ queryKey: ['reports']});
      return response.data;
    } catch (error) {
      console.error('상태 업데이트 중 오류:', error);
      throw error;
    }
  };

  const handleSubmit = async (formData: FormData) => {
    try {
      await createReport(formData);
      // 성공 시 추가 로직이 필요하다면 여기에 추가
    } catch (error) {
      console.error('제출 중 오류:', error);
    }
  };

  const handleStatusChange = async (reportId: string, newStatus: ReportStatus) => {
    try {
      await updateReportStatus(reportId, newStatus);
    } catch (error) {
      console.error('상태 변경 중 오류:', error);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  // URL에 따라 필터링된 보고서 목록
  const getFilteredReports = () => {
    if (!reports || reports.length === 0) return [];

    // 검색어와 기본 필터링 적용
    const filteredReports = reports.filter(report => {
      const path = location.pathname;

      // 검색어로 필터링
      if (searchTerm && 
          !report.title?.toLowerCase().includes(searchTerm.toLowerCase()) && 
          !report.content?.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }
      
      if (path.includes('/reports/recommend')) {
        // 필독 목록 (우선순위가 'urgent' 또는 'high')
        return report.priority === 'urgent' || report.priority === 'high';
      } else if (path.includes('/reports/me')) {
        // 내 보고서 목록
        return report.authorId === user?.id;
      }
      
      return true; // 기본 경로면 모든 보고서 표시
    });
    
    // 최신 탭일 경우 최신 날짜순(내림차순)으로 정렬
    if (location.pathname.includes('/reports/recent')) {
      return [...filteredReports].sort((a, b) => {
        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();
        return dateB - dateA; // 내림차순 (최신순)
      });
    }
    
    return filteredReports;
  };
  
  const filteredReports = getFilteredReports();

  const getFilteredComments = () => {
    if (!selectedReport || !selectedReport.comments) return [];
    
    return selectedReport.comments.filter(comment => {
      if (searchTerm && 
          !comment.content?.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }
      return true;
    });
  };

  const filteredComments = getFilteredComments();
  
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
              isLoading={false}
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
            <CommentsSection>
              {filteredComments.map((comment, index) => (
                <CommentItem key={index}>
                  <CommentHeader>
                    <CommentAuthor>{comment.authorName || 'Anonymous'}</CommentAuthor>
                    <CommentDate>{new Date(comment.createdAt).toLocaleString()}</CommentDate>
                  </CommentHeader>
                  <CommentContent>{comment.content}</CommentContent>
                </CommentItem>
              ))}
              {filteredComments.length === 0 && (
                <NoComments>댓글이 없습니다</NoComments>
              )}
            </CommentsSection>
          </ModalContent>
        </Modal>
      )}
    </Container>
  );
};

export default Reports;
