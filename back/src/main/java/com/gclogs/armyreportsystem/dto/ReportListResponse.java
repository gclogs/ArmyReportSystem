package com.gclogs.armyreportsystem.dto;

import lombok.*;

import java.util.List;

/**
 * 보고서 목록 조회 응답을 위한 DTO
 */
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReportListResponse {
    private boolean success;               // 요청 성공 여부
    private String message;                // 응답 메시지
    private int totalCount;                // 전체 보고서 수
    private int pageCount;                 // 현재 페이지 보고서 수
    private int currentPage;               // 현재 페이지 번호
    private int totalPages;                // 전체 페이지 수
    private List<ReportSummary> reports;   // 보고서 요약 목록
    
    /**
     * 보고서 목록에서 사용할 요약 정보
     */
    @Getter
    @Setter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ReportSummary {
        private String id;                 // 보고서 고유 ID
        private String type;               // 보고서 유형
        private String title;              // 제목
        private String content;            // 내용 (일부만 표시)
        private String priority;           // 우선순위
        private String status;             // 상태
        private String authorName;         // 작성자 이름
        private String createdAt;          // 생성 시간 (문자열 형식)
        private int attachmentCount;       // 첨부 파일 수
        private int commentCount;          // 댓글 수
    }
}
