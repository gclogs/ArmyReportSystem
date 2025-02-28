package com.gclogs.armyreportsystem.controller;

import com.gclogs.armyreportsystem.dto.LoginRequest;
import com.gclogs.armyreportsystem.dto.LoginResponse;
import com.gclogs.armyreportsystem.dto.RegisterRequest;
import com.gclogs.armyreportsystem.dto.RegisterResponse;
import com.gclogs.armyreportsystem.dto.UserInfoResponse;
import com.gclogs.armyreportsystem.exception.UserNotFoundException;
import com.gclogs.armyreportsystem.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserService userService;

    // 회원가입
    @PostMapping("/register")
    public ResponseEntity<RegisterResponse> register(@RequestBody RegisterRequest request, HttpServletRequest httpRequest) {
        request.setCreatedAt(java.time.LocalDateTime.now());
        request.setRole("SOLDIER"); // UserRole = 'SOLDIER' | 'OFFICER(장교)' | 'ADMIN(총관리자)'
        
        RegisterResponse registerData = userService.register(request);
        return ResponseEntity.ok(registerData);
    }

    // 로그인
    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest request) {
        LoginResponse loginData = userService.login(request);
        return ResponseEntity.ok(loginData);
    }

    // 사용자 정보 조회
    @GetMapping("/user/{userId}")
    public ResponseEntity<UserInfoResponse> getUserInfo(@PathVariable String userId) {
        UserInfoResponse userInfo = userService.getUserInfo(userId);
        return ResponseEntity.ok(userInfo);
    }

    // 에러 응답 예시
    @ExceptionHandler(UserNotFoundException.class)
    public ResponseEntity<UserInfoResponse> handleUserNotFound(UserNotFoundException e) {
        UserInfoResponse response = UserInfoResponse.builder()
                .success(false)
                .message(e.getMessage())
                .build();
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
    }
}