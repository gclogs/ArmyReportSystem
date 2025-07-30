import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ReportDetail } from '../components/reports/comment/ReportContent';
import styled from 'styled-components';
import { Report, ReportPriority, ReportStatus } from '../schemas/report';
import { getApiClient } from '../lib/client';
import { IoArrowBack } from 'react-icons/io5';
import { useReports } from '../hooks/useReports';

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
  const { updateReport } = useReports()
  
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

  const handleBack = () => {
    navigate('/reports');
  };
  
  const handleStatusChange = async (status: ReportStatus) => {
    if (!report) return;
    const updatedReport = { ...report, status };
    try {
      await updateReport.mutateAsync(updatedReport);
      setReport(updatedReport);
    } catch (error) {
      console.error('상태 변경 실패:', error);
    }
  };
  
  const handlePriorityChange = async (priority: ReportPriority) => {
    if (!report) return;
    const updatedReport = { ...report, priority };
    try {
      await updateReport.mutateAsync(updatedReport);
      setReport(updatedReport);
    } catch (error) {
      console.error('우선순위 변경 실패:', error);
    }
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
        onStatusChange={handleStatusChange}
        onPriorityChange={handlePriorityChange}
      />
    </PageContainer>
  );
};

export default ReportDetailPage;
