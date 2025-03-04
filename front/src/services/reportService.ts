import { Report, ReportFilter, ReportFormData } from '../types/report';

const API_BASE_URL = '/api';

export const reportService = {
  async getReports(filter?: ReportFilter): Promise<Report[]> {
    const queryParams = filter ? `?${new URLSearchParams(Object.entries(filter).reduce((acc, [key, value]) => {
      if (value !== undefined && value !== null) {
        acc[key] = String(value);
      }
      return acc;
    }, {} as Record<string, string>))}` : '';
    const response = await fetch(`${API_BASE_URL}/reports${queryParams}`);
    if (!response.ok) throw new Error('Failed to fetch reports');
    return response.json();
  },

  async getReportById(id: string): Promise<Report> {
    const response = await fetch(`${API_BASE_URL}/reports/${id}`);
    if (!response.ok) throw new Error('Failed to fetch report');
    return response.json();
  },

  async createReport(data: ReportFormData): Promise<Report> {
    const response = await fetch(`${API_BASE_URL}/reports`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to create report');
    return response.json();
  },

  async createReportWithFormData(formData: FormData): Promise<Report> {
    const response = await fetch(`${API_BASE_URL}/reports`, {
      method: 'POST',
      // FormData를 사용할 때는 Content-Type 헤더를 설정하지 않음
      // 브라우저가 자동으로 multipart/form-data와 boundary를 설정함
      body: formData,
    });
    if (!response.ok) throw new Error('Failed to create report');
    return response.json();
  },

  async updateReport(id: string, data: Partial<ReportFormData>): Promise<Report> {
    const response = await fetch(`${API_BASE_URL}/reports/${id}`, {
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
    const response = await fetch(`${API_BASE_URL}/reports/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete report');
  },

  async approveReport(id: string, comment?: string): Promise<Report> {
    const response = await fetch(`${API_BASE_URL}/reports/${id}/approve`, {
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
    const response = await fetch(`${API_BASE_URL}/reports/${id}/reject`, {
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
