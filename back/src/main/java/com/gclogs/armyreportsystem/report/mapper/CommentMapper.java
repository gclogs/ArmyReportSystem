package com.gclogs.armyreportsystem.report.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import com.gclogs.armyreportsystem.report.domain.Comment;

@Mapper
public interface CommentMapper {
    List<Comment> findCommentsByReportId(Long reportId);
    Comment findCommentById(Long commentId);
    void createComment(Comment comment);
    void updateComment(Comment comment);
    void deleteComment(Long commentId);
    void deleteAllByReportId(Long reportId);
    Integer countByReportId(Long reportId);
}
