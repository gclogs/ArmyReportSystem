import React, { useState } from 'react';
import styled from 'styled-components';
import { Report, ReportStatus } from '../../schemas/report';
import { Button } from '../common/Button';

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

const AttachmentSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const AttachmentList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
`;

const AttachmentItem = styled.a`
  display: flex;
  align-items: center;
  padding: 10px 16px;
  background: #f5f5f5;
  border-radius: 8px;
  text-decoration: none;
  color: inherit;
  font-size: 14px;
  border: 1px solid #e0e0e0;
  transition: all 0.2s ease;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);

  &:hover {
    background: #e8e8e8;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);
    transform: translateY(-1px);
  }
`;

const SectionTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin: 0 0 12px 0;
  display: flex;
  align-items: center;
  gap: 8px;
  
  &::before {
    content: '';
    display: block;
    width: 4px;
    height: 18px;
    background: #007AFF;
    border-radius: 2px;
  }
`;

const CommentSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 18px;
`;

const CommentList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

const CommentItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 16px;
  background: #f8f8f8;
  border-radius: 10px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  border: 1px solid #f0f0f0;
`;

const CommentHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
`;

const CommentAuthor = styled.span`
  font-weight: 600;
  color: #333;
`;

const CommentDate = styled.span`
  color: #888;
  font-size: 13px;
`;

const CommentContent = styled.p`
  margin: 0;
  font-size: 15px;
  line-height: 1.5;
`;

const CommentForm = styled.form`
  display: flex;
  gap: 10px;
  margin-bottom: 6px;
`;

const CommentInput = styled.input`
  flex: 1;
  padding: 14px;
  border: 1px solid #e1e1e1;
  border-radius: 8px;
  font-size: 16px;
  transition: all 0.2s ease;
  background-color: #fff;
  color: #333;

  &:focus {
    outline: none;
    border-color: #007AFF;
    box-shadow: 0 0 0 3px rgba(0, 122, 255, 0.1);
  }
  
  &::placeholder {
    color: #aaa;
  }
`;

interface ReportDetailProps {
  report: Report;
  onStatusChange: (status: ReportStatus) => void;
  onCommentSubmit?: (comment: string) => void;
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
      case 'new':
        return 'background-color: #e3f2fd; color: #0277bd;';
      case 'in_progress':
        return 'background-color: #fff8e1; color: #ff8f00;';
      case 'resolved':
        return 'background-color: #e8f5e9; color: #2e7d32;';
      case 'rejected':
        return 'background-color: #ffebee; color: #c62828;';
      default:
        return 'background-color: #f5f5f5; color: #616161;';
    }
  }}
`;

