package com.gclogs.armyreportsystem.dto;

import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class UserInfoResponse {
    private final boolean success;          // 조회 성공 여부
    private final String userId;            // 군번
    private final String name;              // 주성명
    private final String rank;              // 계급
    private final String unitName;          // 소속 부대
    private final String email;             // 이메일 (선택)
    private final String phoneNumber;       // 전화번호 (선택)
    private final LocalDateTime createdAt;  // 계정 생성 시간
    private final LocalDateTime lastLoginAt; // 마지막 로그인 시간
    private final String message;           // 응답 메시지

    // 민감한 정보인 password 등은 응답에서 제외
}
