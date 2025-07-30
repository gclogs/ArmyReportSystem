package com.gclogs.armyreportsystem.report.controller;

import com.gclogs.armyreportsystem.auth.service.TokenService;
import com.gclogs.armyreportsystem.report.dto.ReportRequest;
import com.gclogs.armyreportsystem.report.dto.ReportResponse;
import com.gclogs.armyreportsystem.report.service.ReportService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/reports")
@RequiredArgsConstructor
public class ReportController {

    private final TokenService tokenService;
    private final ReportService reportService;

    @GetMapping("/list")
    public ResponseEntity<List<ReportResponse>> getReportList() {
        List<ReportResponse> response = reportService.getReports();
        return ResponseEntity.ok(response);
    }

    @PostMapping
    public ReportResponse writeReport(@RequestHeader(value = "Authorization", required = true) String header, @Valid @RequestBody ReportRequest request) {
        String token = header.replace("Bearer ", "");
        String userId = tokenService.getUserIdFromToken(token);
        return reportService.writeReport(request, userId);
    }
    
    @GetMapping("/{reportId}")
    public ResponseEntity<ReportResponse> getReportById(@PathVariable Long reportId) {
        ReportResponse response = reportService.getReportById(reportId);
        if (!response.isSuccess()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{reportId}")
    public ResponseEntity<ReportResponse> updateReport(
            @PathVariable Long reportId,
            @RequestHeader(value = "Authorization", required = true) String header,
            @Valid @RequestBody ReportRequest request) {

        String token = header.replace("Bearer ", "");
        String userId = tokenService.getUserIdFromToken(token);

        // 권한 확인
        ReportResponse authorizedReport = reportService.isAuthorizedReport(reportId, userId);
        if(!authorizedReport.isSuccess()) {
            return  ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        // 권한이 있으면 보고서 수정 진행
        ReportResponse response = reportService.editReport(reportId, request);
        if (!response.isSuccess()) {
            return ResponseEntity.badRequest().body(response);
        }
        return ResponseEntity.ok(response);
    }
    
    @DeleteMapping("/{reportId}")
    public ResponseEntity<ReportResponse> deleteReport(
            @PathVariable Long reportId,
            @RequestHeader(value = "Authorization", required = true) String header) {
        
        String token = header.replace("Bearer ", "");
        String userId = tokenService.getUserIdFromToken(token);

        // 권한 확인
        ReportResponse authorizedReport = reportService.isAuthorizedReport(reportId, userId);
        if(!authorizedReport.isSuccess()) {
            return  ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        // 권한이 없으면 보고서 삭제 진행
        ReportResponse response = reportService.deleteReportById(reportId);
        if (!response.isSuccess()) {
            return ResponseEntity.badRequest().body(response);
        }
        return ResponseEntity.ok(response);
    }
}