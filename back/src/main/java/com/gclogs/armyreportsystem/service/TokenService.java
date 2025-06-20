package com.gclogs.armyreportsystem.service;

import com.gclogs.armyreportsystem.domain.User;
import com.gclogs.armyreportsystem.dto.TokenResponse;
import com.gclogs.armyreportsystem.mapper.UserMapper;
import com.gclogs.armyreportsystem.security.jwt.JwtTokenProvider;
import com.gclogs.armyreportsystem.mapper.TokenMapper;
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
                .user_id(userId)
                .name(user.getName())
                .rank(user.getRank())
                .unit_name(user.getUnit_name())
                .access_token(accessToken)
                .refresh_token(refreshToken)
                .token_type("Bearer")
                .access_token_expires_in(86400L)
                .refresh_token_expires_in(604800L)
                .success(true)
                .message("토큰이 성공적으로 생성되었습니다.")
                .build();
    }

    @Transactional
    public TokenResponse refreshAccessToken(String refreshToken) {
        try {
            if (!jwtTokenProvider.validateToken(refreshToken)) {
                return TokenResponse.builder()
                        .user_id("error")
                        .access_token("")
                        .refresh_token("")
                        .token_type("")
                        .success(false)
                        .message("유효하지 않은 리프레시 토큰입니다.")
                        .build();
            }

            String userId = jwtTokenProvider.getUserIdFromToken(refreshToken).get("user_id", String.class);
            String newAccessToken = jwtTokenProvider.createAccessToken(userId);

            return TokenResponse.builder()
                    .user_id(userId)
                    .access_token(newAccessToken)
                    .token_type("Bearer")
                    .access_token_expires_in(86400L) // 1일
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

    @Transactional(readOnly = true)
    public TokenResponse createAccessTokenOnly(String userId) {
        String accessToken = jwtTokenProvider.createAccessToken(userId);
        
        return TokenResponse.builder()
                .user_id(userId)
                .access_token(accessToken)
                .token_type("Bearer")
                .access_token_expires_in(86400L) // 1일
                .success(true)
                .message("액세스 토큰이 생성되었습니다.")
                .build();
    }

    @Transactional
    public void revokeRefreshToken(String userId) {
        tokenMapper.deleteRefreshToken(userId);
    }
}