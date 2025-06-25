package com.gclogs.armyreportsystem.auth.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class RegisterResponse {
    private final boolean success;          // 회원가입 성공 여부
    private final String user_id;            // 군번
    private final String name;              // 주성명
    private final String rank;              // 계급
    private final String role;              // 회원 구분
    private final String message;           // 응답 메시지

    // 민감한 정보인 password, email 등은 응답에서 제외
}