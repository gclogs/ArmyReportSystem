import React from 'react';
import styled from 'styled-components';
import { Report } from '../../schemas/report';
import { IoStar, IoTime, IoDocument, IoLocation, IoShield, IoPerson, IoCalendar } from 'react-icons/io5';

// 군대 테마에 맞는 색상 정의
const colors = {
    primary: '#2E4057', // 군복 느낌의 짙은 청록색
    secondary: '#4F6D7A', // 짙은 청록색의 밝은 버전
    accent: '#5C946E', // 군대 녹색
    highlight: '#F6BD60', // 군대 배지 색상 (금빛)
    background: '#F5F5F5', // 배경색
    backgroundLight: '#FFFFFF',
    text: '#333333', // 텍스트 색상
    textLight: '#6E6E6E', // 밝은 텍스트 색상
    border: '#E0E0E0' // 테두리 색상
};

const ListContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  background-color: ${colors.background};
  padding: 16px;
  border-radius: 12px;
`;

const ReportItem = styled.div`
  padding: 20px;
  background: ${colors.backgroundLight};
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  border: 1px solid ${colors.border};
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  position: relative;
  overflow: hidden;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    border-color: ${colors.accent};
  }
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 4px;
    height: 100%;
    background-color: ${colors.accent};
    opacity: 0.7;
  }
`;

const ReportHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
  padding-left: 8px;
`;

const ReportTitle = styled.h3`
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: ${colors.primary};
  display: flex;
  align-items: center;
  line-height: 1.4;
`;

const ReportContent = styled.p`
  margin: 0 0 16px 0;
  font-size: 14px;
  color: ${colors.text};
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-height: 1.6;
  padding-left: 8px;
  border-left: 1px dashed ${colors.border};
  margin-left: 4px;
`;

const BadgeContainer = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`;

const StatusBadge = styled.span<{ status: Report['status'] }>`
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 4px;
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
  border: 1px solid ${props => {
    switch (props.status) {
      case 'new':
        return '#bbdefb';
      case 'in_progress':
        return '#ffe0b2';
      case 'resolved':
        return '#c8e6c9';
      case 'rejected':
        return '#ffcdd2';
      default:
        return '#e0e0e0';
    }
  }};
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
`;

const PriorityBadge = styled.span<{ priority: Report['priority'] }>`
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 4px;
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
  border: 1px solid ${props => {
    switch (props.priority) {
      case 'urgent':
        return '#ffa39e';
      case 'high':
        return '#ffd591';
      case 'medium':
        return '#b7eb8f';
      case 'low':
        return '#91d5ff';
      default:
        return '#e0e0e0';
    }
  }};
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
`;

const ReportMeta = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
  color: ${colors.textLight};
  margin-top: 8px;
  padding-top: 8px;
  border-top: 1px solid ${colors.border};
`;

const MetaLeft = styled.div`
  display: flex;
  gap: 16px;
  align-items: center;
  flex-wrap: wrap;
`;

const MetaRight = styled.div`
  font-size: 13px;
  display: flex;
  align-items: center;
  gap: 4px;
`;

const MetaItem = styled.span`
  display: flex;
  align-items: center;
  gap: 4px;
  
  svg {
    color: ${colors.secondary};
  }
`;

const ImportantIcon = styled(IoStar)`
  color: ${colors.highlight} !important;
  margin-right: 6px;
`;

const NewLabel = styled.span`
  font-size: 11px;
  font-weight: 600;
  color: white;
  background-color: ${colors.accent};
  padding: 2px 6px;
  border-radius: 4px;
  margin-left: 6px;
  display: inline-flex;
  align-items: center;
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

  // 24시간 이내의 새 글인지 확인하는 함수
  const isNewReport = (date: string) => {
    const reportDate = new Date(date);
    const now = new Date();
    const diff = now.getTime() - reportDate.getTime();
    return diff < 24 * 60 * 60 * 1000; // 24시간 이내
  };
  
  // 필독 표시할 보고서인지 확인 (priority가 urgent 또는 high)
  const isImportantReport = (report: Report) => {
    return report.priority === 'urgent' || report.priority === 'high';
  };

  return (
    <ListContainer>
      {reports.map((report) => (
        <ReportItem key={report.id} onClick={() => onReportClick(report)}>
          <ReportHeader>
            <ReportTitle>
              {isImportantReport(report) && <ImportantIcon size={18} />}
              {report.title}
              {isNewReport(report.created_at) && <NewLabel>NEW</NewLabel>}
            </ReportTitle>
            <BadgeContainer>
              <PriorityBadge priority={report.priority}>
                {report.priority === 'urgent' || report.priority === 'high' ? <IoStar size={14} /> : null}
                {getPriorityText(report.priority)}
              </PriorityBadge>
              <StatusBadge status={report.status}>
                {report.status === 'new' ? <IoDocument size={14} /> : 
                 report.status === 'in_progress' ? <IoTime size={14} /> : 
                 report.status === 'resolved' ? <IoShield size={14} /> : 
                 <IoShield size={14} />}
                {getStatusText(report.status)}
              </StatusBadge>
            </BadgeContainer>
          </ReportHeader>
          <ReportContent>{report.content}</ReportContent>
          <ReportMeta>
            <MetaLeft>
              <MetaItem>
                <IoPerson size={16} />
                {report.author_name}
              </MetaItem>
              {report.location && (
                <MetaItem>
                  <IoLocation size={16} />
                  {report.location.description}
                </MetaItem>
              )}
            </MetaLeft>
            <MetaRight>
              <IoCalendar size={16} />
              {formatDate(report.created_at)}
            </MetaRight>
          </ReportMeta>
        </ReportItem>
      ))}
    </ListContainer>
  );
};

export { ReportList };
