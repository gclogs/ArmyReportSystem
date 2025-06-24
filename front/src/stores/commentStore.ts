import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { getApiClient } from '../lib/client';
import { getCookie } from '../lib/cookies';

export interface Comment {
  comment_id: number;
  report_id: number;
  author_id: string;
  author_name: string;
  content: string;
  created_at: string;
}

interface CommentState {
  comments: Comment[];
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
      comments: [],
      isLoading: false,
      error: null,
      
      fetchComments: async (reportId: number) => {
        set({ isLoading: true, error: null });
        
          const response = await getApiClient().get(`/comments?reportId=${reportId}`);
          const fetchedComments = response.data;
          
          set((state) => ({
            comments: fetchedComments,
            isLoading: false
          }));
          
          return fetchedComments;
      },
      
      addComment: async (reportId: number, content: string) => {
        set({ isLoading: true, error: null });
      
          const token = getCookie('access_token');
          const response = await getApiClient().post(`/comments`, 
            { content, report_id: reportId }, 
            { headers: { 'Authorization': `Bearer ${token}` } } 
          );
          const newComment = response.data;
          
          
          set((state) => ({
            comments: [...state.comments, newComment],
            isLoading: false
          }));
          
          return newComment;
      },
      
      updateComment: async (commentId: number, content: string) => {
        set({ isLoading: true, error: null });
        
          const token = localStorage.getItem('access_token');
          const response = await getApiClient().put(`/comments/${commentId}`, 
            { content }, 
            { headers: { 'Authorization': `Bearer ${token}` } } 
          );
          const updatedComment = response.data;
          
          set((state) => {
            const updatedComments = state.comments.map(comment => 
              comment.comment_id === commentId ? updatedComment : comment
            );
            
            return {
              comments: updatedComments,
              isLoading: false
            };
          });
          
          return updatedComment;
      },
      
      deleteComment: async (commentId: number) => {
        set({ isLoading: true, error: null });
        
          const token = getCookie('access_token');
          const response = await getApiClient().delete(`/comments/${commentId}`, 
            { headers: { 'Authorization': `Bearer ${token}` } } 
          );
          const updatedComment = response.data;

          set((state) => {
            const updatedComments = state.comments.filter(
              (comment) => comment.comment_id !== commentId
            );
            
            return {
              comments: updatedComments,
              isLoading: false
            };
          });
                    
          return updatedComment;
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
