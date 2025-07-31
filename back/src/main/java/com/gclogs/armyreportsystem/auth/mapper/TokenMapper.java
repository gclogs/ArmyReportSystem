package com.gclogs.armyreportsystem.auth.mapper;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface TokenMapper {
    void saveRefreshToken(String userId, String refreshToken);
    void deleteRefreshToken(String userId);
    String updateLastUsedAtByUserId(String userId);
    String findUserIdByRefreshToken(String refreshToken);
}
