import { z } from 'zod';

export const ReportStatusSchema = z.enum(['new', 'in_progress', 'resolved', 'rejected']);
export const ReportPrioritySchema = z.enum(['low', 'medium', 'high', 'urgent']);
export const ReportTypeSchema = z.enum(['normal', 'emergency', 'maintenance', 'incident']);

export type ReportStatus = z.infer<typeof ReportStatusSchema>;
export type ReportPriority = z.infer<typeof ReportPrioritySchema>;
export type ReportType = z.infer<typeof ReportTypeSchema>;

export const LocationSchema = z.object({
  latitude: z.number(),
  longitude: z.number(),
  description: z.string().optional(),
});

export const CommentSchema = z.object({
  comment_id: z.string(),
  report_id: z.string(),
  author_id: z.string(),
  author_name: z.string(),
  content: z.string(),
  created_at: z.string(),
});

export const AttachmentSchema = z.object({
  attachment_id: z.string(),
  report_id: z.string(),
  file_url: z.string(),
  file_name: z.string(),
  file_type: z.string(),
  created_at: z.string(),
});

export const ReportSchema = z.object({
  report_id: z.string(),
  type: ReportTypeSchema,
  title: z.string().min(1, '제목을 입력해주세요'),
  content: z.string().min(1, '내용을 입력해주세요'),
  status: ReportStatusSchema,
  priority: ReportPrioritySchema,
  location: LocationSchema.optional(),
  author_id: z.string(),
  author_name: z.string(),
  assignee_id: z.string().optional(),
  assignee_name: z.string().optional(),
  created_at: z.string(),
  updated_at: z.string(),
  resolved_at: z.string().optional(),
  attachments: z.array(AttachmentSchema).optional(),
  comments: z.array(CommentSchema).optional(),
});

export const ReportFormSchema = z.object({
  type: ReportTypeSchema,
  title: z.string().min(1, '제목을 입력해주세요'),
  content: z.string().min(1, '내용을 입력해주세요'),
  priority: ReportPrioritySchema,
  location: LocationSchema.optional(),
  attachments: z.array(z.instanceof(File)).optional(),
});

export type Report = z.infer<typeof ReportSchema>;
export type ReportFormData = z.infer<typeof ReportFormSchema>;
export type Location = z.infer<typeof LocationSchema>;
export type Comment = z.infer<typeof CommentSchema>;
export type Attachment = z.infer<typeof AttachmentSchema>;
