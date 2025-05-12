import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { Permission, DEFAULT_PERMISSIONS } from "../schemas/auth";
import AuthService from "../services/auth";

interface User {
    id: string;
    username: string;
    role: string;
    rank: string;
    name: string;
    unitId: string;
    isApproved: boolean;
    phoneNumber: string;
    email: string;
    createdAt: string;
    lastLoginAt: string;
}

interface AuthState {
    user: User | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    setUser: (user: User | null) => void;
    setTokens: (refreshToken: string) => void;
    login: (userId: string, password: string) => Promise<void>;
    logout: () => void;
    hasPermission: (permission: Permission) => boolean;
}

const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            user: null,
            isLoading: false,
            isAuthenticated: false,
            
            setUser: (user: User | null) => {
                set({ user, isAuthenticated: !!user });
            },
            
            setTokens: (refreshToken: string) => {
            },
            
            login: async (userId: string, password: string) => {
                const authService = AuthService.getInstance();
                set({ isLoading: true });
                
                try {
                    await authService.login(userId, password);
                    const user = authService.getUser();
                    set({ user, isAuthenticated: true, isLoading: false });
                } catch (error) {
                    set({ isLoading: false });
                    throw error;
                }
            },
            
            logout: () => {
                const authService = AuthService.getInstance();
                authService.logout();
                set({ user: null, isAuthenticated: false });
            },
            
            hasPermission: (permission: Permission) => {
                const { user } = get();
                if (!user || !user.role) return false;
                
                const role = user.role as keyof typeof DEFAULT_PERMISSIONS;
                const permissions = DEFAULT_PERMISSIONS[role];
                
                return Array.isArray(permissions) && permissions.includes(permission);
            }
        }),
        {
            name: 'auth',
            storage: createJSONStorage(() => localStorage),
        }
    )
);

export default useAuthStore;