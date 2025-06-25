package com.gclogs.armyreportsystem.auth.security.jwt;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jws;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.security.Keys;
import io.jsonwebtoken.UnsupportedJwtException;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.Base64;
import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;

@Component
public class JwtTokenProvider {
    private final Set<String> blacklist = new HashSet<>();
    
    @Value("${jwt.secret}")
    private String secretKey;
    
    @Value("${jwt.token-validity-in-seconds:86400}")
    private long tokenValidityInSeconds;

    /**
     * 토큰 검증 결과를 나타내는 열거형
     */
    public enum TokenValidationResult {
        VALID("유효한 토큰"),
        EXPIRED("만료된 토큰"),
        MALFORMED("잘못된 형식의 토큰"),
        UNSUPPORTED("지원되지 않는 토큰"),
        INVALID_SIGNATURE("유효하지 않은 서명"),
        EMPTY("토큰이 비어있음"),
        UNKNOWN_ERROR("알 수 없는 오류");

        private final String message;

        TokenValidationResult(String message) {
            this.message = message;
        }

        public String getMessage() {
            return message;
        }
    }

    // 마지막으로 검증한 토큰의 상태를 저장
    private TokenValidationResult lastValidationResult = TokenValidationResult.UNKNOWN_ERROR;

    public JwtTokenProvider(@Value("${jwt.secret}") String secretKey) {
        this.secretKey = Base64.getEncoder().encodeToString(secretKey.getBytes());
    }

    public String createAccessToken(String userId) {
        Date now = new Date();
        Date accessExpiryDate = new Date(now.getTime() + tokenValidityInSeconds * 1000);

        return Jwts.builder()
                .setSubject(String.valueOf(userId))
                .setIssuedAt(now)
                .signWith(Keys.hmacShaKeyFor(secretKey.getBytes()))
                .claim("user_id", userId)
                .setExpiration(accessExpiryDate)
                .compact();
    }

    // JWT 토큰 생성
    public String createRefreshToken(String userId) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + tokenValidityInSeconds * 1000);
        
        return Jwts.builder()
                .claim("user_id", userId)
                .setIssuedAt(now)
                .setExpiration(expiryDate)
                .signWith(Keys.hmacShaKeyFor(secretKey.getBytes()))
                .compact();
    }

    // 토큰에서 사용자 ID 추출
    public Claims getClaimsFromToken(String token) {
        return Jwts.parser()
                .setSigningKey(Keys.hmacShaKeyFor(secretKey.getBytes()))
                .build()
                .parseClaimsJws(token)
                .getBody();
    }
    
    // Request의 Header에서 token 값 가져오기
    public String resolveToken(HttpServletRequest request) {
        String header = request.getHeader("Authorization");
        if (header != null && header.startsWith("Bearer ")) {
            return header.substring(7);
        }
        return null;
    }
    
    // 토큰의 유효성 + 만료일 체크
    public boolean validateToken(String jwtToken) {
        if (jwtToken == null || jwtToken.trim().isEmpty()) {
            lastValidationResult = TokenValidationResult.EMPTY;
            return false;
        }

        try {
            Jws<Claims> claims = Jwts.parser()
                    .setSigningKey(Keys.hmacShaKeyFor(secretKey.getBytes()))
                    .build()
                    .parseClaimsJws(jwtToken);

            boolean isValid = !claims.getBody().getExpiration().before(new Date());
            lastValidationResult = isValid ? TokenValidationResult.VALID : TokenValidationResult.EXPIRED;
            return isValid;
        } catch (ExpiredJwtException e) {
            lastValidationResult = TokenValidationResult.EXPIRED;
            System.out.println("만료된 JWT 토큰: " + e.getMessage());
            return false;
        } catch (io.jsonwebtoken.security.SecurityException | MalformedJwtException e) {
            lastValidationResult = TokenValidationResult.INVALID_SIGNATURE;
            System.out.println("잘못된 JWT 서명: " + e.getMessage());
            return false;
        } catch (UnsupportedJwtException e) {
            lastValidationResult = TokenValidationResult.UNSUPPORTED;
            System.out.println("지원되지 않는 JWT 토큰: " + e.getMessage());
            return false;
        } catch (IllegalArgumentException e) {
            lastValidationResult = TokenValidationResult.EMPTY;
            System.out.println("JWT 토큰이 비어있음: " + e.getMessage());
            return false;
        } catch (Exception e) {
            lastValidationResult = TokenValidationResult.UNKNOWN_ERROR;
            System.out.println("JWT 토큰 검증 중 예외 발생: " + e.getMessage());
            return false;
        }
    }

    /**
     * 가장 최근에 검증한 토큰의 상세 결과를 반환
     * @return 토큰 검증 결과와 메시지
     */
    public Map<String, String> getTokenValidationDetails() {
        Map<String, String> details = new HashMap<>();
        details.put("result", lastValidationResult.name());
        details.put("message", lastValidationResult.getMessage());
        details.put("isValid", String.valueOf(lastValidationResult == TokenValidationResult.VALID));
        return details;
    }

    public boolean isBlacklistToken(String token) {
        return blacklist.contains(token);
    }
}
