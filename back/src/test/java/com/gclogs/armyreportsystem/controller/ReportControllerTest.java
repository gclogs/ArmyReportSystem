package com.gclogs.armyreportsystem.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.gclogs.armyreportsystem.auth.service.TokenService;
import com.gclogs.armyreportsystem.report.dto.ReportRequest;
import com.gclogs.armyreportsystem.report.dto.ReportResponse;
import com.gclogs.armyreportsystem.report.service.ReportService;
import org.aspectj.lang.annotation.Before;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;
import java.util.List;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
public class ReportControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private ReportService reportService;

    @MockBean
    private TokenService tokenService;

    private ReportResponse reportResponse;
    private ReportRequest reportRequest;
    private final String TEST_TOKEN = "Bearer eyJhbGciOiJIUzM4NCJ9.eyJzdWIiOiJvZmZpY2VyMDAxIiwiaWF0IjoxNzUwOTMwNjQyLCJ1c2VyX2lkIjoib2ZmaWNlcjAwMSIsImV4cCI6MTc1MTAxNzA0Mn0.z3A8rDw3K_ppdbZmcFA1ElxMCGSMe3xyv8i7vJUjMtm3URp426ajlE3t3EP5Nlf-";
    private final String TEST_USER_ID = "officer001";
    private final Long TEST_REPORT_ID = 1L;
    private final Long TEST_COMMENT_ID = 1L;

    @BeforeEach
    public void setUp() {
        // 테스트용 응답 데이터 설정
        reportResponse = ReportResponse.builder()
                .success(true)
                .report_id(TEST_REPORT_ID)
                .author_id(TEST_USER_ID)
                .author_name("테스트 사용자")
                .content("테스트 보고 내용")
                .created_at(LocalDateTime.now())
                .updated_at(LocalDateTime.now())
                .is_deleted(false)
                .build();
    }

    @Test
    @DisplayName("보고서 읽기 테스트")
    void getReportsTest() throws Exception {
        List<ReportResponse> reportList = List.of(reportResponse);
        when(reportService.getReports()).thenReturn(reportList);
        mockMvc.perform(get("/api/reports/list")
                .header("Authorization", TEST_TOKEN))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].success").value(true))
                .andExpect(jsonPath("$[0].report_id").value(TEST_REPORT_ID));

    }



}
