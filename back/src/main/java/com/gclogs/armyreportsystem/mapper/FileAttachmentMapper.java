package com.gclogs.armyreportsystem.mapper;

import com.gclogs.armyreportsystem.domain.FileAttachment;

import java.util.List;

public interface FileAttachmentMapper {
    void saveFileAttachment(FileAttachment fileAttachment);
    List<FileAttachment> findByReportId(String reportId);
    FileAttachment findByAttachmentId(String attachmentId);
}
