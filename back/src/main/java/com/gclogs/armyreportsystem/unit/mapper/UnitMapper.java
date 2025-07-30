package com.gclogs.armyreportsystem.unit.mapper;

import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface UnitMapper {
    void findUnitIdByUnitName(String unitName);
    Long findUnitNameByUnitId(Long unitId);
    void getAllUnits();
    void createUnit(Long unitId, String unitName);
    void updateUnit(Long unitId, String unitName);
    void deleteUnit(Long unitId);
}
