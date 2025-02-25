import React, { useState } from 'react';
import styled from 'styled-components';
import { useReports } from '../hooks/useReports';
import type { Report, ReportStatus, ReportPriority } from '../schemas/report';

const Container = styled.div`
  padding: 20px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
`;

const Title = styled.h1`
  font-size: 24px;
  color: #1a2236;
`;

const CreateButton = styled.button`
  background-color: #1a73e8;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;

  &:hover {
    background-color: #1557b0;
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background-color: white;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
`;

const Th = styled.th`
  text-align: left;
  padding: 12px 20px;
  background-color: #f8f9fa;
  color: #64748b;
  font-weight: 600;
  border-bottom: 1px solid #e2e8f0;
`;

const Td = styled.td`
  padding: 12px 20px;
  border-bottom: 1px solid #e2e8f0;
  color: #1a2236;
`;

const StatusBadge = styled.span<{ status: ReportStatus }>`
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
  
  ${({ status }) => {
    switch (status) {
      case 'draft':
        return 'background-color: #e2e8f0; color: #64748b;';
      case 'pending':
        return 'background-color: #fff7ed; color: #c2410c;';
      case 'approved':
        return 'background-color: #f0fdf4; color: #15803d;';
      case 'rejected':
        return 'background-color: #fef2f2; color: #b91c1c;';
      default:
        return '';
    }
  }}
`;

const PriorityBadge = styled.span<{ priority: ReportPriority }>`
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
  
  ${({ priority }) => {
    switch (priority) {
      case 'low':
        return 'background-color: #f8fafc; color: #64748b;';
      case 'medium':
        return 'background-color: #fef3c7; color: #b45309;';
      case 'high':
        return 'background-color: #fee2e2; color: #b91c1c;';
      case 'urgent':
        return 'background-color: #dc2626; color: white;';
      default:
        return '';
    }
  }}
`;

const ActionButton = styled.button`
  background: none;
  border: none;
  color: #1a73e8;
  cursor: pointer;
  font-weight: 500;
  padding: 4px 8px;
  border-radius: 4px;

  &:hover {
    background-color: #f1f5f9;
  }
`;

const Reports: React.FC = () => {
  const { data: reports, isLoading } = useReports();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const handleCreateReport = () => {
    setIsCreateModalOpen(true);
  };

  const getStatusText = (status: ReportStatus): string => {
    const statusMap: Record<ReportStatus, string> = {
      draft: '임시저장',
      pending: '승인대기',
      approved: '승인완료',
      rejected: '반려',
    };
    return statusMap[status];
  };

  const getPriorityText = (priority: ReportPriority): string => {
    const priorityMap: Record<ReportPriority, string> = {
      low: '낮음',
      medium: '중간',
      high: '높음',
      urgent: '긴급',
    };
    return priorityMap[priority];
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Container>
      <Header>
        <Title>보고서 관리</Title>
        <CreateButton onClick={handleCreateReport}>
          새 보고서 작성
        </CreateButton>
      </Header>

      <Table>
        <thead>
          <tr>
            <Th>제목</Th>
            <Th>작성자</Th>
            <Th>상태</Th>
            <Th>우선순위</Th>
            <Th>작성일</Th>
            <Th>작업</Th>
          </tr>
        </thead>
        <tbody>
          {reports?.map((report) => (
            <tr key={report.id}>
              <Td>{report.title}</Td>
              <Td>{report.authorId}</Td>
              <Td>
                <StatusBadge status={report.status}>
                  {getStatusText(report.status)}
                </StatusBadge>
              </Td>
              <Td>
                <PriorityBadge priority={report.priority}>
                  {getPriorityText(report.priority)}
                </PriorityBadge>
              </Td>
              <Td>{new Date(report.createdAt).toLocaleDateString()}</Td>
              <Td>
                <ActionButton>상세보기</ActionButton>
              </Td>
            </tr>
          ))}
        </tbody>
      </Table>

      {isCreateModalOpen && (
        <div>보고서 작성 모달 (구현 예정)</div>
      )}
    </Container>
  );
};

export default Reports;
