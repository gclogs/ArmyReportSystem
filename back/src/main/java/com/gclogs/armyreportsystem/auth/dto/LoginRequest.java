package com.gclogs.armyreportsystem.auth.dto;

import lombok.Getter;
import lombok.Setter;

@Getter 
@Setter
public class LoginRequest {
    private String user_id;
    private String password;
}