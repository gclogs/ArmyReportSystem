package com.gclogs.armyreportsystem.service;

import com.gclogs.armyreportsystem.domain.Report;
import com.gclogs.armyreportsystem.domain.User;
import com.gclogs.armyreportsystem.dto.ReportRequest;
import com.gclogs.armyreportsystem.dto.ReportResponse;
import com.gclogs.armyreportsystem.mapper.ReportMapper;
import com.gclogs.armyreportsystem.mapper.UserMapper;
import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ReportService {
    private final ReportMapper reportMapper;
    private final UserMapper userMapper;

    private FileStorageService fileStrorageService;

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
                    .report_id(report.getReport_id())
                    .type(report.getType())
                    .title(report.getTitle())
                    .content(report.getContent())
                    .priority(report.getPriority())
                    .status(report.getStatus())
                    .created_at(report.getCreated_at())
                    .updated_at(report.getUpdated_at())
                    .author_id(report.getAuthor_id())
                    .author_name(report.getAuthor_name())
                    .fileAttachments(new ArrayList<>())
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
                .author_id(user.getUser_id())
                .author_name(user.getName())
                .author_rank(user.getRank())
                .type(request.getType())
                .title(request.getTitle())
                .content(request.getContent())
                .priority(request.getPriority())
                .status("new")  // 새 보고서의 초기 상태
                .is_deleted(false)
                .created_at(LocalDateTime.now())
                .updated_at(LocalDateTime.now())
                .build();

        reportMapper.writeReport(report);

        return ReportResponse.builder()
                .success(true)
                .message("보고서가 성공적으로 작성되었습니다.")
                .report_id(report.getReport_id())
                .type(report.getType())
                .title(report.getTitle())
                .content(report.getContent())
                .priority(report.getPriority())
                .status(report.getStatus())
                .created_at(report.getCreated_at())
                .updated_at(report.getUpdated_at())
                .author_id(report.getAuthor_id())
                .author_name(report.getAuthor_name())
                .fileAttachments(new ArrayList<>())  // 첨부 파일은 나중에 구현
                .comments(new ArrayList<>())     // 댓글은 나중에 구현
                .build();
    }

    @Transactional
    public ReportResponse writeReportWithFiles(ReportRequest request, List<MultipartFile> attachments, String userId) {
        User user = userMapper.findByUserId(userId);
        if (user == null) {
            return ReportResponse.builder()
                    .success(false)
                    .message("사용자 정보를 찾을 수 없습니다.")
                    .build();
        }

        try {
            List<String> fileNames = new ArrayList<>();
            if (attachments != null && !attachments.isEmpty()) {
                for(MultipartFile attachment : attachments) {
                    if(!attachment.isEmpty()) {
                        String fileName = fileStrorageService.storeFile(attachment);
                        fileNames.add(fileName);
                    }
                }
            }
        } catch (Exception e) {
            return ReportResponse.builder()
                    .success(false)
                    .message("파일 업로드중에 오류가 발생하였습니다." + e.getMessage())
                    .build();
        }

        return writeReport(request, userId);
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
        if (report.is_deleted()) {
            return ReportResponse.builder()
                    .success(false)
                    .message("삭제된 보고서입니다.")
                    .build();
        }
        
        return ReportResponse.builder()
                .success(true)
                .message("보고서 조회 성공")
                .report_id(report.getReport_id())
                .type(report.getType())
                .title(report.getTitle())
                .content(report.getContent())
                .priority(report.getPriority())
                .status(report.getStatus())
                .created_at(report.getCreated_at())
                .updated_at(report.getUpdated_at())
                .author_id(report.getAuthor_id())
                .author_name(report.getAuthor_name())
                .fileAttachments(new ArrayList<>())  // 첨부 파일은 나중에 구현
                .comments(new ArrayList<>())     // 댓글은 나중에 구현
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
        if (existingReport.is_deleted()) {
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
        existingReport.setUpdated_at(LocalDateTime.now());
        
        // DB 업데이트
        reportMapper.editReport(existingReport);
        
        // 응답 생성
        return ReportResponse.builder()
                .success(true)
                .message("보고서가 성공적으로 수정되었습니다.")
                .report_id(existingReport.getReport_id())
                .type(existingReport.getType())
                .title(existingReport.getTitle())
                .content(existingReport.getContent())
                .priority(existingReport.getPriority())
                .status(existingReport.getStatus())
                .created_at(existingReport.getCreated_at())
                .updated_at(existingReport.getUpdated_at())
                .author_id(existingReport.getAuthor_id())
                .author_name(existingReport.getAuthor_name())
                .fileAttachments(new ArrayList<>())
                .comments(new ArrayList<>())
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
        if (report.is_deleted()) {
            return ReportResponse.builder()
                    .success(false)
                    .message("이미 삭제된 보고서입니다.")
                    .build();
        }
        
        // 논리적 삭제 처리
        report.set_deleted(true);
        report.setDeleted_at(LocalDateTime.now());
        
        // DB 업데이트
        reportMapper.deleteReport(report);

        return ReportResponse.builder()
                .success(true)
                .message("보고서를 성공적으로 삭제하였습니다.")
                .report_id(report.getReport_id())
                .type(report.getType())
                .title(report.getTitle())
                .content(report.getContent())
                .status(report.getStatus())
                .is_deleted(true)
                .deleted_at(report.getDeleted_at())
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
