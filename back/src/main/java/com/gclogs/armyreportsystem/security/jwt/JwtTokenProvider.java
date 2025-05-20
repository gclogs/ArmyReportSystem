package com.gclogs.armyreportsystem.security.jwt;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jws;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.Base64;
import java.util.Date;
import java.util.HashSet;
import java.util.Set;

@Component
public class JwtTokenProvider {
    private final Set<String> blacklist = new HashSet<>();
    
    @Value("${jwt.secret}")
    private String secretKey;
    
    @Value("${jwt.token-validity-in-seconds:86400}")
    private long tokenValidityInSeconds;

    public JwtTokenProvider(@Value("${jwt.secret}") String secretKey) {
        this.secretKey = Base64.getEncoder().encodeToString(secretKey.getBytes());
    }

    public String createAccessToken(String userId) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + tokenValidityInSeconds * 1000);

        return Jwts.builder()
                .setSubject(String.valueOf(userId))
                .setIssuedAt(now)
                .signWith(Keys.hmacShaKeyFor(secretKey.getBytes()))
                .claim("userId", userId)
                .setExpiration(expiryDate)
                .compact();
    }

    // JWT 토큰 생성
    public String createRefreshToken(String userId) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + tokenValidityInSeconds * 1000);
        
        return Jwts.builder()
                .claim("userId", userId)
                .setIssuedAt(now)
                .setExpiration(expiryDate)
                .signWith(Keys.hmacShaKeyFor(secretKey.getBytes()))
                .compact();
    }
    
    public Claims getUserIdFromToken(String token) {
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
        try {
            Jws<Claims> claims = Jwts.parser()
                    .setSigningKey(Keys.hmacShaKeyFor(secretKey.getBytes()))
                    .build()
                    .parseClaimsJws(jwtToken);
            return !claims.getBody().getExpiration().before(new Date());
        } catch (Exception e) {
            return false;
        }
    }

    public boolean isBlacklistToken(String token) {
        return blacklist.contains(token);
    }
}
