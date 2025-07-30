package com.gclogs.armyreportsystem.user.dto;

import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class UserInfoResponse {
    private final boolean success;          
    private final String userId;            
    private final String name;              
    private final String rank;              
    private final String unitName;          
    private final String email;             
    private final String phoneNumber;       
    private final LocalDateTime createdAt;  
    private final LocalDateTime lastLoginAt; 
    private final String message;
}
