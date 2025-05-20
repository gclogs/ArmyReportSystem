package com.gclogs.armyreportsystem.security.jwt;

import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface TokenMapper {
    void saveRefreshToken(String userId, String refreshToken);

    void deleteRefreshToken(String userId);
    String findUserIdByRefreshToken(String refreshToken);

}
