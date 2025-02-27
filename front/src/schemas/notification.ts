import { z } from 'zod';

export const NotificationTypeSchema = z.enum([
  'report_status_changed',
  'report_assigned',
  'report_commented',
  'report_urgent',
  'report_resolved'
]);

export const NotificationSchema = z.object({
  id: z.string(),
  type: NotificationTypeSchema,
  title: z.string(),
  message: z.string(),
  reportId: z.string().optional(),
  createdAt: z.string(),
  isRead: z.boolean(),
  recipientId: z.string(),
});

export type NotificationType = z.infer<typeof NotificationTypeSchema>;
export type Notification = z.infer<typeof NotificationSchema>;
