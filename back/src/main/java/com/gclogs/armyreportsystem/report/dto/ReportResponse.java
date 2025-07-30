package com.gclogs.armyreportsystem.report.dto;

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
    private boolean success;               
    private String message;                
    
    private Long reportId;                     
    
    // 보고서 기본 정보
    private String type;                   
    private String title;                  
    private String content;                
    private String priority;               
    private String status;                 
    private boolean isDeleted;

    // 시간 정보
    private LocalDateTime createdAt;       
    private LocalDateTime updatedAt;       
    private LocalDateTime deletedAt;
    
    // 작성자 정보
    private String authorId;               
    private String authorName;             
    private String authorRank;

    // 첨부 파일 및 댓글
    private List<FileAttachmentResponse> fileAttachments; 
    private List<CommentResponse> comments;       

    // 내부 클래스 - 첨부 파일 응답
    @Getter
    @Setter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class FileAttachmentResponse {
        private String id;                 
        private String fileUrl;            
        private String fileName;           
        private String fileType;           
        private LocalDateTime created_at;   
    }
    
    // 내부 클래스 - 댓글 응답
    @Getter
    @Setter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CommentResponse {
        private String id;                 
        private String authorId;           
        private String authorName;         
        private String content;            
        private LocalDateTime createdAt;   
    }
}
