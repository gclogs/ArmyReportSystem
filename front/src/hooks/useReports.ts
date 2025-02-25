import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Report, ReportFilter, ReportFormData } from '../types/report';

const API_BASE_URL = '/api';

async function fetchReports(filter?: ReportFilter): Promise<Report[]> {
  const queryParams = filter ? `?${new URLSearchParams(filter as any)}` : '';
  const response = await fetch(`${API_BASE_URL}/reports${queryParams}`);
  if (!response.ok) throw new Error('Failed to fetch reports');
  return response.json();
}

async function createReport(data: ReportFormData): Promise<Report> {
  const response = await fetch(`${API_BASE_URL}/reports`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Failed to create report');
  return response.json();
}

async function updateReport(id: string, data: Partial<ReportFormData>): Promise<Report> {
  const response = await fetch(`${API_BASE_URL}/reports/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Failed to update report');
  return response.json();
}

export function useReports(filter?: ReportFilter) {
  return useQuery({
    queryKey: ['reports', filter],
    queryFn: () => fetchReports(filter),
  });
}

export function useCreateReport() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: createReport,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reports'] });
    },
  });
}

export function useUpdateReport() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<ReportFormData> }) =>
      updateReport(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reports'] });
    },
  });
}
