package com.gclogs.armyreportsystem.dto;

import com.gclogs.armyreportsystem.domain.User;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class LoginResponse {
    private final boolean success;
    private final String message;
    private final User user;
}