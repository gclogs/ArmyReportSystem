package com.gclogs.armyreportsystem.dto;

import lombok.*;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.util.List;

/**
 * 보고서 생성 및 수정 요청을 위한 DTO
 */
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReportRequest {
    @NotBlank(message = "보고서 유형은 필수 항목입니다")
    private String type;                   // 보고서 유형 (normal, emergency, maintenance, incident)

    @NotBlank(message = "제목은 필수 항목입니다")
    private String title;                  // 제목

    @NotBlank(message = "내용은 필수 항목입니다")
    private String content;                // 내용

    @NotBlank(message = "우선순위는 필수 항목입니다")
    private String priority;               // 우선순위 (low, medium, high, urgent)

    private List<String> reportFileInputIds;    // 첨부 파일 ID 목록 (선택)

}
