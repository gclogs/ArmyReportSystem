import React, { useState } from 'react';
import styled from 'styled-components';
import { Comment } from '../../../schemas/report';
import { User } from '../../../schemas/auth';

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

const CommentEditForm = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
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

const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;
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

interface ReportCommentItemProps {
  comment: Comment;
  user?: User;
  onEdit: (commentId: number, content: string) => Promise<void>;
  onDelete: (commentId: number) => Promise<void>;
}

const ReportCommentItem: React.FC<ReportCommentItemProps> = ({
  comment,
  user,
  onEdit,
  onDelete
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(comment.content);

  const handleEditStart = () => {
    setIsEditing(true);
    setEditedContent(comment.content);
  };

  const handleEditSave = async () => {
    if (editedContent.trim()) {
      await onEdit(comment.commentId, editedContent);
      setIsEditing(false);
    }
  };

  const handleEditCancel = () => {
    setIsEditing(false);
    setEditedContent(comment.content);
  };

  console.log(user?.id, comment.authorId)

  return (
    <CommentItem 
      id={`comment-${comment.commentId}`}
    >
      <CommentHeader>
        <CommentAuthor>{comment.authorName}</CommentAuthor>
        <CommentDate>
          {new Date(comment.createdAt).toLocaleString('ko-KR')}
        </CommentDate>
      </CommentHeader>
      
      {isEditing ? (
        <CommentEditForm>
          <CommentInput
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
          />
          <ButtonGroup>
            <ActionButton type="button" onClick={handleEditSave}>
              저장
            </ActionButton>
            <ActionButton type="button" onClick={handleEditCancel}>
              취소
            </ActionButton>
          </ButtonGroup>
        </CommentEditForm>
      ) : (
        <>
          <CommentContent>{comment.content}</CommentContent>
          {user?.id === comment.authorId && (
            <ButtonGroup>
              <ActionButton 
                type="button" 
                onClick={handleEditStart}
              >
                수정
              </ActionButton>
              <ActionButton 
                type="button" 
                onClick={() => onDelete(comment.commentId)}
              >
                삭제
              </ActionButton>
            </ButtonGroup>
          )}
        </>
      )}
    </CommentItem>
  );
};

export default ReportCommentItem;
