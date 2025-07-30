import { z } from 'zod';

export const RankSchema = z.enum([
  // 병사 계급
  '이등병',
  '일병',
  '상병',
  '병장',
  
  // 부사관 계급
  '하사',
  '중사',
  '상사',
  '원사',
  
  // 장교 계급
  '소위',
  '중위',
  '대위',
  '소령',
  '중령',
  '대령',
]);

export const UnitSchema = z.object({
  unit_id: z.string(),
  unit_name: z.string(),
});

export type Unit = z.infer<typeof UnitSchema>;