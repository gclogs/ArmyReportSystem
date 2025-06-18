import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Permission } from "../schemas/auth";
import { AuthResponse, login, logout } from "../lib/api/auth";
import { setCookie, deleteCookie } from "../lib/cookies";

interface AuthState {
    userId: string | null;
    name: string | null;
    unitName: string | null;
    email: string | null;
    rank: string | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    setAuthenticated: (userId: string, isAuthenticated: boolean) => void;
    setAccessToken: (accessToken: string) => void;
    login: (userId: string, password: string) => Promise<AuthResponse>;
    logout: () => void;
    hasPermission: (permission: Permission) => boolean;
}

const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            userId: null,
            name: null,
            unitName: null,
            email: null,
            rank: null,
            isLoading: false,
            isAuthenticated: false,
            
            setAuthenticated: (userId: string, isAuthenticated: boolean) => {
                set({ userId, isAuthenticated });
            },
            
            setAccessToken: (accessToken: string) => {
                // 쿠키 유틸리티를 사용하여 토큰 저장
                setCookie('access_token', accessToken, 1); // 1일 유효
            },
            
            login: async (userId: string, password: string) => {
                set({ isLoading: true });
                
                try {
                    const response = await login(userId, password);
                    
                    // 토큰 쿠키에 저장
                    const { access_token, user_id, name, unit_name, email, rank } = response;
                    get().setAccessToken(access_token);
                    
                    // 사용자 인증 상태 설정
                    set({ 
                        userId: user_id, 
                        name,
                        unitName: unit_name,
                        email,
                        rank,
                        isAuthenticated: true, 
                        isLoading: false 
                    });
                    
                    return response;
                } catch (error) {
                    set({ isLoading: false });
                    throw error;
                }
            },
            
            logout: async () => {
                try {
                    await logout();
                } catch (error) {
                    console.error("로그아웃 실패:", error);
                }
                
                deleteCookie('access_token');
                set({ userId: null, name: null, unitName: null, email: null, rank: null, isAuthenticated: false });
            },
            
            hasPermission: (permission: Permission) => {
                const { userId, isAuthenticated } = get();
                if (!userId || !isAuthenticated) return false;
                
                return true;
            }
        }),
        {
            name: 'auth',
            partialize: (state) => ({
                userId: state.userId,
                name: state.name,
                unitName: state.unitName,
                email: state.email,
                rank: state.rank,
                isAuthenticated: state.isAuthenticated
            }),
        }
    )
);

export default useAuthStore;