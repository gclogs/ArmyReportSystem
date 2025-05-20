package com.gclogs.armyreportsystem.controller;

import com.gclogs.armyreportsystem.dto.LoginRequest;
import com.gclogs.armyreportsystem.dto.LoginResponse;
import com.gclogs.armyreportsystem.dto.RegisterRequest;
import com.gclogs.armyreportsystem.dto.RegisterResponse;
import com.gclogs.armyreportsystem.security.jwt.TokenRequest;
import com.gclogs.armyreportsystem.security.jwt.TokenResponse;
import com.gclogs.armyreportsystem.security.jwt.TokenService;
import com.gclogs.armyreportsystem.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.antlr.v4.runtime.Token;
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
    public ResponseEntity<TokenResponse> login(@RequestBody LoginRequest request) {
        TokenResponse tokenData = tokenService.createTokens(request.getUserId());
        return ResponseEntity.ok(tokenData);
    }

    @PostMapping("/refresh")
    public ResponseEntity<TokenResponse> refresh(@RequestBody TokenRequest request) {
        TokenResponse tokenData = tokenService.refreshAccessToken(request.getRefreshToken());

        if (!tokenData.isSuccess()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(tokenData);
        }

        return ResponseEntity.ok(tokenData);
    }
}