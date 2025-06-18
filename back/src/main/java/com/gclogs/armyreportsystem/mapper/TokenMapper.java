package com.gclogs.armyreportsystem.mapper;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface TokenMapper {
    void saveRefreshToken(@Param("user_id") String userId, @Param("refresh_token") String refreshToken);

    void deleteRefreshToken(@Param("user_id") String userId);
    
    String findUserIdByRefreshToken(@Param("refresh_token") String refreshToken);
}
