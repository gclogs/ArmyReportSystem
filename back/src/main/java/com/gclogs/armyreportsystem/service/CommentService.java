// com.gclogs.armyreportsystem.service.CommentService.java
package com.gclogs.armyreportsystem.service;

import com.gclogs.armyreportsystem.domain.Comment;
import com.gclogs.armyreportsystem.domain.Report;
import com.gclogs.armyreportsystem.domain.User;
import com.gclogs.armyreportsystem.dto.CommentRequest;
import com.gclogs.armyreportsystem.dto.CommentResponse;
import com.gclogs.armyreportsystem.mapper.CommentMapper;
import com.gclogs.armyreportsystem.mapper.ReportMapper;
import com.gclogs.armyreportsystem.mapper.UserMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CommentService {

    private final CommentMapper commentMapper;
    private final ReportMapper reportMapper;
    private final UserMapper userMapper;

    @Transactional(readOnly = true)
    public List<CommentResponse> getCommentsByReportId(Long reportId) {
        // 보고서 존재 여부 확인
        Report report = reportMapper.findReportById(reportId);
        if (report == null) {
            return List.of(CommentResponse.builder()
                    .success(false)
                    .message("해당 보고서를 찾을 수 없습니다.")
                    .build());
        }

        // 댓글 목록 조회
        List<Comment> comments = commentMapper.findCommentsByReportId(reportId);

        // 응답 변환
        return comments.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public CommentResponse createComment(String userId, CommentRequest request) {
        // 보고서 존재 여부 확인
        Report report = reportMapper.findReportById(request.getReport_id());
        if (report == null) {
            return CommentResponse.builder()
                    .success(false)
                    .message("해당 보고서를 찾을 수 없습니다.")
                    .build();
        }

        // 사용자 정보 조회
        User user = userMapper.findByUserId(userId);
        if (user == null) {
            return CommentResponse.builder()
                    .success(false)
                    .message("사용자 정보를 찾을 수 없습니다.")
                    .build();
        }

        // 신규 댓글 생성
        Comment comment = Comment.builder()
                .report_id(request.getReport_id())
                .author_id(user.getUser_id())
                .author_name(user.getName())
                .author_rank(user.getRank())
                .content(request.getContent())
                .created_at(LocalDateTime.now())
                .updated_at(LocalDateTime.now())
                .is_deleted(false)
                .build();

        // DB 저장
        commentMapper.createComment(comment);
        return convertToResponse(comment);
    }

    @Transactional
    public CommentResponse updateComment(Long commentId, String userId, CommentRequest request) {
        try {
            // 댓글 존재 여부 확인
            Comment comment = commentMapper.findCommentById(commentId);
            if (comment == null) {
                return CommentResponse.builder()
                        .success(false)
                        .message("해당 댓글을 찾을 수 없습니다.")
                        .build();
            }

            // 권한 확인 (작성자만 수정 가능)
            if (!comment.getAuthor_id().equals(userId)) {
                return CommentResponse.builder()
                        .success(false)
                        .message("댓글 수정 권한이 없습니다.")
                        .build();
            }

            // 댓글 내용 및 수정일시 업데이트
            comment.setContent(request.getContent());
            comment.setUpdated_at(LocalDateTime.now());

            // DB 업데이트
            commentMapper.updateComment(comment);

            return convertToResponse(comment);

        } catch (Exception e) {
            return CommentResponse.builder()
                    .success(false)
                    .message("댓글 수정 중 오류가 발생했습니다: " + e.getMessage())
                    .build();
        }
    }

    @Transactional
    public CommentResponse deleteComment(Long commentId, String userId) {
        // 댓글 존재 여부 확인
        Comment comment = commentMapper.findCommentById(commentId);
        if (comment == null) {
            return CommentResponse.builder()
                    .success(false)
                    .message("해당 댓글을 찾을 수 없습니다.")
                    .build();
        }

        // 권한 확인 (작성자만 삭제 가능)
        if (!comment.getAuthor_id().equals(userId)) {
            return CommentResponse.builder()
                    .success(false)
                    .message("댓글 삭제 권한이 없습니다.")
                    .build();
        }

        // 논리적 삭제 처리
        comment.set_deleted(true);
        comment.setDeleted_at(LocalDateTime.now());

        // DB 업데이트
        commentMapper.deleteComment(comment.getComment_id());

        return CommentResponse.builder()
                .success(true)
                .message("댓글이 성공적으로 삭제되었습니다.")
                .comment_id(comment.getComment_id())
                .report_id(comment.getReport_id())
                .author_id(comment.getAuthor_id())
                .author_name(comment.getAuthor_name())
                .content(comment.getContent())
                .created_at(comment.getCreated_at())
                .updated_at(comment.getUpdated_at())
                .is_deleted(true)
                .build();
    }

    // Comment 모델을 CommentResponse로 변환하는 유틸리티 메소드
    private CommentResponse convertToResponse(Comment comment) {
        return CommentResponse.builder()
                .success(true)
                .comment_id(comment.getComment_id())
                .report_id(comment.getReport_id())
                .author_id(comment.getAuthor_id())
                .author_name(comment.getAuthor_name())
                .author_rank(comment.getAuthor_rank())
                .content(comment.getContent())
                .created_at(comment.getCreated_at())
                .updated_at(comment.getUpdated_at())
                .is_deleted(comment.is_deleted())
                .build();
    }
}