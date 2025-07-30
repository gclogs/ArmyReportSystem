// src/hooks/useReports.ts
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getApiClient } from '../lib/client';
import { Report } from '../schemas/report';
import { useLocation } from 'react-router-dom';
import { useState } from 'react';

export const useReports = () => {
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState('');
  const queryClient = useQueryClient();

  // API 인터셉터가 인증 처리하므로 더 이상 토큰 업음

  // 모든 보고서 가져오기
  const { data: reports, isLoading, error } = useQuery<Report[]>({
    queryKey: ['reports'],
    queryFn: async () => {
      try {
        const response = await getApiClient().get('/reports/list');
        return response.data;
      } catch (error) {
        console.error('보고서 가져오기 실패:', error);
        return [];
      }
    }
  });

  // 보고서 작성
  const writeReport = useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await getApiClient().post('/reports', formData);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reports'] });
    }
  });

  // 보고서 상태 업데이트 함수 - 인터셉터가 토큰 처리
  const updateReport = useMutation({
    mutationFn: async (request: any) => {
      // Convert string ID to number for backend and use camelCase field name
      const reportId = parseInt(request.reportId, 10);
      const response = await getApiClient().put(`/reports/${reportId}`, request);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reports'] });
    }
  });

  const deleteReport = useMutation({
    mutationFn: async (request: any) => {
      // Convert string ID to number for backend and use camelCase field name
      const reportId = parseInt(request.reportId, 10);
      const response = await getApiClient().delete(`/reports/${reportId}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reports'] });
    }
  })

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
      
      // 검색어가 없거나, 제목/내용에 검색어가 포함된 경우
      return true;
    });
    
    // 최신 탭일 경우 최신 날짜순(내림차순)으로 정렬
    if (location.pathname.includes('/reports/recent')) {
      return [...filteredReports].sort((a, b) => {
        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();
        return dateB - dateA; // 내림차순 (최신순)
      });
    }
    
    return filteredReports;
  };

  const filteredReports = getFilteredReports();
  return {
    reports,
    filteredReports,
    isLoading,
    error,
    searchTerm,
    setSearchTerm,
    writeReport,
    updateReport,
    deleteReport
  };
};