package com.gclogs.armyreportsystem.domain;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Comment {
    private Long commentId;
    private Long reportId;        // 댓글이 달린 보고서 ID
    private String authorId;      // 작성자 ID
    private String authorName;    // 작성자 이름
    private String content;       // 댓글 내용
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private boolean is_deleted;
    private LocalDateTime deletedAt;
}