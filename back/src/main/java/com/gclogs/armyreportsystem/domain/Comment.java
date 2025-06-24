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
    private Long comment_id;
    private Long report_id;        // 댓글이 달린 보고서 ID
    private String author_id;      // 작성자 ID
    private String author_name;    // 작성자 이름
    private String author_rank;
    private String content;       // 댓글 내용
    private LocalDateTime created_at;
    private LocalDateTime updated_at;
    private boolean is_deleted;
    private LocalDateTime deleted_at;
}