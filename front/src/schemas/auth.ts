import { z } from 'zod';

export const RoleSchema = z.enum(['SOLDIER', 'OFFICER', 'ADMIN']);
export const RankSchema = z.enum([
  // 병사 계급
  'PVT',    // 이등병
  'PFC',    // 일병
  'CPL',    // 상병
  'SGT',    // 병장
  
  // 부사관 계급
  'SSG',    // 하사
  'SFC',    // 중사
  'MSG',    // 상사
  'SGM',    // 원사
  
  // 장교 계급
  'LT',     // 소위
  'CPT',    // 중위
  'MAJ',    // 대위
  'LTC',    // 소령
  'COL',    // 중령
  'BG',     // 대령
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
