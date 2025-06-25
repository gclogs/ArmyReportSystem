package com.gclogs.armyreportsystem.report.dto;

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
    private Long comment_id;
    private Long report_id;
    private String author_id;
    private String author_name;
    private String author_rank;
    private String content;
    private LocalDateTime created_at;
    private LocalDateTime updated_at;
    private boolean is_deleted;
    private LocalDateTime deleted_at;
}
