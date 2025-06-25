package com.gclogs.armyreportsystem.report.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.gclogs.armyreportsystem.report.domain.Report;

@Mapper
public interface ReportMapper {
    List<Report> findAllReports();
    Report findReportByUserId(@Param("user_id") String userId);
    Report findReportById(@Param("report_id") Long reportId);
    void writeReport(Report report);
    void editReport(Report report);
    void deleteReport(Report report);
    void writeEncryptedReport(Report report);
    boolean isAuthorizedReport(@Param("report_id") Long reportId, @Param("user_id") String userId);
}
