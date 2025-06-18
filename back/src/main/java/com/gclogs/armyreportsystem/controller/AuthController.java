package com.gclogs.armyreportsystem.controller;

import com.gclogs.armyreportsystem.dto.*;
import com.gclogs.armyreportsystem.service.TokenService;
import com.gclogs.armyreportsystem.service.UserService;
import com.gclogs.armyreportsystem.util.CookieUtil;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserService userService;
    private final TokenService tokenService;

    @PostMapping("/register")
    public ResponseEntity<RegisterResponse> register(@RequestBody RegisterRequest request, HttpServletRequest httpRequest) {
        request.setRole("SOLDIER"); // UserRole = 'SOLDIER' | 'OFFICER(장교)' | 'ADMIN(총관리자)'
        
        RegisterResponse registerData = userService.register(request);
        return ResponseEntity.ok(registerData);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request, HttpServletResponse response) {
        LoginResponse loginResponse = userService.login(request);

        if (!loginResponse.isSuccess()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(loginResponse);
        }

        TokenResponse tokenData = tokenService.createTokens(request.getUser_id());
        CookieUtil.addRefreshTokenCookie(response, tokenData);

        return ResponseEntity.ok(tokenData);
    }

    @PostMapping("/refresh")
    public ResponseEntity<TokenResponse> refresh(@CookieValue(name = "refresh_token", required = false) String refreshToken,
                                               @RequestBody(required = false) TokenRequest request,
                                               HttpServletResponse response) {
        // 쿠키에서 리프레시 토큰을 가져오거나, 요청 본문에서 가져옴
        String tokenToUse = refreshToken != null ? refreshToken :
                           (request != null ? request.getRefresh_token() : null);

        if (tokenToUse == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(TokenResponse.builder()
                          .success(false)
                          .message("리프레시 토큰이 제공되지 않았습니다.")
                          .build());
        }

        TokenResponse tokenData = tokenService.refreshAccessToken(tokenToUse);

        if (!tokenData.isSuccess()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(tokenData);
        }

        // 새로운 리프레시 토큰이 있다면 쿠키 갱신 (토큰 로테이션 구현 시)
        if (tokenData.getRefresh_token() != null) {
            CookieUtil.addRefreshTokenCookie(response, tokenData);
        }

        return ResponseEntity.ok(tokenData);
    }
}