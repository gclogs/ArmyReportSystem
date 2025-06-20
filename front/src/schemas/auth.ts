import { z } from 'zod';

export const RoleSchema = z.enum(['SOLDIER', 'OFFICER', 'ADMIN']);
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
  id: z.string(),
  name: z.string(),
  parentId: z.string().optional(),
});

export const UserSchema = z.object({
  id: z.string(),
  username: z.string(),
  role: RoleSchema,
  rank: RankSchema,
  name: z.string(),
  unitId: z.string(),
  isApproved: z.boolean(),
  phoneNumber: z.string().optional(),
  email: z.string().email().optional(),
  createdAt: z.string(),
  lastLoginAt: z.string().optional(),
});

export const PermissionSchema = z.enum([
  // 보고서 관련 권한
  'CREATE_REPORT',
  'VIEW_REPORT',
  'EDIT_REPORT',
  'DELETE_REPORT',
  'APPROVE_REPORT',
  
  // 사용자 관리 권한
  'VIEW_USERS',
  'EDIT_USERS',
  'APPROVE_USERS',
  
  // 부대 관리 권한
  'VIEW_UNITS',
  'EDIT_UNITS',
  
  // 시스템 관리 권한
  'MANAGE_SYSTEM',
]);

export const RolePermissionsSchema = z.record(RoleSchema, z.array(PermissionSchema));

// 기본 권한 설정
export const DEFAULT_PERMISSIONS: Record<z.infer<typeof RoleSchema>, z.infer<typeof PermissionSchema>[]> = {
  SOLDIER: [
    'CREATE_REPORT',
    'VIEW_REPORT',
  ],
  OFFICER: [
    'CREATE_REPORT',
    'VIEW_REPORT',
    'EDIT_REPORT',
    'APPROVE_REPORT',
    'VIEW_USERS',
  ],
  ADMIN: [
    'CREATE_REPORT',
    'VIEW_REPORT',
    'EDIT_REPORT',
    'DELETE_REPORT',
    'APPROVE_REPORT',
    'VIEW_USERS',
    'EDIT_USERS',
    'APPROVE_USERS',
    'VIEW_UNITS',
    'EDIT_UNITS',
    'MANAGE_SYSTEM',
  ],
};

export type Role = z.infer<typeof RoleSchema>;
export type Rank = z.infer<typeof RankSchema>;
export type Unit = z.infer<typeof UnitSchema>;
export type User = z.infer<typeof UserSchema>;
export type Permission = z.infer<typeof PermissionSchema>;

// Axios 인스턴스 설정을 위한 타입
export const ApiResponseSchema = z.object({
  success: z.boolean(),
  message: z.string().optional(),
  data: z.unknown().optional(),
  errors: z.array(z.string()).optional(),
});

export type ApiResponse<T = unknown> = z.infer<typeof ApiResponseSchema> & {
  data?: T;
};
