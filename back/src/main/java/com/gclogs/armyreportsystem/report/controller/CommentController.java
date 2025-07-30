// com.gclogs.armyreportsystem.controller.CommentController.java
package com.gclogs.armyreportsystem.report.controller;

import com.gclogs.armyreportsystem.auth.service.TokenService;
import com.gclogs.armyreportsystem.report.dto.CommentRequest;
import com.gclogs.armyreportsystem.report.dto.CommentResponse;
import com.gclogs.armyreportsystem.report.service.CommentService;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/comments")
@RequiredArgsConstructor
public class CommentController {

    private final CommentService commentService;
    private final TokenService tokenService;

    @GetMapping
    public ResponseEntity<?> getCommentsByReportId(@RequestParam("reportId") Long reportId) {
        var comments = commentService.getCommentsByReportId(reportId);
        
        // isDeleted가 false인 댓글만 필터링
        var nonDeletedComments = comments.stream()
                .filter(comment -> !comment.isDeleted())
                .collect(Collectors.toList());
                
        return ResponseEntity.ok(nonDeletedComments);
    }

    @PostMapping
    public ResponseEntity<CommentResponse> createComment(
            @RequestHeader("Authorization") String header,
            @RequestBody CommentRequest request) {

        String token = header.replace("Bearer ", "");
        String userId = tokenService.getUserIdFromToken(token);

        return ResponseEntity.ok(commentService.createComment(userId, request));
    }

    @PutMapping("/{commentId}")
    public ResponseEntity<CommentResponse> updateComment(
            @PathVariable("commentId") Long commentId,
            @RequestHeader("Authorization") String header,
            @RequestBody CommentRequest request) {

        String token = header.replace("Bearer ", "");
        String userId = tokenService.getUserIdFromToken(token);

        return ResponseEntity.ok(commentService.updateComment(commentId, userId, request));
    }

    @DeleteMapping("/{commentId}")
    public ResponseEntity<CommentResponse> deleteComment(
            @PathVariable("commentId") Long commentId,
            @RequestHeader("Authorization") String header) {

        String token = header.replace("Bearer ", "");
        String userId = tokenService.getUserIdFromToken(token);

        return ResponseEntity.ok(commentService.deleteComment(commentId, userId));
    }
}