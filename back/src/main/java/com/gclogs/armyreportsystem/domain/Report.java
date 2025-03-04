package com.gclogs.armyreportsystem.domain;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Report {
    private String authorId;
    private String authorName;
    private String authorRank;

    private Long reportId;
    private String type;
    private String title;
    private String content;
    private String priority;
    private String status;
    private boolean is_deleted;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime deletedAt;
}
