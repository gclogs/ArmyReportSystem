package com.gclogs.armyreportsystem.unit.domain;

import lombok.*;

import java.time.LocalDateTime;

@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Unit {
    private Long unitId;
    private String unitName;
    private Long unitRole;
    private LocalDateTime createdAt;
    private LocalDateTime deletedAt;
    private boolean isDeleted;
}
