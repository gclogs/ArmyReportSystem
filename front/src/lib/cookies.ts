/**
 * 쿠키 관련 유틸리티 함수들
 */

/**
 * 쿠키 설정 함수
 * @param name 쿠키 이름
 * @param value 쿠키 값
 * @param days 유효 기간 (일)
 * @param path 쿠키 경로 (기본값: '/')
 */
export const setCookie = (name: string, value: string, days: number, path = '/') => {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    const expires = `expires=${date.toUTCString()}`;
    document.cookie = `${name}=${value};${expires};path=${path};SameSite=Lax`;
};

/**
 * 쿠키 가져오기 함수
 * @param name 쿠키 이름
 * @returns 쿠키 값 또는 빈 문자열
 */
export const getCookie = (name: string): string => {
    const nameString = `${name}=`;
    const decodedCookie = decodeURIComponent(document.cookie);
    const cookieArray = decodedCookie.split(';');
    
    for (let i = 0; i < cookieArray.length; i++) {
        let cookie = cookieArray[i].trim();
        if (cookie.indexOf(nameString) === 0) {
            return cookie.substring(nameString.length, cookie.length);
        }
    }
    return '';
};

/**
 * 쿠키 삭제 함수
 * @param name 쿠키 이름
 * @param path 쿠키 경로 (기본값: '/')
 */
export const deleteCookie = (name: string, path = '/') => {
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=${path};SameSite=Lax`;
};
