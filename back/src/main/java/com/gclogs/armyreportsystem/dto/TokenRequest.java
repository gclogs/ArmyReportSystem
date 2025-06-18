package com.gclogs.armyreportsystem.dto;

import lombok.*;

@Setter
@Getter
public class TokenRequest {
    public String refresh_token;
    public String access_token;
}
