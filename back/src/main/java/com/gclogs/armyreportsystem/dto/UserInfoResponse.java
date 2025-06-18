package com.gclogs.armyreportsystem.dto;

import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class UserInfoResponse {
    private final boolean success;          
    private final String user_id;            
    private final String name;              
    private final String rank;              
    private final String unit_name;          
    private final String email;             
    private final String phone_number;       
    private final LocalDateTime created_at;  
    private final LocalDateTime last_login_at; 
    private final String message;           
}
