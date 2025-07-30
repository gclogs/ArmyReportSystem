package com.gclogs.armyreportsystem.unit.dto;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UnitResponse {
    private Long unitId;
    private String unitName;
    private Long unitRole;
    private LocalDateTime createdAt;
    private LocalDateTime deletedAt;
    private boolean isDeleted;
}
