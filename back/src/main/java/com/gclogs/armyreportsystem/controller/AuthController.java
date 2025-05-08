package com.gclogs.armyreportsystem.controller;

import com.gclogs.armyreportsystem.dto.LoginRequest;
import com.gclogs.armyreportsystem.dto.LoginResponse;
import com.gclogs.armyreportsystem.dto.RegisterRequest;
import com.gclogs.armyreportsystem.dto.RegisterResponse;
import com.gclogs.armyreportsystem.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserService userService;

    @PostMapping("/register")
    public ResponseEntity<RegisterResponse> register(@RequestBody RegisterRequest request, HttpServletRequest httpRequest) {
        request.setRole("SOLDIER"); // UserRole = 'SOLDIER' | 'OFFICER(장교)' | 'ADMIN(총관리자)'
        
        RegisterResponse registerData = userService.register(request);
        return ResponseEntity.ok(registerData);
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest request) {
        LoginResponse loginData = userService.login(request);
        return ResponseEntity.ok(loginData);
    }
}