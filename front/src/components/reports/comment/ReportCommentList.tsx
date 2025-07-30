import React from 'react';
import styled from 'styled-components';
import { Comment } from '../../../schemas/report';
import { User } from '../../../schemas/auth';
import ReportCommentItem from './ReportCommentItem';

const CommentListContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

const NoCommentsMessage = styled.div`
  text-align: center;
  padding: 20px;
  color: #888;
`;

interface ReportCommentListProps {
  comments: Comment[];
  user?: User;
  isLoading: boolean;
  error: string | null;
  onEdit: (commentId: number, content: string) => Promise<void>;
  onDelete: (commentId: number) => Promise<void>;
}

const ReportCommentList: React.FC<ReportCommentListProps> = ({
  comments,
  user,
  isLoading,
  error,
  onEdit,
  onDelete
}) => {
  if (isLoading) {
    return <div>댓글을 불러오는 중...</div>;
  }

  if (error) {
    return <div style={{ color: 'red' }}>{error}</div>;
  }

  return (
    <CommentListContainer>
      {comments.length === 0 ? (
        <NoCommentsMessage>
          댓글이 없습니다. 첫 댓글을 작성해보세요!
        </NoCommentsMessage>
      ) : (
        comments.map((comment: Comment) => (
          <ReportCommentItem
            key={`comment-${comment.commentId}`}
            comment={comment}
            user={user}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))
      )}
    </CommentListContainer>
  );
};

export default ReportCommentList;
