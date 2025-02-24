package com.gclogs.armyreportsystem.controller;

import com.gclogs.armyreportsystem.dto.ApiResponse;
import com.gclogs.armyreportsystem.dto.LoginRequest;
import com.gclogs.armyreportsystem.dto.LoginResponse;
import com.gclogs.armyreportsystem.dto.RegisterRequest;
import com.gclogs.armyreportsystem.dto.RegisterResponse;
import com.gclogs.armyreportsystem.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.UUID;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    // 회원가입
    @PostMapping("/register")
    public ResponseEntity<ApiResponse<RegisterResponse>> register(@RequestBody RegisterRequest request) {
        RegisterResponse registerData = userService.register(request);
        return ResponseEntity.ok(ApiResponse.<RegisterResponse>builder()
            .success(true)
            .message("회원가입 성공")
            .data(registerData)
            .timestamp(LocalDateTime.now())
            .requestId(UUID.randomUUID().toString())
            .build());
    }

    // 로그인
    @PostMapping("/login")
    public ResponseEntity<ApiResponse<LoginResponse>> login(@RequestBody LoginRequest request, HttpServletRequest httpRequest) {
        String clientIp = getClientIp(httpRequest);
        LoginResponse loginData = userService.login(request, clientIp);
        return ResponseEntity.ok(ApiResponse.<LoginResponse>builder()
            .success(loginData.isSuccess())
            .message(loginData.getMessage())
            .data(loginData)
            .timestamp(LocalDateTime.now())
            .requestId(UUID.randomUUID().toString())
            .build());
    }

    // 사용자 정보 조회
    @GetMapping("/user/{userId}")
    public ResponseEntity<ApiResponse<UserInfoResponse>> getUserInfo(@PathVariable String userId) {
        UserInfoResponse userInfo = userService.getUserInfo(userId);
        return ResponseEntity.ok(ApiResponse.<UserInfoResponse>builder()
            .success(true)
            .message("사용자 정보 조회 성공")
            .data(userInfo)
            .timestamp(LocalDateTime.now())
            .requestId(UUID.randomUUID().toString())
            .build());
    }

    // 에러 응답 예시
    @ExceptionHandler(UserNotFoundException.class)
    public ResponseEntity<ApiResponse<Void>> handleUserNotFound(UserNotFoundException e) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
            .body(ApiResponse.<Void>builder()
                .success(false)
                .message(e.getMessage())
                .timestamp(LocalDateTime.now())
                .requestId(UUID.randomUUID().toString())
                .build());
    }

    // 클라이언트 IP 가져오는 메서드
    private String getClientIp(HttpServletRequest request) {
        String clientIp = request.getHeader("X-Forwarded-For");
        if (clientIp == null || clientIp.isEmpty() || "unknown".equalsIgnoreCase(clientIp)) {
            clientIp = request.getRemoteAddr();
        }
        return clientIp;
    }
}