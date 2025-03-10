import React, { useState } from 'react';
import styled from 'styled-components';
import { Report, ReportStatus } from '../../schemas/report';
import { Button } from '../common/Button';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 20px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
`;

const Title = styled.h1`
  margin: 0;
  font-size: 24px;
  font-weight: 600;
`;

const Actions = styled.div`
  display: flex;
  gap: 8px;
`;

const MetaInfo = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  color: #666;
  font-size: 14px;
`;

const Content = styled.div`
  font-size: 16px;
  line-height: 1.6;
  white-space: pre-wrap;
`;

const AttachmentSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const AttachmentList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const AttachmentItem = styled.a`
  display: flex;
  align-items: center;
  padding: 8px 12px;
  background: #f5f5f5;
  border-radius: 6px;
  text-decoration: none;
  color: inherit;
  font-size: 14px;

  &:hover {
    background: #e5e5e5;
  }
`;

const CommentSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const CommentList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const CommentItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 12px;
  background: #f5f5f5;
  border-radius: 8px;
`;

const CommentHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
`;

const CommentAuthor = styled.span`
  font-weight: 500;
`;

const CommentDate = styled.span`
  color: #666;
`;

const CommentContent = styled.p`
  margin: 0;
  font-size: 14px;
`;

const CommentForm = styled.form`
  display: flex;
  gap: 8px;
`;

const CommentInput = styled.input`
  flex: 1;
  padding: 12px;
  border: 1px solid #e1e1e1;
  border-radius: 8px;
  font-size: 16px;

  &:focus {
    outline: none;
    border-color: #007AFF;
  }
`;

interface ReportDetailProps {
  report: Report;
  isOfficer: boolean;
  onStatusChange: (status: ReportStatus) => void;
  onCommentSubmit?: (comment: string) => void;
}

const ReportDetail: React.FC<ReportDetailProps> = ({
  report,
  isOfficer,
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
    <Container>
      <Header>
        <Title>{report.title}</Title>
        {isOfficer && (
          <Actions>
            <select
              value={report.status}
              onChange={(e) => onStatusChange(e.target.value as ReportStatus)}
            >
              <option value="new">신규</option>
              <option value="in_progress">진행중</option>
              <option value="resolved">해결됨</option>
              <option value="rejected">반려</option>
            </select>
            <select
              value={report.priority}
              onChange={(e) => onStatusChange(e.target.value as ReportStatus)}
            >
              <option value="low">낮음</option>
              <option value="medium">중간</option>
              <option value="high">높음</option>
              <option value="urgent">긴급</option>
            </select>
          </Actions>
        )}
      </Header>

      <MetaInfo>
        <span>작성자: {report.authorName}</span>
        <span>작성일: {new Date(report.createdAt).toLocaleString()}</span>
        {report.assigneeName && <span>담당자: {report.assigneeName}</span>}
      </MetaInfo>

      <Content>{report.content}</Content>

      {report.attachments && report.attachments.length > 0 && (
        <AttachmentSection>
          <h3>첨부 파일</h3>
          <AttachmentList>
            {report.attachments.map((attachment) => (
              <AttachmentItem
                key={attachment.id}
                href={attachment.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                {attachment.fileName}
              </AttachmentItem>
            ))}
          </AttachmentList>
        </AttachmentSection>
      )}

      <CommentSection>
        <h3>댓글</h3>
        <CommentForm onSubmit={handleCommentSubmit}>
          <CommentInput
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="댓글을 입력하세요"
          />
          <Button type="submit">작성</Button>
        </CommentForm>
        <CommentList>
          {report.comments?.map((comment) => (
            <CommentItem key={comment.id}>
              <CommentHeader>
                <CommentAuthor>{comment.authorName}</CommentAuthor>
                <CommentDate>
                  {new Date(comment.createdAt).toLocaleString()}
                </CommentDate>
              </CommentHeader>
              <CommentContent>{comment.content}</CommentContent>
            </CommentItem>
          ))}
        </CommentList>
      </CommentSection>
    </Container>
  );
};

export { ReportDetail };
