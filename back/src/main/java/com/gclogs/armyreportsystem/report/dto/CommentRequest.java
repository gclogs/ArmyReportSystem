package com.gclogs.armyreportsystem.report.dto;

import lombok.*;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

/**
 * 댓글 생성 요청을 위한 DTO
 */
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CommentRequest {
    @NotNull(message = "보고서 ID는 필수 항목입니다")
    private Long report_id;               // 보고서 ID
    
    @NotBlank(message = "댓글 내용은 필수 항목입니다")
    private String content;                // 댓글 내용
}
