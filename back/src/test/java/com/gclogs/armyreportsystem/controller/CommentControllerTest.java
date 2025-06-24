package com.gclogs.armyreportsystem.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.gclogs.armyreportsystem.dto.CommentRequest;
import com.gclogs.armyreportsystem.dto.CommentResponse;
import com.gclogs.armyreportsystem.service.CommentService;
import com.gclogs.armyreportsystem.service.TokenService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
public class CommentControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private CommentService commentService;

    @MockBean
    private TokenService tokenService;

    private CommentRequest commentRequest;
    private CommentResponse commentResponse;
    private final String TEST_TOKEN = "Bearer eyJhbGciOiJIUzM4NCJ9.eyJzdWIiOiJhZG1pbjEyMyIsImlhdCI6MTc1MDc1NDUxMiwidXNlcl9pZCI6ImFkbWluMTIzIiwiZXhwIjoxNzUwODQwOTEyfQ.MNbNzeWf4mKdH0M8Gf1adbrTHE6n6JrCnI_qDXISNSIv4XzTEMS1oaZPIUQUucFX";
    private final String TEST_USER_ID = "admin123";
    private final Long TEST_REPORT_ID = 1L;
    private final Long TEST_COMMENT_ID = 1L;

    @BeforeEach
    void setUp() {
        // 테스트용 요청 데이터 설정
        commentRequest = new CommentRequest();
        commentRequest.setContent("테스트 댓글 내용");

        // 테스트용 응답 데이터 설정
        commentResponse = CommentResponse.builder()
                .success(true)
                .comment_id(TEST_COMMENT_ID)
                .report_id(TEST_REPORT_ID)
                .author_id(TEST_USER_ID)
                .author_name("테스트 사용자")
                .content("테스트 댓글 내용")
                .created_at(LocalDateTime.now())
                .updated_at(LocalDateTime.now())
                .is_deleted(false)
                .build();
    }

    @Test
    @DisplayName("보고서에 대한 댓글 목록 조회 테스트")
    void getCommentsByReportIdTest() throws Exception {
        // given
        List<CommentResponse> commentList = Arrays.asList(commentResponse);
        when(commentService.getCommentsByReportId(TEST_REPORT_ID)).thenReturn(commentList);

        // when & then
        mockMvc.perform(get("/api/reports/{reportId}/comments", TEST_REPORT_ID)
                .header("Authorization", TEST_TOKEN))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].success").value(true))
                .andExpect(jsonPath("$[0].comment_id").value(TEST_COMMENT_ID))
                .andExpect(jsonPath("$[0].report_id").value(TEST_REPORT_ID));
    }

    @Test
    @DisplayName("새 댓글 생성 테스트")
    void createCommentTest() throws Exception {
        // given
        when(tokenService.getUserIdFromToken(anyString())).thenReturn(TEST_USER_ID);
        when(commentService.createComment(eq(TEST_REPORT_ID), eq(TEST_USER_ID), any(CommentRequest.class)))
                .thenReturn(commentResponse);

        // when & then
        mockMvc.perform(post("/api/reports/{reportId}/comments", TEST_REPORT_ID)
                .header("Authorization", TEST_TOKEN)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(commentRequest)))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.comment_id").value(TEST_COMMENT_ID))
                .andExpect(jsonPath("$.content").value("테스트 댓글 내용"));
    }

    @Test
    @DisplayName("댓글 수정 테스트")
    void updateCommentTest() throws Exception {
        // given
        CommentResponse updatedResponse = CommentResponse.builder()
                .success(true)
                .comment_id(TEST_COMMENT_ID)
                .report_id(TEST_REPORT_ID)
                .author_id(TEST_USER_ID)
                .author_name("테스트 사용자")
                .content("수정된 댓글 내용")
                .created_at(LocalDateTime.now())
                .updated_at(LocalDateTime.now())
                .is_deleted(false)
                .build();

        when(tokenService.getUserIdFromToken(anyString())).thenReturn(TEST_USER_ID);
        when(commentService.updateComment(eq(TEST_COMMENT_ID), eq(TEST_USER_ID), any(CommentRequest.class)))
                .thenReturn(updatedResponse);

        // 수정된 요청 데이터
        CommentRequest updateRequest = new CommentRequest();
        updateRequest.setContent("수정된 댓글 내용");

        // when & then
        mockMvc.perform(put("/api/reports/{reportId}/comments/{commentId}", TEST_REPORT_ID, TEST_COMMENT_ID)
                .header("Authorization", TEST_TOKEN)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(updateRequest)))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.comment_id").value(TEST_COMMENT_ID))
                .andExpect(jsonPath("$.content").value("수정된 댓글 내용"));
    }

    @Test
    @DisplayName("댓글 삭제 테스트")
    void deleteCommentTest() throws Exception {
        // given
        CommentResponse deletedResponse = CommentResponse.builder()
                .success(true)
                .comment_id(TEST_COMMENT_ID)
                .report_id(TEST_REPORT_ID)
                .author_id(TEST_USER_ID)
                .author_name("테스트 사용자")
                .content("테스트 댓글 내용")
                .created_at(LocalDateTime.now())
                .updated_at(LocalDateTime.now())
                .is_deleted(true)
                .message("댓글이 성공적으로 삭제되었습니다.")
                .build();

        when(tokenService.getUserIdFromToken(anyString())).thenReturn(TEST_USER_ID);
        when(commentService.deleteComment(eq(TEST_COMMENT_ID), eq(TEST_USER_ID)))
                .thenReturn(deletedResponse);

        // when & then
        mockMvc.perform(delete("/api/reports/{reportId}/comments/{commentId}", TEST_REPORT_ID, TEST_COMMENT_ID)
                .header("Authorization", TEST_TOKEN))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.is_deleted").value(true))
                .andExpect(jsonPath("$.message").value("댓글이 성공적으로 삭제되었습니다."));
    }

    @Test
    @DisplayName("인증되지 않은 요청에 대한 실패 테스트")
    void unauthorizedRequestTest() throws Exception {
        // when & then - 인증 토큰 없이 요청
        mockMvc.perform(post("/api/reports/{reportId}/comments", TEST_REPORT_ID)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(commentRequest)))
                .andDo(print())
                .andExpect(status().isUnauthorized());
    }

    @Test
    @DisplayName("권한 없는 댓글 수정 실패 테스트")
    void unauthorizedUpdateTest() throws Exception {
        // given
        String otherUserId = "other-user-123";
        CommentResponse errorResponse = CommentResponse.builder()
                .success(false)
                .message("댓글 수정 권한이 없습니다.")
                .build();

        when(tokenService.getUserIdFromToken(anyString())).thenReturn(otherUserId);
        when(commentService.updateComment(eq(TEST_COMMENT_ID), eq(otherUserId), any(CommentRequest.class)))
                .thenReturn(errorResponse);

        // when & then
        mockMvc.perform(put("/api/reports/{reportId}/comments/{commentId}", TEST_REPORT_ID, TEST_COMMENT_ID)
                .header("Authorization", TEST_TOKEN)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(commentRequest)))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.message").value("댓글 수정 권한이 없습니다."));
    }

    @Test
    @DisplayName("존재하지 않는 보고서에 댓글 생성 실패 테스트")
    void createCommentForNonExistingReportTest() throws Exception {
        // given
        Long nonExistingReportId = 999L;
        CommentResponse errorResponse = CommentResponse.builder()
                .success(false)
                .message("해당 보고서를 찾을 수 없습니다.")
                .build();

        when(tokenService.getUserIdFromToken(anyString())).thenReturn(TEST_USER_ID);
        when(commentService.createComment(eq(nonExistingReportId), eq(TEST_USER_ID), any(CommentRequest.class)))
                .thenReturn(errorResponse);

        // when & then
        mockMvc.perform(post("/api/reports/{reportId}/comments", nonExistingReportId)
                .header("Authorization", TEST_TOKEN)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(commentRequest)))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.message").value("해당 보고서를 찾을 수 없습니다."));
    }
}
