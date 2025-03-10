import React from 'react';
import styled from 'styled-components';
import { Report } from '../../schemas/report';

const ListContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const ReportItem = styled.div`
  padding: 20px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  cursor: pointer;
  transition: all 0.2s ease-in-out;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
`;

const ReportHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
`;

const ReportTitle = styled.h3`
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #1a2236;
`;

const ReportContent = styled.p`
  margin: 0 0 16px 0;
  font-size: 14px;
  color: #4a5568;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const BadgeContainer = styled.div`
  display: flex;
  gap: 8px;
`;

const StatusBadge = styled.span<{ status: Report['status'] }>`
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 500;
  background: ${props => {
    switch (props.status) {
      case 'new':
        return '#e3f2fd';
      case 'in_progress':
        return '#fff3e0';
      case 'resolved':
        return '#e8f5e9';
      case 'rejected':
        return '#ffebee';
      default:
        return '#f5f5f5';
    }
  }};
  color: ${props => {
    switch (props.status) {
      case 'new':
        return '#1976d2';
      case 'in_progress':
        return '#f57c00';
      case 'resolved':
        return '#388e3c';
      case 'rejected':
        return '#d32f2f';
      default:
        return '#757575';
    }
  }};
`;

const PriorityBadge = styled.span<{ priority: Report['priority'] }>`
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 500;
  background: ${props => {
    switch (props.priority) {
      case 'urgent':
        return '#fff1f0';
      case 'high':
        return '#fff7e6';
      case 'medium':
        return '#f6ffed';
      case 'low':
        return '#e6f7ff';
      default:
        return '#f5f5f5';
    }
  }};
  color: ${props => {
    switch (props.priority) {
      case 'urgent':
        return '#cf1322';
      case 'high':
        return '#d46b08';
      case 'medium':
        return '#389e0d';
      case 'low':
        return '#096dd9';
      default:
        return '#757575';
    }
  }};
`;

const ReportMeta = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
  color: #718096;
`;

const MetaLeft = styled.div`
  display: flex;
  gap: 16px;
`;

const MetaRight = styled.div`
  font-size: 13px;
`;

interface ReportListProps {
  reports: Report[];
  onReportClick: (report: Report) => void;
}

const ReportList: React.FC<ReportListProps> = ({ reports, onReportClick }) => {
  const getStatusText = (status: Report['status']) => {
    switch (status) {
      case 'new':
        return '신규';
      case 'in_progress':
        return '진행중';
      case 'resolved':
        return '해결됨';
      case 'rejected':
        return '반려';
      default:
        return '알 수 없음';
    }
  };

  const getPriorityText = (priority: Report['priority']) => {
    switch (priority) {
      case 'urgent':
        return '긴급';
      case 'high':
        return '높음';
      case 'medium':
        return '중간';
      case 'low':
        return '낮음';
      default:
        return '알 수 없음';
    }
  };

  const formatDate = (date: string) => {
    const d = new Date(date);
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    const diffDays = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      const diffHours = Math.floor(diff / (1000 * 60 * 60));
      if (diffHours === 0) {
        const diffMinutes = Math.floor(diff / (1000 * 60));
        return `${diffMinutes}분 전`;
      }
      return `${diffHours}시간 전`;
    } else if (diffDays === 1) {
      return '어제';
    } else if (diffDays < 7) {
      return `${diffDays}일 전`;
    }
    
    return d.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <ListContainer>
      {reports.map((report) => (
        <ReportItem key={report.id} onClick={() => onReportClick(report)}>
          <ReportHeader>
            <ReportTitle>{report.title}</ReportTitle>
            <BadgeContainer>
              <PriorityBadge priority={report.priority}>
                {getPriorityText(report.priority)}
              </PriorityBadge>
              <StatusBadge status={report.status}>
                {getStatusText(report.status)}
              </StatusBadge>
            </BadgeContainer>
          </ReportHeader>
          <ReportContent>{report.content}</ReportContent>
          <ReportMeta>
            <MetaLeft>
              <span>작성자: {report.authorName}</span>
              {report.location && (
                <span>위치: {report.location.description}</span>
              )}
            </MetaLeft>
            <MetaRight>
              {formatDate(report.createdAt)}
            </MetaRight>
          </ReportMeta>
        </ReportItem>
      ))}
    </ListContainer>
  );
};

export { ReportList };
