import { Report, ReportFilter, ReportFormData } from '../types/report';
import AuthService from './auth';

export const reportService = {
  async getReports(filter?: ReportFilter): Promise<Report[]> {
    const queryParams = filter ? `?${new URLSearchParams(Object.entries(filter).reduce((acc, [key, value]) => {
      if (value !== undefined && value !== null) {
        acc[key] = String(value);
      }
      return acc;
    }, {} as Record<string, string>))}` : '';
    const response = await fetch(`/api/reports${queryParams}`);
    if (!response.ok) throw new Error('Failed to fetch reports');
    return response.json();
  },

  async getReportById(id: string): Promise<Report> {
    const response = await fetch(`/api/reports/${id}`);
    if (!response.ok) throw new Error('Failed to fetch report');
    return response.json();
  },

  async createReportWithFormData(formData: FormData): Promise<Report> {
    const authService = AuthService.getInstance();
    const token = authService.getToken();
    const user = authService.getUser();

    if(!token || !user) {
      throw new Error('인증 정보가 없습니다. 다시 로그인하세요.');
    }

    const response = await fetch(`/api/reports`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'userId': user.id,
      },
      body: formData,
    });
    if (!response.ok) throw new Error('Failed to create report');
    return response.json();
  },

  async updateReport(id: string, data: Partial<ReportFormData>): Promise<Report> {
    const response = await fetch(`/api/reports/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to update report');
    return response.json();
  },

  async deleteReport(id: string): Promise<void> {
    const response = await fetch(`/api/reports/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete report');
  },

  async approveReport(id: string, comment?: string): Promise<Report> {
    const response = await fetch(`/api/reports/${id}/approve`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ comment }),
    });
    if (!response.ok) throw new Error('Failed to approve report');
    return response.json();
  },

  async rejectReport(id: string, reason: string): Promise<Report> {
    const response = await fetch(`/api/reports/${id}/reject`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ reason }),
    });
    if (!response.ok) throw new Error('Failed to reject report');
    return response.json();
  },
};
