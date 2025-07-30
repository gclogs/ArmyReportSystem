package com.gclogs.armyreportsystem.report.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import com.gclogs.armyreportsystem.report.domain.Report;

@Mapper
public interface ReportMapper {
    List<Report> findAllReports();
    Report findReportByUserId(String userId);
    Report findReportById(Long reportId);
    void writeReport(Report report);
    void editReport(Report report);
    void deleteReport(Report report);
    void writeEncryptedReport(Report report);
    boolean isAuthorizedReport(Long reportId, String userId);
}
