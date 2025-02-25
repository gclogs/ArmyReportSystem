import { z } from 'zod';

export const ReportStatusSchema = z.enum(['draft', 'pending', 'approved', 'rejected']);
export const ReportPrioritySchema = z.enum(['low', 'medium', 'high', 'urgent']);

export type ReportStatus = z.infer<typeof ReportStatusSchema>;
export type ReportPriority = z.infer<typeof ReportPrioritySchema>;

export const ReportSchema = z.object({
  id: z.string(),
  title: z.string().min(1, '제목을 입력해주세요'),
  content: z.string().min(1, '내용을 입력해주세요'),
  status: ReportStatusSchema,
  priority: ReportPrioritySchema,
  authorId: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  approvers: z.array(z.string()),
  attachments: z.array(z.string()).optional(),
  comments: z.array(
    z.object({
      id: z.string(),
      reportId: z.string(),
      authorId: z.string(),
      content: z.string(),
      createdAt: z.string(),
    })
  ).optional(),
});

export const ReportFormSchema = z.object({
  title: z.string().min(1, '제목을 입력해주세요'),
  content: z.string().min(1, '내용을 입력해주세요'),
  priority: ReportPrioritySchema,
  approvers: z.array(z.string()).min(1, '승인자를 최소 1명 이상 선택해주세요'),
  attachments: z.array(z.instanceof(File)).optional(),
});

export type Report = z.infer<typeof ReportSchema>;
export type ReportFormData = z.infer<typeof ReportFormSchema>;
