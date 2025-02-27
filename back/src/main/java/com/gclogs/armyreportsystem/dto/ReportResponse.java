package com.gclogs.armyreportsystem.dto;

import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

/**
 * 보고서 조회 응답을 위한 DTO
 */
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReportResponse {
    private boolean success;               // 요청 성공 여부
    private String message;                // 응답 메시지
    
    private String id;                     // 보고서 고유 ID
    
    // 보고서 기본 정보
    private String type;                   // 보고서 유형 (normal, emergency, maintenance, incident)
    private String title;                  // 제목
    private String content;                // 내용
    private String priority;               // 우선순위 (low, medium, high, urgent)
    private String status;                 // 상태 (new, in_progress, resolved, rejected)
    
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
    private LocationResponse location;     // 위치 정보 (선택)
    
    // 첨부 파일 및 댓글
    private List<AttachmentResponse> attachments; // 첨부 파일 목록
    private List<CommentResponse> comments;       // 댓글 목록
    
    // 내부 클래스 - 위치 정보 응답
    @Getter
    @Setter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class LocationResponse {
        private Double latitude;           // 위도
        private Double longitude;          // 경도
        private String description;        // 위치 설명
    }
    
    // 내부 클래스 - 첨부 파일 응답
    @Getter
    @Setter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AttachmentResponse {
        private String id;                 // 첨부 파일 ID
        private String fileUrl;            // 파일 URL
        private String fileName;           // 파일 이름
        private String fileType;           // 파일 타입
        private LocalDateTime createdAt;   // 생성 시간
    }
    
    // 내부 클래스 - 댓글 응답
    @Getter
    @Setter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CommentResponse {
        private String id;                 // 댓글 ID
        private String authorId;           // 작성자 ID
        private String authorName;         // 작성자 이름
        private String content;            // 댓글 내용
        private LocalDateTime createdAt;   // 생성 시간
    }
}
