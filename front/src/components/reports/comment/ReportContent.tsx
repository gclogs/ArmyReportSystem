import React from 'react';
import styled from 'styled-components';
import useAuthStore from '../../../stores/authStore';
import { useReports } from '../../../hooks/useReports';
import CommentSection from './CommentSection';
import { Report, ReportStatus, ReportPriority } from '../../../schemas/report';

const PageContainer = styled.div`
  max-width: 900px;
  margin: 0 auto;
  padding: 24px 16px;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 28px;
  padding: 28px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
  padding-bottom: 16px;
  border-bottom: 1px solid #f0f0f0;
`;

const Title = styled.h1`
  margin: 0;
  font-size: 26px;
  font-weight: 700;
  color: #333;
  line-height: 1.3;
`;

const Actions = styled.div`
  display: flex;
  gap: 12px;
`;

const MetaInfo = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  color: #666;
  font-size: 14px;
  margin-top: -8px;
  
  span {
    display: flex;
    align-items: center;
    gap: 6px;
  }
`;

const Content = styled.div`
  font-size: 16px;
  line-height: 1.8;
  white-space: pre-wrap;
  color: #333;
  background-color: #fafafa;
  padding: 20px;
  border-radius: 8px;
  border-left: 4px solid #e0e0e0;
`;

const ActionButton = styled.button`
  padding: 10px 16px;
  border: none;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: #e8e8e8;
    transform: translateY(-1px);
  }
`;

interface ReportDetailProps {
  report: Report;
  onStatusChange?: (status: ReportStatus) => Promise<void>;
  onPriorityChange?: (priority: ReportPriority) => Promise<void>;
}

const StatusBadge = styled.span<{ status: ReportStatus }>`
  display: inline-flex;
  align-items: center;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 13px;
  font-weight: 600;
  margin-left: 8px;
  
  ${({ status }) => {
    switch (status) {
      case '신규':
        return 'background-color: #e3f2fd; color: #0277bd;';
      case '진행중':
        return 'background-color: #fff8e1; color: #ff8f00;';
      case '해결됨':
        return 'background-color: #e8f5e9; color: #2e7d32;';
      case '반려':
        return 'background-color: #ffebee; color: #c62828;';
      default:
        return 'background-color: #f5f5f5; color: #616161;';
    }
  }}
`;

const PriorityBadge = styled.span<{ priority: ReportPriority }>`
  display: inline-flex;
  align-items: center;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 13px;
  font-weight: 600;
  
  ${({ priority }) => {
    switch (priority) {
      case '낮음':
        return 'background-color: #f1f8e9; color: #558b2f;';
      case '중간':
        return 'background-color: #e1f5fe; color: #0288d1;';
      case '높음':
        return 'background-color: #fff3e0; color: #ef6c00;';
      case '긴급':
        return 'background-color: #ffebee; color: #c62828;';
      default:
        return 'background-color: #f5f5f5; color: #616161;';
    }
  }}
`;

const StyledSelect = styled.select`
  padding: 10px 14px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  font-size: 15px;
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

const ReportDetail: React.FC<ReportDetailProps> = ({
  report,
  onStatusChange,
  onPriorityChange
}) => {
  const { updateReport, deleteReport } = useReports();
  const { user } = useAuthStore();
  
  const handleEditReport = () => {
    updateReport.mutate(report, {
      onSuccess: () => {
        console.log(`Report ${report.reportId} updated successfully`);
      }
    });
  };

  const handleDeleteReport = () => {
    deleteReport.mutate(report, {
      onSuccess: () => {
        console.log(`Report ${report.reportId} deleted successfully`);
      }
    });
  };
  
  const handleStatusSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value as ReportStatus;
    onStatusChange?.(newStatus);
  };

  const handlePrioritySelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newPriority = e.target.value as ReportPriority;
    onPriorityChange?.(newPriority);
  };
  
  return (
    <PageContainer>
      <Container>
        <Header>
          <div>
            <Title>
              {report.title}
              <StatusBadge status={report.status}>
                {report.status === '신규' && '신규'}
                {report.status === '진행중' && '진행중'}
                {report.status === '해결됨' && '해결됨'}
                {report.status === '반려' && '반려'}
              </StatusBadge>
              <PriorityBadge priority={report.priority}>
                {report.priority === '낮음' && '낮음'}
                {report.priority === '중간' && '중간'}
                {report.priority === '높음' && '높음'}
                {report.priority === '긴급' && '긴급'}
              </PriorityBadge>
            </Title>
          </div>
          <Actions>
            {onStatusChange && (
              <StyledSelect value={report.status} onChange={handleStatusSelect}>
                <option value="신규">신규</option>
                <option value="진행중">진행중</option>
                <option value="해결됨">해결됨</option>
                <option value="반려">반려</option>
              </StyledSelect>
            )}
            {onPriorityChange && (
              <StyledSelect value={report.priority} onChange={handlePrioritySelect}>
                <option value="낮음">낮음</option>
                <option value="중간">중간</option>
                <option value="높음">높음</option>
                <option value="긴급">긴급</option>
              </StyledSelect>
            )}
            {user?.id === report.authorId && (
              <>
                <ActionButton onClick={handleEditReport}>수정</ActionButton>
                <ActionButton onClick={handleDeleteReport}>삭제</ActionButton>
              </>
            )}
          </Actions>
        </Header>

        <MetaInfo>
          <span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z" fill="#999"/>
            </svg>
            작성자: {report.authorName}
          </span>
          <span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M11.99 2C6.47 2 2 6.48 2 12C2 17.52 6.47 22 11.99 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 11.99 2ZM12 20C7.58 20 4 16.42 4 12C4 7.58 7.58 4 12 4C16.42 4 20 7.58 20 12C20 16.42 16.42 20 12 20ZM12.5 7H11V13L16.25 16.15L17 14.92L12.5 12.25V7Z" fill="#999"/>
            </svg>
            작성일: {new Date(report.createdAt).toLocaleString()}
          </span>
        </MetaInfo>

      <Content>{report.content}</Content>

      <CommentSection 
        reportId={report.reportId}
        user={user}
      />
    </Container>
    </PageContainer>
  );
};

export { ReportDetail };
