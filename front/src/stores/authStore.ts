import { create } from "zustand";
import { persist } from "zustand/middleware";
import { logout } from "../lib/api/auth";
import { deleteCookie, setCookie } from "../lib/cookies";
import { User } from "../schemas/auth";
import { devtools } from "zustand/middleware";

interface AuthStore {
    user: User;
    isAuthenticated: boolean;
    accessToken: string | null;
    refreshToken: string;
    setUser: (user: User | null) => void;
    logout: () => Promise<void>;
    setTokens: (accessToken: string | null, refreshToken: string) => void;
}

const defaultUser: User = {
    id: '',
    unitId: '',
    unitName: '',
    name: '',
    role: 0,
    rank: '',
    phoneNumber: '',
    email: '',
}

const useAuthStore = create<AuthStore>()(
    devtools(
        persist(
            (set) => ({
                user: defaultUser,
                isAuthenticated: false,
                accessToken: null,
                refreshToken: '',
                
                setUser: (user) => {
                    if (!user) {
                        return set({
                            user: defaultUser,
                            isAuthenticated: false,
                        })
                    }
                    
                    set({ 
                        user: user,
                        isAuthenticated: true,
                     });
                },

                setTokens: (accessToken: string | null, refreshToken: string) => {
                    // 쿠키에 토큰 설정 (accessToken이 null이 아닌 경우에만)
                    if (accessToken) {
                        setCookie('accessToken', accessToken, 1);
                    }
                    if (refreshToken) {
                        setCookie('refreshToken', refreshToken, 7); // refresh_token은 더 오래 유지
                    }
                    
                    set({
                        accessToken: accessToken,
                        refreshToken: refreshToken,
                    });
                },
                
                logout: async () => {
                    try {
                        await logout(); // 서버에 로그아웃 요청
                    } catch (error) {
                        console.error("로그아웃 실패:", error);
                    } finally {
                        // 항상 로컬 상태와 쿠키는 초기화
                        deleteCookie('accessToken');
                        deleteCookie('refreshToken');
                        
                        set({ 
                            user: defaultUser, 
                            isAuthenticated: false, 
                            accessToken: null,
                            refreshToken: '',
                        });
                    }
                }
            }),
            {
                name: 'user',
                partialize: (state) => ({
                    user: state.user,
                    isAuthenticated: state.isAuthenticated,
                    accessToken: state.accessToken,
                    refreshToken: state.refreshToken,
                }),
            }
        )
    )
);

export default useAuthStore;