package com.gclogs.armyreportsystem.report.service;

import com.gclogs.armyreportsystem.report.domain.Report;
import com.gclogs.armyreportsystem.report.domain.enums.ReportStatus;
import com.gclogs.armyreportsystem.report.domain.enums.ReportType;
import com.gclogs.armyreportsystem.report.dto.ReportRequest;
import com.gclogs.armyreportsystem.report.dto.ReportResponse;
import com.gclogs.armyreportsystem.report.mapper.ReportMapper;
import com.gclogs.armyreportsystem.user.domain.User;
import com.gclogs.armyreportsystem.user.mapper.UserMapper;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ReportService {
    private final ReportMapper reportMapper;
    private final UserMapper userMapper;

    @Transactional
    public List<ReportResponse> getReports() {
        List<Report> reports = reportMapper.findAllReports();
        
        if (reports == null || reports.isEmpty()) {
            return List.of(ReportResponse.builder()
                    .success(false)
                    .message("보고서를 찾을 수 없습니다.")
                    .build());
        }

        List<ReportResponse> reportResponses = new ArrayList<>();
        for (Report report : reports) {
            reportResponses.add(ReportResponse.builder()
                    .success(true)
                    .message("보고서 조회 성공")
                    .reportId(report.getReportId())
                    .type(report.getType())
                    .title(report.getTitle())
                    .content(report.getContent())
                    .priority(report.getPriority())
                    .status(report.getStatus())
                    .createdAt(report.getCreatedAt())
                    .updatedAt(report.getUpdatedAt())
                    .authorId(report.getAuthorId())
                    .authorName(report.getAuthorName())
                    .authorRank(report.getAuthorRank())
                    .deletedAt(report.getDeletedAt())
                    .isDeleted(report.isDeleted())
                    .comments(new ArrayList<>())
                    .build());
        }

        return reportResponses;
    }

    @Transactional
    public ReportResponse writeReport(ReportRequest request, String userId) {
        // 1. 작성자 정보 조회
        User user = userMapper.findByUserId(userId);
        
        if (user == null) {
            return ReportResponse.builder()
                    .success(false)
                    .message("사용자 정보를 찾을 수 없습니다.")
                    .build();
        }

        Report report = Report.builder()
                .authorId(user.getUserId())
                .authorName(user.getName())
                .authorRank(user.getRank())
                .type(request.getType())
                .title(request.getTitle())
                .content(request.getContent())
                .priority(request.getPriority())
                .status(ReportStatus.NEW.getValue())
                .updatedAt(LocalDateTime.now())
                .createdAt(LocalDateTime.now())
                .build();

        reportMapper.writeReport(report);

        return ReportResponse.builder()
                .success(true)
                .message("보고서가 성공적으로 작성되었습니다.")
                .reportId(report.getReportId())
                .type(ReportType.GENERAL.getValue())
                .title(report.getTitle())
                .content(report.getContent())
                .priority(report.getPriority())
                .status(ReportStatus.NEW.getValue())
                .build();
    }
    
    @Transactional(readOnly = true)
    public ReportResponse getReportById(Long reportId) {
        Report report = reportMapper.findReportById(reportId);
        
        if (report == null) {
            return ReportResponse.builder()
                    .success(false)
                    .message("보고서를 찾을 수 없습니다.")
                    .build();
        }
        
        // 논리적으로 삭제된 보고서는 조회되지 않도록 처리
        if (report.isDeleted()) {
            return ReportResponse.builder()
                    .success(false)
                    .message("삭제된 보고서입니다.")
                    .build();
        }
        
        return ReportResponse.builder()
                .success(true)
                .message("보고서 조회 성공")
                .reportId(report.getReportId())
                .type(report.getType())
                .title(report.getTitle())
                .content(report.getContent())
                .priority(report.getPriority())
                .status(report.getStatus())
                .createdAt(report.getCreatedAt())
                .updatedAt(report.getUpdatedAt())
                .authorId(report.getAuthorId())
                .authorName(report.getAuthorName())
                .authorRank(report.getAuthorRank())
                .deletedAt(report.getDeletedAt())
                .isDeleted(report.isDeleted())
                .comments(new ArrayList<>())
                .build();
    }

    @Transactional
    public ReportResponse editReport(Long reportId, ReportRequest request) {
        // 기존 보고서 조회
        Report existingReport = reportMapper.findReportById(reportId);
        
        if (existingReport == null) {
            return ReportResponse.builder()
                    .success(false)
                    .message("수정할 보고서를 찾을 수 없습니다.")
                    .build();
        }
        
        // 삭제된 보고서는 수정할 수 없음
        if (existingReport.isDeleted()) {
            return ReportResponse.builder()
                    .success(false)
                    .message("삭제된 보고서는 수정할 수 없습니다.")
                    .build();
        }
        
        // 보고서 정보 업데이트
        existingReport.setType(request.getType());
        existingReport.setTitle(request.getTitle());
        existingReport.setContent(request.getContent());
        existingReport.setPriority(request.getPriority());
        existingReport.setUpdatedAt(LocalDateTime.now());
        
        // DB 업데이트
        reportMapper.editReport(existingReport);
        
        // 응답 생성
        return ReportResponse.builder()
                .success(true)
                .message("보고서가 성공적으로 수정되었습니다.")
                .type(existingReport.getType())
                .title(existingReport.getTitle())
                .content(existingReport.getContent())
                .updatedAt(existingReport.getUpdatedAt())
                .build();
    }

    @Transactional
    public ReportResponse deleteReportById(Long reportId) {
        Report report = reportMapper.findReportById(reportId);
        if (report == null) {
            return ReportResponse.builder()
                    .success(false)
                    .message("보고서를 찾을 수 없습니다.")
                    .build();
        }
        
        // 이미 삭제된 보고서인 경우
        if (report.isDeleted()) {
            return ReportResponse.builder()
                    .success(false)
                    .message("이미 삭제된 보고서입니다.")
                    .build();
        }
        
        // 논리적 삭제 처리
        report.setDeleted(true);
        report.setDeletedAt(LocalDateTime.now());
        
        // DB 업데이트
        reportMapper.deleteReport(report);

        return ReportResponse.builder()
                .success(true)
                .message("보고서를 성공적으로 삭제하였습니다.")
                .build();
    }

    @Transactional
    public ReportResponse isAuthorizedReport(Long reportId, String userId) {
        Report report = reportMapper.findReportById(reportId);
        if (report == null) {
            throw new IllegalArgumentException("보고서를 찾을 수 없습니다.");
        }

        User user = userMapper.findByUserId(userId);
        if (user == null) {
            throw new IllegalArgumentException("사용자를 찾을 수 없습니다.");
        }

        boolean isAuthorized = reportMapper.isAuthorizedReport(reportId, userId);
        if (!isAuthorized) {
            return ReportResponse.builder()
                    .success(false)
                    .message("보고서에 대한 접근 권한이 없습니다.")
                    .build();
        }

        return ReportResponse.builder()
                .success(true)
                .message("보고서에 접근 권한이 있습니다.")
                .build();
    }
}
