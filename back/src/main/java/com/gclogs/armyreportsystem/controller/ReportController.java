package com.gclogs.armyreportsystem.controller;

import com.gclogs.armyreportsystem.dto.CommentResponse;
import com.gclogs.armyreportsystem.dto.ReportRequest;
import com.gclogs.armyreportsystem.dto.ReportResponse;
import com.gclogs.armyreportsystem.service.CommentService;
import com.gclogs.armyreportsystem.service.ReportService;
import com.gclogs.armyreportsystem.service.TokenService;
import com.gclogs.armyreportsystem.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

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

    /**
     * FormData 형식의 보고서 생성 엔드포인트 (파일 첨부 가능)
     * Content-Type: multipart/form-data
     */
    @PostMapping(value="/multipart", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ReportResponse> createReportMultipart(
        @RequestParam("title") String title,
        @RequestParam("content") String content,
        @RequestParam(value = "type", required = false) String type,
        @RequestParam(value = "priority", required = false) String priority,
        @RequestParam(value = "attachments", required = false) List<MultipartFile> attachments,
        @RequestHeader(value = "Authorization", required = true) String header) {
        
        log.debug("Multipart 보고서 생성 요청 - token: {}", header);

        String token = header.replace("Bearer ", "");
        String userId = tokenService.getUserIdFromToken(token);

        ReportRequest request = new ReportRequest();
        request.setTitle(title);
        request.setContent(content);
        request.setType(type);
        request.setPriority(priority);

        ReportResponse response = reportService.writeReportWithFiles(request, attachments, userId);
        return ResponseEntity.ok(response);
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

        // 권한이 없으면 보고서 수정 진행
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