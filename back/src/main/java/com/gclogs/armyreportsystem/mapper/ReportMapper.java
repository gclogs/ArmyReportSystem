package com.gclogs.armyreportsystem.mapper;

import java.util.List;

import com.gclogs.armyreportsystem.domain.Report;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface ReportMapper {
    List<Report> findAllReports();
    Report findReportByUserId(String userId);
    Report findReportById(String reportId);
    void writeReport(Report report);
    void editReport(Report report);
    void deleteReport(Report report);
}
