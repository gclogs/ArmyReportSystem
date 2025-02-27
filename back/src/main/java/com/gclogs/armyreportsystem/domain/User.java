package com.gclogs.armyreportsystem.domain;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@Builder
public class User {
    private String userId;
    private String password;
    private String role;
    private String name;
    private String unitName;
    private String phoneNumber;
    private String email;
    private LocalDateTime createdAt;
    private String createdIP;
    private String currentIP;
    private boolean status;
}
