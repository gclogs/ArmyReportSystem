package com.gclogs.armyreportsystem.controller;

import com.gclogs.armyreportsystem.dto.ReportRequest;
import com.gclogs.armyreportsystem.dto.ReportResponse;
import com.gclogs.armyreportsystem.service.ReportService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/reports")
@RequiredArgsConstructor
public class ReportController {

    private final ReportService reportService;
    
    @PostMapping
    public ResponseEntity<ReportResponse> createReport(
            @Valid @RequestBody ReportRequest request,
            @RequestHeader("userId") String userId) {
        ReportResponse response = reportService.writeReport(request, userId);
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
