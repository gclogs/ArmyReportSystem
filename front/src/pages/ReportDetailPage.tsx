import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ReportDetail } from '../components/reports/ReportDetail';
import useCommentStore from '../stores/commentStore';
import styled from 'styled-components';
import { Report, ReportStatus } from '../schemas/report';
import { getApiClient } from '../lib/client';
import { IoArrowBack } from 'react-icons/io5';

const PageContainer = styled.div`
  max-width: 900px;
  margin: 0 auto;
  padding: 24px 16px;
`;

const BackButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  background: none;
  border: none;
  padding: 10px 0;
  color: #2E4057;
  font-weight: 500;
  cursor: pointer;
  margin-bottom: 16px;
  
  &:hover {
    color: #5C946E;
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 300px;
  font-size: 18px;
  color: #666;
`;

const ReportDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { addComment, updateComment, deleteComment } = useCommentStore();
  
  // 보고서 데이터 로드
  useEffect(() => {
    const fetchReport = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const response = await getApiClient().get(`/reports/${id}`);
        setReport(response.data);
      } catch (error: any) {
        console.error('보고서 로드 중 오류 발생:', error);
        setError(error?.response?.data?.message || '보고서를 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchReport();
  }, [id]);
  
  // 보고서 상태 업데이트
  const updateReportStatus = async (reportId: number, status: ReportStatus) => {
    if (!report) return;
    
    try {
      await getApiClient().put(`/reports/${reportId}/status`, { status });
      
      // 보고서 상태 업데이트 후 데이터 다시 로드
      const response = await getApiClient().get(`/reports/${id}`);
      setReport(response.data);
    } catch (error) {
      console.error('상태 업데이트 실패:', error);
    }
  };
  
  // 새로운 댓글 추가 처리
  const handleCommentSubmit = async (content: string) => {
    if (!report) return;
    
    try {
      // addComment 함수를 직접 호출하고 결과를 기다림
      await addComment(report.report_id, content);
      
      // 성공 후 추가 작업이 필요한 경우 여기에 코드 추가
    } catch (error) {
      console.error('댓글 추가 실패:', error);
    }
  };
  
  const handleBack = () => {
    navigate('/reports');
  };
  
  if (loading) {
    return (
      <PageContainer>
        <BackButton onClick={handleBack}>
          <IoArrowBack /> 보고서 목록으로
        </BackButton>
        <LoadingContainer>보고서를 불러오는 중...</LoadingContainer>
      </PageContainer>
    );
  }
  
  if (error || !report) {
    return (
      <PageContainer>
        <BackButton onClick={handleBack}>
          <IoArrowBack /> 보고서 목록으로
        </BackButton>
        <LoadingContainer>
          {error || '보고서를 찾을 수 없습니다.'}
        </LoadingContainer>
      </PageContainer>
    );
  }
  
  return (
    <PageContainer>
      <BackButton onClick={handleBack}>
        <IoArrowBack /> 보고서 목록으로
      </BackButton>
      <ReportDetail
        report={report}
        onStatusChange={(status: ReportStatus) => updateReportStatus(report.report_id, status)}
        onCommentSubmit={handleCommentSubmit}
      />
    </PageContainer>
  );
};

export default ReportDetailPage;
