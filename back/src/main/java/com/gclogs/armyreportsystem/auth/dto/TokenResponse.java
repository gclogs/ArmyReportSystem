package com.gclogs.armyreportsystem.auth.dto;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TokenResponse {
    private String userId;
    private String unitId;
    private String unitName;
    private int role;
    private String name;
    private String rank;
    private String email;
    private String phoneNumber;
    private LocalDateTime createdAt;

    private String accessToken;
    private String refreshToken;
    private String tokenType;
    private Long accessTokenExpiresIn;
    private Long refreshTokenExpiresIn;
    private boolean success;
    private String message;
}