package com.gclogs.armyreportsystem.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class RegisterRequest {
    private String user_id;          // 군번
    private String password;        // 비밀번호
    private String rank;            // 계급
    private String role;            // 회원 구분
    private String name;            // 주성명
    private String unit_name;        // 부대이름
    private String phone_number;      // 전화번호
    private String email;           // 이메일
    private LocalDateTime created_at;
    private boolean status;       // 휴면계정
}