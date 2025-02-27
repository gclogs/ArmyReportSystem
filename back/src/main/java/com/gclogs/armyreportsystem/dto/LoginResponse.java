package com.gclogs.armyreportsystem.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class LoginResponse {
    private final boolean success;
    private final String userId;
    private final String username;
    private final String role;
    private final String message;
}