package com.gclogs.armyreportsystem.unit.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UnitRequest {
    @NotNull(message = "부대코드는 필수 항목입니다")
    private Long unitId;

    @NotBlank(message = "부대명은 필수 항목입니다")
    private String unitName;
}
