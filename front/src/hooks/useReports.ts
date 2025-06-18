// src/hooks/useReports.ts
import { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getApiClient } from '../lib/client';
import { Report, ReportStatus } from '../schemas/report';
import { useLocation, useNavigate } from 'react-router-dom';
import useAuthStore from '../stores/authStore';
import { getCookie } from '../lib/cookies';

export const useReports = (selectedReportId?: string) => {
  const { userId } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const queryClient = useQueryClient();

  // 인증 상태 확인
  const accessToken = getCookie('access_token');

  // 모든 보고서 가져오기
  const { data: reports, isLoading, error } = useQuery<Report[]>({
    queryKey: ['reports'],
    queryFn: async () => {
      try {
        // 토큰이 없으면 에러 발생
        if (!accessToken) {
          throw new Error('인증이 필요합니다');
        }
        
        const response = await getApiClient().get('/reports/list');
        return response.data;
      } catch (error: any) {
        console.error('보고서 목록 가져오기 실패:', error);
        
        // 401, 403 에러 시 로그인 페이지로 리다이렉트
        if (error?.response?.status === 401 || error?.response?.status === 403) {
          navigate('/login', { 
            state: { 
              from: location.pathname,
              message: '세션이 만료되었습니다. 다시 로그인해 주세요.' 
            } 
          });
        }
        
        throw error;
      }
    },
    // 토큰이 있을 때만 쿼리 실행
    enabled: !!accessToken
  });

  // 선택된 보고서의 댓글 가져오기
  const { data: comments } = useQuery<Comment[]>({
    queryKey: ['comments', selectedReport?.id],
    queryFn: async () => {
      try {
        const response = await getApiClient().get(`/reports/comments`);
        return response.data;
      } catch (error) {
        console.error('댓글 가져오기 실패:', error);
        return [];
      }
    },
    enabled: !!selectedReport?.id
  });

  // 보고서 작성 함수
  const createReport = async (formData: FormData) => {
    try {
      // 토큰이 없으면 에러 발생
      if (!accessToken) {
        throw new Error('인증이 필요합니다');
      }
      
      const response = await getApiClient().post('/reports', formData);
      queryClient.invalidateQueries({ queryKey: ['reports'] });
      return response;
    } catch (error: any) {
      console.error('보고서 작성 실패:', error);
      
      // 401, 403 에러 시 로그인 페이지로 리다이렉트
      if (error?.response?.status === 401 || error?.response?.status === 403) {
        navigate('/login', { 
          state: { 
            from: location.pathname,
            message: '세션이 만료되었습니다. 다시 로그인해 주세요.' 
          } 
        });
      }
      
      throw error;
    }
  };

  // 보고서 상태 업데이트 함수
  const updateReportStatus = async (id: string, status: ReportStatus) => {
    try {
      // 토큰이 없으면 에러 발생
      if (!accessToken) {
        throw new Error('인증이 필요합니다');
      }
      
      const response = await getApiClient().put(`/reports/${id}/status`, { status });
      queryClient.invalidateQueries({ queryKey: ['reports'] });
      return response.data;
    } catch (error: any) {
      console.error('보고서 상태 업데이트 실패:', error);
      
      // 401, 403 에러 시 로그인 페이지로 리다이렉트
      if (error?.response?.status === 401 || error?.response?.status === 403) {
        navigate('/login', { 
          state: { 
            from: location.pathname,
            message: '세션이 만료되었습니다. 다시 로그인해 주세요.' 
          } 
        });
      }
      
      throw error;
    }
  };

  // URL에 따라 필터링된 보고서 목록
  const getFilteredReports = () => {
    if (!reports || reports.length === 0) return [];

    // 검색어와 기본 필터링 적용
    const filteredReports = reports.filter((report) => {
      const path = location.pathname;

      // 검색어로 필터링
      if (searchTerm && 
          !report.title?.toLowerCase().includes(searchTerm.toLowerCase()) && 
          !report.content?.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }
      
      if (path.includes('/reports/recommend')) {
        // 필독 목록 (우선순위가 'urgent' 또는 'high')
        return report.priority === 'urgent' || report.priority === 'high';
      } else if (path.includes('/reports/me')) {
        // 내 보고서 목록
        return report.author_id === userId;
      }
      
      return true; // 기본 경로면 모든 보고서 표시
    });
    
    // 최신 탭일 경우 최신 날짜순(내림차순)으로 정렬
    if (location.pathname.includes('/reports/recent')) {
      return [...filteredReports].sort((a, b) => {
        const dateA = new Date(a.created_at).getTime();
        const dateB = new Date(b.created_at).getTime();
        return dateB - dateA; // 내림차순 (최신순)
      });
    }
    
    return filteredReports;
  };

  // 필터링된 댓글 목록
  const getFilteredComments = () => {
    if (!selectedReport || !selectedReport.comments) return [];
    
    return selectedReport.comments.filter(comment => {
      if (searchTerm && 
          !comment.content?.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }
      return true;
    });
  };

  const filteredReports = getFilteredReports();
  const filteredComments = getFilteredComments();

  return {
    reports,
    comments,
    filteredReports,
    filteredComments,
    isLoading,
    error,
    searchTerm,
    setSearchTerm,
    selectedReport,
    setSelectedReport,
    createReport,
    updateReportStatus
  };
};