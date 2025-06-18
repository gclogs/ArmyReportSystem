package com.gclogs.armyreportsystem.domain;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Report {
    private String author_id;
    private String author_name;
    private String author_rank;

    private Long report_id;
    private String type;
    private String title;
    private String content;
    private String priority;
    private String status;
    private boolean is_deleted;
    private LocalDateTime created_at;
    private LocalDateTime updated_at;
    private LocalDateTime deleted_at;
}
