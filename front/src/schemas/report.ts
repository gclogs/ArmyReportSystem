import { z } from 'zod';

export const ReportStatusSchema = z.enum(['신규', '진행중', '해결됨', '반려']);
export const ReportPrioritySchema = z.enum(['낮음', '중간', '높음', '긴급']);
export const ReportTypeSchema = z.enum(['일반', '긴급', '유지보수', '사고']);

export type ReportStatus = z.infer<typeof ReportStatusSchema>;
export type ReportPriority = z.infer<typeof ReportPrioritySchema>;
export type ReportType = z.infer<typeof ReportTypeSchema>;

export const LocationSchema = z.object({
  latitude: z.number(),
  longitude: z.number(),
  description: z.string().optional(),
});

export const CommentSchema = z.object({
  commentId: z.number(),
  reportId: z.number(),
  authorId: z.string(),
  authorName: z.string(),
  content: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const ReportSchema = z.object({
  reportId: z.number(),
  type: ReportTypeSchema,
  title: z.string().min(1, '제목을 입력해주세요'),
  content: z.string().min(1, '내용을 입력해주세요'),
  status: ReportStatusSchema,
  priority: ReportPrioritySchema,
  location: LocationSchema.optional(),
  authorId: z.string(),
  authorName: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  resolvedAt: z.string().optional(),
  comments: z.array(CommentSchema).optional(),
});

export const ReportFormSchema = z.object({
  type: ReportTypeSchema,
  title: z.string().min(1, '제목을 입력해주세요'),
  content: z.string().min(1, '내용을 입력해주세요'),
  priority: ReportPrioritySchema,
  location: LocationSchema.optional(),
});

export type Report = z.infer<typeof ReportSchema>;
export type ReportFormData = z.infer<typeof ReportFormSchema>;
export type Location = z.infer<typeof LocationSchema>;
export type Comment = z.infer<typeof CommentSchema>;