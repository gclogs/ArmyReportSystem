package com.gclogs.armyreportsystem.service;

import com.gclogs.armyreportsystem.domain.User;
import com.gclogs.armyreportsystem.dto.LoginRequest;
import com.gclogs.armyreportsystem.dto.LoginResponse;
import com.gclogs.armyreportsystem.dto.RegisterRequest;
import com.gclogs.armyreportsystem.dto.RegisterResponse;
import com.gclogs.armyreportsystem.mapper.UserMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;

    @Transactional
    public RegisterResponse register(RegisterRequest request) {
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
                .role(request.getRole())
                .name(request.getName())
                .email(request.getEmail())
                .createdIP("127.0.0.1")
                .currentIP("127.0.0.1")
                .status(false) // 활성 상태
                .build();

        userMapper.insert(user);

        return RegisterResponse.builder()
                .success(true)
                .userId(user.getUserId())
                .name(user.getName())
                .role(user.getRole())
                .createdAt(user.getCreateDate())
                .message("회원가입이 완료되었습니다.")
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
}