package com.gclogs.armyreportsystem.auth.controller;

import com.gclogs.armyreportsystem.auth.dto.LoginRequest;
import com.gclogs.armyreportsystem.auth.dto.LoginResponse;
import com.gclogs.armyreportsystem.auth.dto.RegisterRequest;
import com.gclogs.armyreportsystem.auth.dto.RegisterResponse;
import com.gclogs.armyreportsystem.auth.dto.TokenRequest;
import com.gclogs.armyreportsystem.auth.dto.TokenResponse;
import com.gclogs.armyreportsystem.auth.service.TokenService;
import com.gclogs.armyreportsystem.auth.util.CookieUtil;
import com.gclogs.armyreportsystem.user.domain.enums.SoliderRole;
import com.gclogs.armyreportsystem.user.service.UserService;

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
        request.setRole(SoliderRole.SOLDIER.getLevel());
        
        RegisterResponse registerData = userService.register(request);
        return ResponseEntity.ok(registerData);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request, HttpServletResponse response) {
        LoginResponse loginResponse = userService.login(request);

        System.out.println(loginResponse.getMessage());

        if (!loginResponse.isSuccess()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(loginResponse);
        }

        TokenResponse tokenData = tokenService.createTokens(request.getUserId());
        CookieUtil.addRefreshTokenCookie(response, tokenData);

        return ResponseEntity.ok(tokenData);
    }

    @PostMapping("/refresh")
    public ResponseEntity<TokenResponse> refresh(@CookieValue(name = "refreshToken", required = true) String refreshToken,
                                               @RequestBody(required = false) TokenRequest request,
                                               HttpServletResponse response) {

        TokenResponse tokenData = tokenService.refreshAccessToken(refreshToken);

        if (!tokenData.isSuccess()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(tokenData);
        }

        tokenService.updateTokenLastUsed(refreshToken);

        return ResponseEntity.ok(tokenData);
    }
}