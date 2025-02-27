package com.gclogs.armyreportsystem;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.gclogs.armyreportsystem.dto.RegisterRequest;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest(classes = ArmyReportSystemApplication.class)
@AutoConfigureMockMvc
public class RegisterControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    @DisplayName("회원가입 성공 테스트")
    void register_success() throws Exception {
        // given
        RegisterRequest request = new RegisterRequest();
        request.setUserId("testuser123");
        request.setPassword("Password123!");
        request.setRank("일병");
        request.setName("홍길동");
        request.setUnitName("27사단77연대수송대대");
        request.setPhoneNumber("010-1234-5678");
        request.setEmail("test@army.mil.kr");
        request.setCreatedIP("127.0.0.1");
        request.setCurrentIP("127.0.0.1");
        request.setCreatedAt(LocalDateTime.now());
        request.setStatus(false);

        String requestJson = objectMapper.writeValueAsString(request);

        // when & then
        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(requestJson))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.userId").value("testuser123"))
                .andExpect(jsonPath("$.name").value("홍길동"))
                .andExpect(jsonPath("$.rank").value("일병"))
                .andExpect(jsonPath("$.message").exists());
    }

    @Test
    @DisplayName("회원가입 실패 - 필수 정보 누락")
    void register_fail_missing_required_fields() throws Exception {
        // given
        RegisterRequest request = new RegisterRequest();
        request.setUserId(""); // 빈 문자열로 설정
        request.setPassword("Password123!");
        request.setRank("일병");
        // name 필드 누락
        
        String requestJson = objectMapper.writeValueAsString(request);

        // when & then
        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(requestJson))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.message").exists());
    }

    @Test
    @DisplayName("회원가입 실패 - 중복된 사용자")
    void register_fail_duplicate_user() throws Exception {
        // given
        RegisterRequest request = new RegisterRequest();
        request.setUserId("existinguser"); // 이미 존재하는 사용자 ID
        request.setPassword("Password123!");
        request.setRank("일병");
        request.setName("홍길동");
        request.setUnitName("12345");
        request.setPhoneNumber("010-1234-5678");
        request.setEmail("existing@army.mil.kr");
        
        String requestJson = objectMapper.writeValueAsString(request);

        // 첫 번째 요청 (성공)
        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(requestJson))
                .andExpect(status().isOk());

        // 두 번째 요청 (실패 - 중복)
        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(requestJson))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.message").value("이미 존재하는 사용자입니다."));
    }
}
