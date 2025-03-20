package com.gclogs.armyreportsystem.domain;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FileAttachment {
    private String attachmentId;
    private String reportId;
    private String fileName;    // 원본 파일명
    private String storedPath; // 저장된 경로
    private String fileType;   // 파일 타입
    private Long fileSize;     // 파일 크기
    private LocalDateTime uploadedAt; // 업로드 시간
}
