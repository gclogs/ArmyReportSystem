package com.gclogs.armyreportsystem.security.jwt;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class TokenService {
    private final TokenMapper tokenMapper;
    private final JwtTokenProvider jwtTokenProvider;

    @Transactional
    public TokenResponse createTokens(String userId) {
        String accessToken = jwtTokenProvider.createAccessToken(userId);
        String refreshToken = jwtTokenProvider.createRefreshToken(userId);
        tokenMapper.saveRefreshToken(userId, refreshToken);

        return TokenResponse.builder()
                .userId(userId)
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .tokenType("Bearer")
                .accessTokenExpiresIn(86400L)
                .refreshTokenExpiresIn(604800L)
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

            String userId = jwtTokenProvider.getUserIdFromToken(refreshToken).get("userId", String.class);
            String newAccessToken = jwtTokenProvider.createAccessToken(userId);

            return TokenResponse.builder()
                    .userId(userId)
                    .accessToken(newAccessToken)
                    .refreshToken(refreshToken) // 기존 리프레시 토큰 유지
                    .tokenType("Bearer")
                    .accessTokenExpiresIn(86400L)
                    .refreshTokenExpiresIn(604800L)
                    .success(true)
                    .message("액세스 토큰이 성공적으로 갱신되었습니다.")
                    .build();
        } catch (Exception e) {
            return TokenResponse.builder()
                    .userId("error")
                    .accessToken("")
                    .refreshToken("")
                    .tokenType("")
                    .success(false)
                    .message("토큰 갱신 실패: " + e.getMessage())
                    .build();
        }
    }

    @Transactional
    public void revokeRefreshToken(String userId) {
        tokenMapper.deleteRefreshToken(userId);
    }
}