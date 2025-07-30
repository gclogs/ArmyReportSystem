package com.gclogs.armyreportsystem.auth.service;

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
                .accessTokenExpiresIn(86400L) // 1일
                .refreshTokenExpiresIn(604800L) // 7일
                .tokenType("Bearer")
                .success(true)
                .message("토큰이 성공적으로 생성되었습니다.")
                .build();
    }

    @Transactional
    public TokenResponse refreshAccessToken(String refreshToken) {
        try {
            if (!jwtTokenProvider.validateToken(refreshToken)) {
                return TokenResponse.builder()
                        .userId("error")
                        .accessToken("")
                        .refreshToken("")
                        .tokenType("")
                        .success(false)
                        .message("유효하지 않은 리프레시 토큰입니다.")
                        .build();
            }

            String userId = jwtTokenProvider.getClaimsFromToken(refreshToken).get("userId", String.class);
            String newAccessToken = jwtTokenProvider.createAccessToken(userId);

            return TokenResponse.builder()
                    .userId(userId)
                    .accessToken(newAccessToken)
                    .tokenType("Bearer")
                    .accessTokenExpiresIn(86400L) // 1일
                    .success(true)
                    .message("액세스 토큰이 갱신되었습니다.")
                    .build();
        } catch (Exception e) {
            return TokenResponse.builder()
                    .success(false)
                    .message("토큰 갱신 중 오류가 발생했습니다: " + e.getMessage())
                    .build();
        }
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