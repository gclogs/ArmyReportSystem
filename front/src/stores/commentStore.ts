import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { getApiClient } from '../lib/client';
import { getCookie } from '../lib/cookies';
import { Comment } from '../schemas/report';

interface CommentState {
  comments: Record<string, Comment[]>;
  isLoading: boolean;
  error: string | null;
  
  fetchComments: (reportId: number) => Promise<Comment[]>;
  
  addComment: (reportId: number, content: string) => Promise<Comment>;
  
  updateComment: (commentId: number, content: string) => Promise<Comment>;
  
  deleteComment: (commentId: number) => Promise<void>;
}

const useCommentStore = create<CommentState>()(
  persist(
    (set, get) => ({
      comments: {},
      isLoading: false,
      error: null,
      
      fetchComments: async (reportId: number) => {
        set({ isLoading: true, error: null });
        
        try {
          const response = await getApiClient().get(`/comments?reportId=${reportId}`);
          const fetchedComments = response.data;
          
          set((state) => ({
            comments: {
              ...state.comments,
              [reportId.toString()]: fetchedComments
            },
            isLoading: false
          }));
          
          return fetchedComments;
        } catch (error) {
          console.error('댓글 불러오기 실패:', error);
          set({ isLoading: false, error: '댓글을 불러오는데 실패했습니다.' });
          return [];
        }
      },
      
      addComment: async (reportId: number, content: string) => {
        set({ isLoading: true, error: null });
      
        try {
          const token = getCookie('access_token');
          const response = await getApiClient().post(`/comments`, 
            { content, reportId }, 
            { headers: { 'Authorization': `Bearer ${token}` } } 
          );
          const newComment = response.data;
          
          set((state) => {
            const currentComments = state.comments[reportId.toString()] || [];
            return {
              comments: {
                ...state.comments,
                [reportId.toString()]: [...currentComments, newComment]
              },
              isLoading: false
            };
          });
          
          return newComment;
        } catch (error) {
          console.error('댓글 추가 실패:', error);
          set({ isLoading: false, error: '댓글 작성에 실패했습니다.' });
          throw error;
        }
      },
      
      updateComment: async (commentId: number, content: string) => {
        set({ isLoading: true, error: null });
        
        try {
          const token = getCookie('access_token');
          const response = await getApiClient().put(`/comments/${commentId}`, 
            { content }, 
            { headers: { 'Authorization': `Bearer ${token}` } } 
          );
          const updatedComment = response.data;
          
          set((state) => {
            // 모든 보고서의 댓글 목록을 반복하면서 해당 댓글 ID를 찾아 업데이트
            const updatedComments = { ...state.comments };
            
            Object.keys(updatedComments).forEach(reportId => {
              const comments = updatedComments[reportId.toString()];
              const index = comments.findIndex(c => c.commentId === commentId);
              
              if (index !== -1) {
                updatedComments[reportId.toString()] = [
                  ...comments.slice(0, index),
                  updatedComment,
                  ...comments.slice(index + 1)
                ];
              }
            });
            
            return {
              comments: updatedComments,
              isLoading: false
            };
          });
          
          return updatedComment;
        } catch (error) {
          console.error('댓글 수정 실패:', error);
          set({ isLoading: false, error: '댓글 수정에 실패했습니다.' });
          throw error;
        }
      },
      
      deleteComment: async (commentId: number) => {
        set({ isLoading: true, error: null });
        
        try {
          const token = getCookie('access_token');
          await getApiClient().delete(`/comments/${commentId}`, 
            { headers: { 'Authorization': `Bearer ${token}` } } 
          );

          set((state) => {
            // 모든 보고서의 댓글 목록을 반복하면서 해당 댓글 ID를 찾아 삭제
            const updatedComments = { ...state.comments };
            
            Object.keys(updatedComments).forEach(reportId => {
              updatedComments[reportId.toString()] = updatedComments[reportId.toString()].filter(
                comment => comment.commentId !== commentId
              );
            });
            
            return {
              comments: updatedComments,
              isLoading: false
            };
          });
        } catch (error) {
          console.error('댓글 삭제 실패:', error);
          set({ isLoading: false, error: '댓글 삭제에 실패했습니다.' });
          throw error;
        }
      },
    }),
    {
      name: 'comments-storage',
      partialize: (state) => ({ 
        comments: state.comments 
      }),
    }
  )
);

export default useCommentStore;
