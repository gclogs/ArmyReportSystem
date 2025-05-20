package com.gclogs.armyreportsystem.security.jwt;

import lombok.*;

@Setter
@Getter
public class TokenRequest {
    public String refreshToken;
    public String accessToken;
}
