import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Report } from '../schemas/report';

const API_BASE_URL = '/api';

async function fetchPendingReports(): Promise<Report[]> {
  const response = await fetch(`${API_BASE_URL}/reports?status=pending`);
  if (!response.ok) throw new Error('Failed to fetch pending reports');
  return response.json();
}

async function approveReport(data: { id: string; comment?: string }): Promise<Report> {
  const response = await fetch(`${API_BASE_URL}/reports/${data.id}/approve`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ comment: data.comment }),
  });
  if (!response.ok) throw new Error('Failed to approve report');
  return response.json();
}

async function rejectReport(data: { id: string; reason: string }): Promise<Report> {
  const response = await fetch(`${API_BASE_URL}/reports/${data.id}/reject`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ reason: data.reason }),
  });
  if (!response.ok) throw new Error('Failed to reject report');
  return response.json();
}

export function usePendingReports() {
  return useQuery({
    queryKey: ['reports', 'pending'],
    queryFn: fetchPendingReports,
  });
}

export function useApproveReport() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: approveReport,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reports'] });
    },
  });
}

export function useRejectReport() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: rejectReport,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reports'] });
    },
  });
}
