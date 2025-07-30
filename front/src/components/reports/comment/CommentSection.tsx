import React, { useEffect } from 'react';
import styled from 'styled-components';
import useCommentStore from '../../../stores/commentStore';
import ReportCommentWrite from '../comment/ReportCommentWrite';
import ReportCommentList from '../comment/ReportCommentList';
import { Comment } from '../../../schemas/report';
import { User } from '../../../schemas/auth';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 18px;
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

interface CommentSectionProps {
  reportId: number;
  user?: User;
  onCommentSubmit?: (comment: string) => void;
}

const CommentSection: React.FC<CommentSectionProps> = ({
  reportId,
  user,
  onCommentSubmit,
}) => {
  const { 
    comments, 
    isLoading, 
    error, 
    fetchComments, 
    addComment,
    deleteComment,
    updateComment 
  } = useCommentStore();

  useEffect(() => {
    
    if (reportId) {
      fetchComments(reportId);
    }
  }, [reportId, fetchComments]);

  // 안전하게 댓글 배열 추출
  let reportComments: Comment[] = [];
    if (comments && typeof comments === 'object') {
      const commentsForReport = reportId ? (
        typeof reportId === 'number' ? 
          comments[reportId] || comments[reportId.toString()] : 
          comments[String(reportId)]
      ) : undefined;
      
      if (Array.isArray(commentsForReport)) {
        reportComments = commentsForReport;
      }
    } 

  const handleCommentSubmit = async (comment: string) => {
    const newComment: Comment = await addComment(reportId, comment);
    
    if (onCommentSubmit) {
      onCommentSubmit(comment);
    }
    
    // 새 댓글 추가 후 해당 댓글로 스크롤
    if (newComment && newComment.commentId) {
      setTimeout(() => {
        const commentElement = document.getElementById(`comment-${newComment.commentId}`);
        if (commentElement) {
          commentElement.scrollIntoView({ behavior: 'smooth' });
          commentElement.classList.add('highlighted');
          setTimeout(() => commentElement.classList.remove('highlighted'), 3000);
        }
      }, 100);
    }
  };

  const handleCommentDelete = async (commentId: number) => {
    await deleteComment(commentId);
  };

  const handleCommentEdit = async (commentId: number, content: string) => {
    await updateComment(commentId, content);
  };

  return (
    <Container>
      <SectionTitle>댓글</SectionTitle>
      
      <ReportCommentWrite 
        onSubmit={handleCommentSubmit} 
      />
      
      <ReportCommentList
        comments={reportComments}
        user={user}
        isLoading={isLoading}
        error={error}
        onEdit={handleCommentEdit}
        onDelete={handleCommentDelete}
      />
    </Container>
  );
};

export default CommentSection;
