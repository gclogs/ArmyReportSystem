package com.gclogs.armyreportsystem.dto;

import lombok.*;

import jakarta.validation.constraints.NotBlank;
import java.util.List;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReportRequest {
    @NotBlank(message = "보고서 유형은 필수 항목입니다")
    private String type;

    @NotBlank(message = "제목은 필수 항목입니다")
    private String title;

    @NotBlank(message = "내용은 필수 항목입니다")
    private String content;

    @NotBlank(message = "우선순위는 필수 항목입니다")
    private String priority;

    private List<String> reportFileInputIds;

}
