export type ReportStatus = 'draft' | 'pending' | 'approved' | 'rejected';

export type ReportPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface Report {
  id: string;
  title: string;
  content: string;
  status: ReportStatus;
  priority: ReportPriority;
  authorId: string;
  createdAt: string;
  updatedAt: string;
  approvers: string[];
  attachments?: string[];
  comments?: ReportComment[];
}

export interface ReportComment {
  id: string;
  reportId: string;
  authorId: string;
  content: string;
  createdAt: string;
}

export interface ReportFilter {
  status?: ReportStatus;
  priority?: ReportPriority;
  authorId?: string;
  startDate?: string;
  endDate?: string;
}

export interface ReportFormData {
  title: string;
  content: string;
  priority: ReportPriority;
  approvers: string[];
  attachments?: File[];
}
