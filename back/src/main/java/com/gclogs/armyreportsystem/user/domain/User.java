package com.gclogs.armyreportsystem.user.domain;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDateTime;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class User {
    private String userId;
    private String unitId;
    private String unitName;
    private String password;
    private String rank;  // 실제 군 계급 (대통령, 장군, 대령 등)
    private int role;  // 권한 레벨 (숫자가 낮을수록 높은 권한)
    private String name;
    private String phoneNumber;
    private String email;
    private LocalDateTime createdAt;
    private boolean status;
}