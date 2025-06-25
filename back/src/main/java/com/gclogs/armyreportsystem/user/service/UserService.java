package com.gclogs.armyreportsystem.user.service;

import com.gclogs.armyreportsystem.auth.dto.LoginRequest;
import com.gclogs.armyreportsystem.auth.dto.LoginResponse;
import com.gclogs.armyreportsystem.auth.dto.RegisterRequest;
import com.gclogs.armyreportsystem.auth.dto.RegisterResponse;
import com.gclogs.armyreportsystem.user.domain.User;
import com.gclogs.armyreportsystem.user.dto.UserInfoResponse;
import com.gclogs.armyreportsystem.user.exception.UserNotFoundException;
import com.gclogs.armyreportsystem.user.mapper.UserMapper;

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
        if (!StringUtils.hasText(request.getUser_id()) || 
            !StringUtils.hasText(request.getPassword()) || 
            !StringUtils.hasText(request.getName()) || 
            !StringUtils.hasText(request.getRank()) ||
            !StringUtils.hasText(request.getUnit_name())) {
            return RegisterResponse.builder()
                    .success(false)
                    .message("필수 정보가 누락되었습니다.")
                    .build();
        }
        
        // 중복 검사
        if (userMapper.existsByUserId(request.getUser_id())) {
            return RegisterResponse.builder()
                    .success(false)
                    .message("이미 존재하는 사용자입니다.")
                    .build();
        }

        // 사용자 생성
        User user = User.builder()
                .user_id(request.getUser_id())
                .password(passwordEncoder.encode(request.getPassword()))
                .rank(request.getRank())
                .role(request.getRole()) // 기본값은 솔져임 (승인 절차 거쳐 권한 얻음)
                .name(request.getName())
                .unit_name(request.getUnit_name())
                .phone_number(request.getPhone_number())
                .email(request.getEmail())
                .created_at(request.getCreated_at())
                .status(false) // 기본값은 0 (로그인시 1로 변경)
                .build();

        userMapper.insert(user);

        return RegisterResponse.builder()
                .success(true)
                .user_id(user.getUser_id())
                .name(user.getName())
                .rank(user.getRank())
                .role(user.getRole())
                .message("회원가입이 완료되었습니다. 장교는 관리자 승인 절차를 거쳐 권한을 얻으시길 바랍니다.")
                .build();
    }

    // 로그인 서비스 추가
    @Transactional
    public LoginResponse login(LoginRequest request) {
        // findByUserId로 사용자 조회
        User user = userMapper.findByUserId(request.getUser_id());

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

        return LoginResponse.builder()
                .success(true)
                .message("로그인에 성공하였습니다.")
                .user(user)
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
                .user_id(user.getUser_id())
                .name(user.getName())
                .rank(user.getRank())
                .email(user.getEmail())
                .created_at(user.getCreated_at())
                .message("사용자 정보 조회 성공")
                .build();
    }
}