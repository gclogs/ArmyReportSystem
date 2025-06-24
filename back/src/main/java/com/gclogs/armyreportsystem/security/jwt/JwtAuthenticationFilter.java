package com.gclogs.armyreportsystem.security.jwt;

import io.jsonwebtoken.Claims;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.core.annotation.Order;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Order(1) // 필터 실행 우선순위 지정 (낮은 숫자가 높은 우선순위)
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtTokenProvider jwtTokenProvider;

    public JwtAuthenticationFilter(JwtTokenProvider jwtTokenProvider) {
        this.jwtTokenProvider = jwtTokenProvider;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
            throws ServletException, IOException {

        String token = jwtTokenProvider.resolveToken(request);

        if (token != null) {
            if (jwtTokenProvider.isBlacklistToken(token)) {
                throw new RuntimeException("블랙리스트에 등록된 토큰입니다.");
            }
            
            if (jwtTokenProvider.validateToken(token)) {
                // Claims에서 user_id를 문자열로 추출
                Claims claims = jwtTokenProvider.getClaimsFromToken(token);
                String userId = claims.get("user_id", String.class);
                
                // 사용자 ID를 principal로 설정
                UsernamePasswordAuthenticationToken authentication = 
                    new UsernamePasswordAuthenticationToken(userId, null, null);
                
                // SecurityContext에 Authentication 객체 저장
                SecurityContextHolder.getContext().setAuthentication(authentication);
                
                // 요청 속성에 user_id 설정 (컨트롤러에서 @RequestAttribute로 접근 가능)
                request.setAttribute("user_id", userId);
            }
        }
        
        chain.doFilter(request, response);
    }
    
    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        String path = request.getRequestURI();
        String method = request.getMethod();
        
        // OPTIONS 메서드는 preflight 요청이므로 필터링하지 않음
        // /api/auth/와 /api/public/로 시작하는 경로도 필터링하지 않음
        return "OPTIONS".equals(method) || 
               path.startsWith("/api/auth/") || 
               path.startsWith("/api/public/");
    }
}
