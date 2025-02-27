package com.gclogs.armyreportsystem.dto;

import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReportDTO {
    private String id;                     // 보고서 고유 ID
    
    // 보고서 기본 정보
    private String type;                   // 보고서 유형 (normal, emergency, maintenance, incident)
    private String title;                  // 제목
    private String content;                // 내용
    private String priority;               // 우선순위 (low, medium, high, urgent)
    private String status = "new";         // 상태 (new, in_progress, resolved, rejected)
    
    // 시간 정보
    private LocalDateTime createdAt;       // 생성 시간
    private LocalDateTime updatedAt;       // 최종 수정 시간
    private LocalDateTime resolvedAt;      // 해결 시간
    
    // 작성자 정보
    private String authorId;               // 작성자 군번
    private String authorName;             // 작성자 이름
    
    // 담당자 정보
    private String assigneeId;             // 담당자 군번
    private String assigneeName;           // 담당자 이름
    
    // 위치 정보
    private LocationDTO location;          // 위치 정보 (선택)
    
    // 첨부 파일 및 댓글
    private List<AttachmentDTO> attachments; // 첨부 파일 목록
    private List<CommentDTO> comments;     // 댓글 목록
    
    // 내부 클래스 - 위치 정보
    @Getter
    @Setter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class LocationDTO {
        private Double latitude;           // 위도
        private Double longitude;          // 경도
        private String description;        // 위치 설명
    }
    
    // 내부 클래스 - 첨부 파일
    @Getter
    @Setter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AttachmentDTO {
        private String id;                 // 첨부 파일 ID
        private String reportId;           // 보고서 ID
        private String fileUrl;            // 파일 URL
        private String fileName;           // 파일 이름
        private String fileType;           // 파일 타입
        private LocalDateTime createdAt;   // 생성 시간
    }
    
    // 내부 클래스 - 댓글
    @Getter
    @Setter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CommentDTO {
        private String id;                 // 댓글 ID
        private String reportId;           // 보고서 ID
        private String authorId;           // 작성자 ID
        private String authorName;         // 작성자 이름
        private String content;            // 댓글 내용
        private LocalDateTime createdAt;   // 생성 시간
    }
}