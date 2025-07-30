import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getApiClient } from "../lib/client";
import useAuthStore from "../stores/authStore";
import { useState } from "react";
import { Comment } from "../schemas/report";

export const useComments = (reportId: number) => {
    const { user } = useAuthStore();
    const [searchTerm, setSearchTerm] = useState('');
    const queryClient = useQueryClient();
    
    // 댓글 목록 조회 (인터셉터가 자동으로 토큰 처리)
    const { data: comments } = useQuery<Comment[]>({
        queryKey: ['comments', reportId],
        queryFn: async () => {
            try {
                const response = await getApiClient().get(`/reports/comments?reportId=${reportId}`);
                return response.data;
            } catch (error) {
                console.error('댓글 가져오기 실패:', error);
                return [];
            }
        }
    });

  // 댓글 작성 함수 - 인터셉터가 자동으로 토큰 처리
  const addComment = async (content: string) => {
    const response = await getApiClient().post(`/reports/comments?reportId=${reportId}`, { 
      content 
    });
    
    queryClient.invalidateQueries({ queryKey: ['comments'] });
    return response.data;
  };

  // 댓글 수정 함수 - useMutation 사용
  const updateComment = useMutation({
    mutationFn: async ({ commentId, content }: { commentId: number, content: string }) => {
      const response = await getApiClient().put(`/reports/comments/${commentId}`, { content });
      return response.data;
    },
    onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['comments'] });
    }
  });

  // 댓글 삭제 함수 - useMutation 사용
  const deleteComment = useMutation({
    mutationFn: async (commentId: number) => {
      const response = await getApiClient().delete(`/reports/comments/${commentId}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments'] });
    }
  });

  // 필터링된 댓글 목록
  const getFilteredComments = (): Comment[] => {
    if (!comments) return [];
    
    return comments.filter(comment => {
      if (searchTerm && 
          !comment.content?.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }
      return true;
    });
  };

  const filteredComments = getFilteredComments();

  return {
    comments,
    addComment,
    updateComment,
    deleteComment,
    filteredComments,
    setSearchTerm
  };
}