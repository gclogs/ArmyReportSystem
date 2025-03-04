package com.gclogs.armyreportsystem.mapper;

import com.gclogs.armyreportsystem.domain.Report;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface ReportMapper {
    Report findReportByUserId(String userId);
    Report findReportById(String reportId);
    void writeReport(Report report);
    void editReport(Report report);
    void deleteReport(Report report);
}
