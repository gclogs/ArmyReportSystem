package com.gclogs.armyreportsystem.controller;

import com.gclogs.armyreportsystem.dto.ReportRequest;
import com.gclogs.armyreportsystem.dto.ReportResponse;
import com.gclogs.armyreportsystem.service.ReportService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import javax.print.attribute.standard.Media;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/reports")
@RequiredArgsConstructor
public class ReportController {

    private final ReportService reportService;
    
    @PostMapping(consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<ReportResponse> createReportJson(
            @Valid @RequestBody ReportRequest request,
            @RequestHeader("userId") String userId) {
        ReportResponse response = reportService.writeReport(request, userId);
        return ResponseEntity.ok(response);
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ReportResponse> createReportMultipart(
        @RequestParam("title") String title,
        @RequestParam("content") String content,
        @RequestParam(value = "type", required = false) String type,
        @RequestParam(value = "priority", required = false) String priority,
        @RequestParam(value = "attachments", required = false) List<MultipartFile> attachments,
        @RequestHeader("userId") String userId) {
            
        ReportRequest request = new ReportRequest();
        request.setTitle(title);
        request.setContent(content);
        request.setType(type);
        request.setPriority(priority);

        ReportResponse response = reportService.writeReportWithFiles(request, attachments, userId);
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/{reportId}")
    public ResponseEntity<ReportResponse> getReportById(@PathVariable String reportId) {
        ReportResponse response = reportService.getReportById(reportId);
        if (!response.isSuccess()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(response);
    }
    
    @PutMapping("/{reportId}")
    public ResponseEntity<ReportResponse> updateReport(
            @PathVariable String reportId,
            @Valid @RequestBody ReportRequest request) {
        ReportResponse response = reportService.editReport(reportId, request);
        if (!response.isSuccess()) {
            return ResponseEntity.badRequest().body(response);
        }
        return ResponseEntity.ok(response);
    }
    
    @DeleteMapping("/{reportId}")
    public ResponseEntity<ReportResponse> deleteReport(@PathVariable String reportId) {
        ReportResponse response = reportService.deleteReportById(reportId);
        if (!response.isSuccess()) {
            return ResponseEntity.badRequest().body(response);
        }
        return ResponseEntity.ok(response);
    }
}
