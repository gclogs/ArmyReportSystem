export type UserRole = 'SOLDIER' | 'OFFICER' | 'ADMIN';

export interface User {
  id: string;
  userId: string;
  name: string;
  rank: string;
  role: UserRole;
  unitId: string;
  unitName: string;
  phoneNumber?: string;
  email?: string;
  isApproved: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UserPermissions {
  canCreateReport: boolean;
  canViewAllReports: boolean;
  canApproveReports: boolean;
  canManageUsers: boolean;
  canManageUnits: boolean;
}

export const DEFAULT_PERMISSIONS: Record<UserRole, UserPermissions> = {
  SOLDIER: {
    canCreateReport: true,
    canViewAllReports: false,
    canApproveReports: false,
    canManageUsers: false,
    canManageUnits: false,
  },
  OFFICER: {
    canCreateReport: true,
    canViewAllReports: true,
    canApproveReports: true,
    canManageUsers: false,
    canManageUnits: false,
  },
  ADMIN: {
    canCreateReport: true,
    canViewAllReports: true,
    canApproveReports: true,
    canManageUsers: true,
    canManageUnits: true,
  },
};