const PriorityBadge = styled.span<{ priority: string }>`
  display: inline-flex;
  align-items: center;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 13px;
  font-weight: 600;
  
  ${({ priority }) => {
    switch (priority) {
      case 'low':
        return 'background-color: #f1f8e9; color: #558b2f;';
      case 'medium':
        return 'background-color: #e1f5fe; color: #0288d1;';
      case 'high':
        return 'background-color: #fff3e0; color: #ef6c00;';
      case 'urgent':
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
  onCommentSubmit,
}) => {
  const [comment, setComment] = useState('');

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (comment.trim() && onCommentSubmit) {
      onCommentSubmit(comment);
      setComment('');
    }
  };

  return (
    <PageContainer>
      <Container>
        <Header>
          <div>
            <Title>
              {report.title}
              <StatusBadge status={report.status}>
                {report.status === 'new' && '신규'}
                {report.status === 'in_progress' && '진행중'}
                {report.status === 'resolved' && '해결됨'}
                {report.status === 'rejected' && '반려'}
              </StatusBadge>
              <PriorityBadge priority={report.priority}>
                {report.priority === 'low' && '낮음'}
                {report.priority === 'medium' && '중간'}
                {report.priority === 'high' && '높음'}
                {report.priority === 'urgent' && '긴급'}
              </PriorityBadge>
            </Title>
          </div>
          <Actions>
              <StyledSelect
                value={report.status}
                onChange={(e) => onStatusChange(e.target.value as ReportStatus)}
              >
                <option value="new">신규</option>
                <option value="in_progress">진행중</option>
                <option value="resolved">해결됨</option>
                <option value="rejected">반려</option>
              </StyledSelect>
              <StyledSelect
                value={report.priority}
                onChange={(e) => onStatusChange(e.target.value as ReportStatus)}
              >
                <option value="low">낮음</option>
                <option value="medium">중간</option>
                <option value="high">높음</option>
                <option value="urgent">긴급</option>
              </StyledSelect>
            </Actions>
        </Header>

        <MetaInfo>
          <span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z" fill="#999"/>
            </svg>
            작성자: {report.author_name}
          </span>
          <span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M11.99 2C6.47 2 2 6.48 2 12C2 17.52 6.47 22 11.99 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 11.99 2ZM12 20C7.58 20 4 16.42 4 12C4 7.58 7.58 4 12 4C16.42 4 20 7.58 20 12C20 16.42 16.42 20 12 20ZM12.5 7H11V13L16.25 16.15L17 14.92L12.5 12.25V7Z" fill="#999"/>
            </svg>
            작성일: {new Date(report.created_at).toLocaleString()}
          </span>
          {report.assignee_name && (
            <span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19 3H14.82C14.4 1.84 13.3 1 12 1C10.7 1 9.6 1.84 9.18 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM12 3C12.55 3 13 3.45 13 4C13 4.55 12.55 5 12 5C11.45 5 11 4.55 11 4C11 3.45 11.45 3 12 3ZM12 7C13.66 7 15 8.34 15 10C15 11.66 13.66 13 12 13C10.34 13 9 11.66 9 10C9 8.34 10.34 7 12 7ZM18 19H6V17.6C6 15.6 10 14.5 12 14.5C14 14.5 18 15.6 18 17.6V19Z" fill="#999"/>
              </svg>
              담당자: {report.assignee_name}
            </span>
          )}
        </MetaInfo>

      <Content>{report.content}</Content>

      {report.attachments && report.attachments.length > 0 && (
        <AttachmentSection>
          <SectionTitle>첨부 파일</SectionTitle>
          <AttachmentList>
            {report.attachments.map((attachment) => (
              <AttachmentItem
                key={attachment.id}
                href={attachment.file_url}
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: '8px' }}>
                  <path d="M14 2H6C4.9 2 4.01 2.9 4.01 4L4 20C4 21.1 4.89 22 5.99 22H18C19.1 22 20 21.1 20 20V8L14 2ZM16 18H8V16H16V18ZM16 14H8V12H16V14ZM13 9V3.5L18.5 9H13Z" fill="#666"/>
                </svg>
                {attachment.file_name}
              </AttachmentItem>
            ))}
          </AttachmentList>
        </AttachmentSection>
      )}

      <CommentSection>
        <SectionTitle>댓글</SectionTitle>
        <CommentForm onSubmit={handleCommentSubmit}>
          <CommentInput
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="댓글을 입력하세요"
          />
          <Button 
            type="submit"
            style={{
              padding: '12px 16px',
              fontSize: '15px',
              fontWeight: 600,
              borderRadius: '8px',
              transition: 'all 0.2s ease',
            }}
          >
            작성
          </Button>
        </CommentForm>
        <CommentList>
          {report.comments?.map((comment) => (
            <CommentItem key={comment.id}>
              <CommentHeader>
                <CommentAuthor>{comment.author_name}</CommentAuthor>
                <CommentDate>
                  {new Date(comment.created_at).toLocaleString()}
                </CommentDate>
              </CommentHeader>
              <CommentContent>{comment.content}</CommentContent>
            </CommentItem>
          ))}
        </CommentList>
      </CommentSection>
    </Container>
    </PageContainer>
  );
};

export { ReportDetail };
