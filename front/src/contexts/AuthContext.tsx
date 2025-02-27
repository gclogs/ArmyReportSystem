import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../schemas/user';
import AuthService from '../services/auth';
import { Permission, DEFAULT_PERMISSIONS } from '../schemas/auth';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (userId: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  hasPermission: (permission: Permission) => boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const auth = AuthService.getInstance();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const currentUser = await auth.getCurrentUser();
      setUser(currentUser);
    } catch (error) {
      console.error('인증 확인 중 오류:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (userId: string, password: string) => {
    try {
      await auth.login(userId, password);
      const currentUser = await auth.getCurrentUser();
      setUser(currentUser);
    } catch (error) {
      console.error('로그인 중 오류:', error);
      throw error;
    }
  };

  const logout = () => {
    auth.logout();
    setUser(null);
  };

  const hasPermission = (permission: Permission): boolean => {
    if (!user) return false;
    
    // Get default permissions based on user role
    const userPermissions = DEFAULT_PERMISSIONS[user.role as keyof typeof DEFAULT_PERMISSIONS] || [];
    
    // Check if the user has the required permission
    return userPermissions.includes(permission);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        logout,
        isAuthenticated: auth.isAuthenticated(),
        hasPermission,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
