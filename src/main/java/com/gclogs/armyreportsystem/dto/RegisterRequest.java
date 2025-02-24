package com.gclogs.armyreportsystem.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class RegisterRequest {
    private String userId;          // 군번
    private String password;        // 비밀번호
    private String role;            // 계급
    private String name;            // 주성명
    private String email;           // 이메일
    private String createdIP;       // 생성당시IP
    private String currentIP;       // 접속중인IP
    private LocalDateTime createdAt;
    private boolean status;       // 휴면계정
}