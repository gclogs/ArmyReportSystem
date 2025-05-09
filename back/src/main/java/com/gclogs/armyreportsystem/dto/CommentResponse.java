package com.gclogs.armyreportsystem.dto;

import java.time.LocalDateTime;

import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CommentResponse {
    private boolean success;
    private String message;
    private Long commentId;
    private Long reportId;
    private String authorId;
    private String authorName;
    private String content;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private boolean is_deleted;
    private LocalDateTime deletedAt;
}
