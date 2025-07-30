import { z } from 'zod';

export const UserSchema = z.object({
  id: z.string(),
  unitId: z.string(),
  unitName: z.string(),
  name: z.string(),
  role: z.number(),
  rank: z.string(),
  phoneNumber: z.string().optional(),
  email: z.string().email().optional()
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

// 기본 권한 설정
export const DEFAULT_PERMISSIONS: Record<number, Permission[]> = {
  1: [
    'CREATE_REPORT',
    'VIEW_REPORT',
  ],
  2: [
    'CREATE_REPORT',
    'VIEW_REPORT',
    'EDIT_REPORT',
    'APPROVE_REPORT',
    'VIEW_USERS',
  ],
  3: [
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
