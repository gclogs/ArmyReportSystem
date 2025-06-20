import React from 'react';
import styled from 'styled-components';
import { usePendingReports, useApproveReport, useRejectReport } from '../hooks/useApprovals';

const Container = styled.div`
  padding: 20px;
`;

const Header = styled.div`
  margin-bottom: 30px;
`;

const Title = styled.h1`
  font-size: 24px;
  color: #1a2236;
  margin-bottom: 10px;
`;

const Subtitle = styled.p`
  color: #64748b;
  font-size: 16px;
`;

const ApprovalList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const ApprovalCard = styled.div`
  background: white;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
`;

const ReportTitle = styled.h3`
  font-size: 18px;
  color: #1a2236;
  margin: 0;
`;

const PriorityBadge = styled.span<{ priority: string }>`
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
  background-color: ${({ priority }) => {
    switch (priority) {
      case 'urgent':
        return '#dc2626';
      case 'high':
        return '#fee2e2';
      case 'medium':
        return '#fef3c7';
      default:
        return '#f8fafc';
    }
  }};
  color: ${({ priority }) => {
    switch (priority) {
      case 'urgent':
        return 'white';
      case 'high':
        return '#b91c1c';
      case 'medium':
        return '#b45309';
      default:
        return '#64748b';
    }
  }};
`;

const CardContent = styled.div`
  margin-bottom: 16px;
`;

const ContentText = styled.p`
  color: #64748b;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const CardFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const MetaInfo = styled.div`
  color: #64748b;
  font-size: 14px;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 8px;
`;

const Button = styled.button<{ variant?: 'primary' | 'danger' }>`
  padding: 8px 16px;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  border: none;
  
  ${({ variant }) => {
    switch (variant) {
      case 'primary':
        return `
          background-color: #1a73e8;
          color: white;
          &:hover {
            background-color: #1557b0;
          }
        `;
      case 'danger':
        return `
          background-color: #dc2626;
          color: white;
          &:hover {
            background-color: #b91c1c;
          }
        `;
      default:
        return `
          background-color: #f1f5f9;
          color: #64748b;
          &:hover {
            background-color: #e2e8f0;
          }
        `;
    }
  }}
`;

const Approvals: React.FC = () => {
  const { data: pendingReports, isLoading } = usePendingReports();
  const { mutate: approveReport } = useApproveReport();
  const { mutate: rejectReport } = useRejectReport();

  const handleApprove = (reportId: string) => {
    approveReport({ id: reportId });
  };

  const handleReject = (reportId: string) => {
    rejectReport({ id: reportId, reason: '반려 사유' }); // TODO: Add rejection reason input
  };

  const handleViewDetails = (reportId: string) => {
    console.log('View details:', reportId);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Container>
      <Header>
        <Title>승인 관리</Title>
        <Subtitle>승인 대기 중인 보고서를 확인하고 처리하세요</Subtitle>
      </Header>

      <ApprovalList>
        {pendingReports?.map((report) => (
          <ApprovalCard key={report.report_id}>
            <CardHeader>
              <ReportTitle>{report.title}</ReportTitle>
              <PriorityBadge priority={report.priority}>
                {report.priority === 'high' ? '높음' :
                 report.priority === 'medium' ? '중간' :
                 report.priority === 'low' ? '낮음' : '긴급'}
              </PriorityBadge>
            </CardHeader>

            <CardContent>
              <ContentText>{report.content}</ContentText>
            </CardContent>

            <CardFooter>
              <MetaInfo>
                작성자: {report.author_id} | 작성일: {new Date(report.created_at).toLocaleDateString()}
              </MetaInfo>
              <ButtonGroup>
                <Button onClick={() => handleViewDetails(report.report_id)}>
                  상세보기
                </Button>
                <Button variant="primary" onClick={() => handleApprove(report.report_id)}>
                  승인
                </Button>
                <Button variant="danger" onClick={() => handleReject(report.report_id)}>
                  반려
                </Button>
              </ButtonGroup>
            </CardFooter>
          </ApprovalCard>
        ))}
      </ApprovalList>
    </Container>
  );
};

export default Approvals;
