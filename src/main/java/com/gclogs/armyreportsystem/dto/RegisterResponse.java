package com.gclogs.armyreportsystem.dto;

import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class RegisterResponse {
    private final boolean success;          // 회원가입 성공 여부
    private final String userId;            // 군번
    private final String name;              // 주성명
    private final String role;              // 계급
    private final LocalDateTime createdAt;  // 계정 생성 시간
    private final String message;

    // 민감한 정보인 password, email 등은 응답에서 제외
}