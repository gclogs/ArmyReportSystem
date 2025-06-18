package com.gclogs.armyreportsystem.dto;

import lombok.*;

import jakarta.validation.constraints.NotBlank;

@Getter
@Setter
public class StatusUpdateRequest {
    @NotBlank(message = "상태는 필수 항목입니다")
    private String status;                 
    
    private String comment;                
}
