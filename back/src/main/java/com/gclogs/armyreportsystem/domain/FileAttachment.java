package com.gclogs.armyreportsystem.domain;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FileAttachment {
    private String attachment_id;
    private String report_id;
    private String file_name;    // 원본 파일명
    private String stored_path; // 저장된 경로
    private String file_type;   // 파일 타입
    private Long file_size;     // 파일 크기
    private LocalDateTime uploaded_at; // 업로드 시간
}
