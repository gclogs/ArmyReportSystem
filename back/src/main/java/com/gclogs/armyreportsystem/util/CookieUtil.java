package com.gclogs.armyreportsystem.util;

import com.gclogs.armyreportsystem.dto.TokenResponse;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;

public class CookieUtil {
    public static void addRefreshTokenCookie(HttpServletResponse response, TokenResponse tokenData) {
        var refreshTokenCookie = new Cookie("refresh_token", tokenData.getRefresh_token());
        refreshTokenCookie.setHttpOnly(true);
        refreshTokenCookie.setSecure(true);
        refreshTokenCookie.setPath("/api/auth");
        refreshTokenCookie.setMaxAge(604800); // 7일
        response.addCookie(refreshTokenCookie);

        tokenData.setRefresh_token(null);
    }
}
