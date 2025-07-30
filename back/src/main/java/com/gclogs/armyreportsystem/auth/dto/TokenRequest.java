package com.gclogs.armyreportsystem.auth.dto;

import lombok.*;

@Setter
@Getter
public class TokenRequest {
    public String refreshToken;
    public String accessToken;
}
