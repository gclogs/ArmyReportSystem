package com.gclogs.armyreportsystem.auth.service;

import com.gclogs.armyreportsystem.auth.domain.Token;
import com.gclogs.armyreportsystem.auth.dto.TokenResponse;
import com.gclogs.armyreportsystem.auth.mapper.TokenMapper;
import com.gclogs.armyreportsystem.auth.security.jwt.JwtTokenProvider;
import com.gclogs.armyreportsystem.user.domain.User;
import com.gclogs.armyreportsystem.user.mapper.UserMapper;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class TokenService {
    private final TokenMapper tokenMapper;
    private final JwtTokenProvider jwtTokenProvider;

    private final UserMapper userMapper;

    @Transactional
    public TokenResponse createTokens(String userId) {
        User user = userMapper.findByUserId(userId);

        if (user == null) {
            return TokenResponse.builder()
                    .success(false)
                    .message("사용자 정보를 찾을 수 없습니다.")
                    .build();
        }

        String accessToken = jwtTokenProvider.createAccessToken(userId);
        String refreshToken = jwtTokenProvider.createRefreshToken(userId);
        tokenMapper.saveRefreshToken(userId, refreshToken);

        return TokenResponse.builder()
                .userId(userId)
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .role(user.getRole())
                .phoneNumber(user.getPhoneNumber())
                .unitName(user.getUnitName())
                .name(user.getName())
                .rank(user.getRank())
                .email(user.getEmail())
                .createdAt(user.getCreatedAt())
                .accessTokenExpiresIn(1800L) // 30분 (실제 설정값과 일치)
                .refreshTokenExpiresIn(604800L) // 7일
                .tokenType("Bearer")
                .success(true)
                .message("토큰이 성공적으로 생성되었습니다.")
                .build();
    }

    @Transactional
    public TokenResponse refreshAccessToken(String refreshToken) {
        String userId = tokenMapper.findUserIdByRefreshToken(refreshToken);

        if(userId == null) {
            return TokenResponse.builder()
                    .success(false)
                    .message("리프레시 토큰이 제공되지 않았습니다.")
                    .build();
        }

        String newAccessToken = jwtTokenProvider.createAccessToken(userId);

        return TokenResponse.builder()
                .userId(userId)
                .accessToken(newAccessToken)
                .accessTokenExpiresIn(1800L) // 30분 (실제 설정값과 일치)
                .tokenType("Bearer")
                .success(true)
                .message("토큰이 성공적으로 리프레시 되었습니다.")
                .build();
    }

    @Transactional
    public TokenResponse updateTokenLastUsed(String refreshToken) {
        // 1. refreshToken으로 userId 추출
        String userId = tokenMapper.findUserIdByRefreshToken(refreshToken);
        if(userId == null) {
            return TokenResponse.builder()
                    .success(false)
                    .message("리프레시 토큰이 제공되지 않았습니다.")
                    .build();
        }

        // 2. userId를 통해 해당 사용자의 토큰 사용 시간 업데이트
        tokenMapper.updateLastUsedAtByUserId(userId);

        return TokenResponse.builder()
                .success(true)
                .message("토큰 사용 시간을 업데이트 하었습니다.")
                .build();
    }

    @Transactional
    public String getUserIdFromToken(String token) {
        return jwtTokenProvider.getClaimsFromToken(token).get("userId", String.class);
    }

    @Transactional
    public void revokeRefreshToken(String userId) {
        tokenMapper.deleteRefreshToken(userId);
    }
}