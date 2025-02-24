package com.gclogs.armyreportsystem.domain;

import lombok.Builder;
import lombok.Getter;
import java.time.LocalDateTime;

@Getter
@Builder
public class User {
    private String userId;          // 군번
    private String password;        // 비밀번호
    private String role;            // 계급
    private String name;            // 주성명
    private String email;           // 이메일
    private LocalDateTime createDate;    // 생성일자
    private LocalDateTime modifiedDate;  // 수정일자
    private String createdIP;       // 생성당시IP
    private String currentIP;       // 접속중인IP
    private boolean status;         // 휴면계정
}