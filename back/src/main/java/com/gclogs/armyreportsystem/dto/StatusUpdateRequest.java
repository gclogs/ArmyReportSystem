package com.gclogs.armyreportsystem.dto;

import lombok.*;

import jakarta.validation.constraints.NotBlank;

/**
 * 보고서 상태 업데이트 요청을 위한 DTO
 */
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StatusUpdateRequest {
    @NotBlank(message = "상태는 필수 항목입니다")
    private String status;                 // 변경할 상태 (new, in_progress, resolved, rejected)
    
    private String comment;                // 상태 변경 관련 코멘트 (선택)
}
