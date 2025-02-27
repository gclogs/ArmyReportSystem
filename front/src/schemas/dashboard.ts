import { z } from 'zod';
import { ReportStatusSchema, ReportPrioritySchema } from './report';

export const ReportStatisticsSchema = z.object({
  total: z.number(),
  byStatus: z.record(ReportStatusSchema, z.number()),
  byPriority: z.record(ReportPrioritySchema, z.number()),
  recentReports: z.array(z.object({
    date: z.string(),
    count: z.number(),
  })),
  averageResolutionTime: z.number(),
});

export const UnitStatisticsSchema = z.object({
  totalMembers: z.number(),
  activeReports: z.number(),
  resolvedReports: z.number(),
  responseRate: z.number(),
});

export type ReportStatistics = z.infer<typeof ReportStatisticsSchema>;
export type UnitStatistics = z.infer<typeof UnitStatisticsSchema>;
