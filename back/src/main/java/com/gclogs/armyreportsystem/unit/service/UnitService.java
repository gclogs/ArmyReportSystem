package com.gclogs.armyreportsystem.unit.service;

import com.gclogs.armyreportsystem.unit.mapper.UnitMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UnitService {

    private final UnitMapper unitMapper;

    @Transactional(readOnly = true)
    public Long getUnitNameByUnitId(Long unitId) {
        return unitMapper.findUnitNameByUnitId(unitId);
    }
}
