package com.gclogs.armyreportsystem.dto;

import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TokenResponse {
    private String user_id;
    private String name;
    private String rank;
    private String unit_name;
    private String email;
    private String access_token;
    private String refresh_token;
    private String token_type;
    private Long access_token_expires_in;
    private Long refresh_token_expires_in;
    private boolean success;
    private String message;
}
