package com.gclogs.armyreportsystem.service;

import com.gclogs.armyreportsystem.domain.User;
import com.gclogs.armyreportsystem.dto.LoginRequest;
import com.gclogs.armyreportsystem.dto.LoginResponse;
import com.gclogs.armyreportsystem.dto.RegisterRequest;
import com.gclogs.armyreportsystem.dto.RegisterResponse;
import com.gclogs.armyreportsystem.dto.UserInfoResponse;
import com.gclogs.armyreportsystem.exception.UserNotFoundException;
import com.gclogs.armyreportsystem.mapper.UserMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;

    @Transactional
    public RegisterResponse register(RegisterRequest request) {
        // 필수 필드 검증
        if (!StringUtils.hasText(request.getUserId()) || 
            !StringUtils.hasText(request.getPassword()) || 
            !StringUtils.hasText(request.getName()) || 
            !StringUtils.hasText(request.getRank()) ||
            !StringUtils.hasText(request.getUnitName())) {
            return RegisterResponse.builder()
                    .success(false)
                    .message("필수 정보가 누락되었습니다.")
                    .build();
        }
        
        // 중복 검사
        if (userMapper.existsByUserId(request.getUserId())) {
            return RegisterResponse.builder()
                    .success(false)
                    .message("이미 존재하는 사용자입니다.")
                    .build();
        }

        // 사용자 생성
        User user = User.builder()
                .userId(request.getUserId())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(request.getRank())
                .name(request.getName())
                .unitName(request.getUnitName())
                .phoneNumber(request.getPhoneNumber())
                .email(request.getEmail())
                .createdIP(request.getCreatedIP())
                .currentIP(request.getCurrentIP())
                .createdAt(request.getCreatedAt())
                .status(false) // 기본값은 비활성화 상태 (승인 필요)
                .build();

        userMapper.insert(user);

        return RegisterResponse.builder()
                .success(true)
                .userId(user.getUserId())
                .name(user.getName())
                .rank(user.getRole())
                .message("회원가입이 완료되었습니다. 관리자 승인 후 로그인이 가능합니다.")
                .build();
    }

    // 로그인 서비스 추가
    @Transactional
    public LoginResponse login(LoginRequest request, String clientIp) {
        // findByUserId로 사용자 조회
        User user = userMapper.findByUserId(request.getUserId());

        // 사용자가 존재하지 않는 경우
        if (user == null) {
            return LoginResponse.builder()
                    .success(false)
                    .message("존재하지 않는 사용자입니다.")
                    .build();
        }

        // 비밀번호 검증
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            return LoginResponse.builder()
                    .success(false)
                    .message("비밀번호가 일치하지 않습니다.")
                    .build();
        }

        // 로그인 성공 시 현재 IP 업데이트
        userMapper.updateCurrentIP(user.getUserId(), "127.0.0.1");

        return LoginResponse.builder()
                .success(true)
                .userId(user.getUserId())
                .username(user.getName())
                .role(user.getRole())
                .message("로그인에 성공하였습니다.")
                .build();
    }

    // 사용자 정보 조회 서비스
    @Transactional(readOnly = true)
    public UserInfoResponse getUserInfo(String userId) {
        User user = userMapper.findByUserId(userId);
        
        if (user == null) {
            throw new UserNotFoundException("사용자를 찾을 수 없습니다: " + userId);
        }
        
        return UserInfoResponse.builder()
                .success(true)
                .userId(user.getUserId())
                .name(user.getName())
                .rank(user.getRole())
                .email(user.getEmail())
                .createdAt(user.getCreatedAt())
                .message("사용자 정보 조회 성공")
                .build();
    }
}