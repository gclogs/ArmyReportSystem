import React, { useState } from 'react';
import styled from 'styled-components';
import { Button } from '../../common/Button';

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

interface ReportCommentWriteProps {
  onSubmit: (comment: string) => Promise<void>;
}

const ReportCommentWrite: React.FC<ReportCommentWriteProps> = ({ onSubmit }) => {
  const [comment, setComment] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!comment.trim()) return;
    
    await onSubmit(comment);
    setComment('');
  };

  return (
    <CommentForm onSubmit={handleSubmit}>
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
  );
};

export default ReportCommentWrite;
