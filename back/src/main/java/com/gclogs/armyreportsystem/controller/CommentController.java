// com.gclogs.armyreportsystem.controller.CommentController.java
package com.gclogs.armyreportsystem.controller;

import com.gclogs.armyreportsystem.domain.Comment;
import com.gclogs.armyreportsystem.dto.CommentRequest;
import com.gclogs.armyreportsystem.dto.CommentResponse;
import com.gclogs.armyreportsystem.service.CommentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reports")
@RequiredArgsConstructor
public class CommentController {

    private final CommentService commentService;

    @GetMapping("/{reportId}/comments")
    public ResponseEntity<?> getCommentsByReportId(@PathVariable("reportId") Long reportId) {
        var comments = commentService.getCommentsByReportId(reportId);

        Map<String, List<CommentResponse>> response = new HashMap<>();
        response.put("data", comments);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/{reportId}/comments")
    public ResponseEntity<CommentResponse> createComment(
            @PathVariable("reportId") Long reportId,
            @Valid @RequestHeader("userId") String userId,
            @RequestBody CommentRequest request) {
        return ResponseEntity.ok(commentService.createComment(reportId, userId, request));
    }

    @PutMapping("/{reportId}/comments/{commentId}")
    public ResponseEntity<CommentResponse> updateComment(
            @PathVariable("commentId") Long commentId,
            @RequestHeader("userId") String userId,
            @RequestBody CommentRequest request) {
        return ResponseEntity.ok(commentService.updateComment(commentId, userId, request));
    }

    @DeleteMapping("/{reportId}/comments/{commentId}")
    public ResponseEntity<CommentResponse> deleteComment(
            @PathVariable("reportId") Long reportId,
            @PathVariable("commentId") Long commentId,
            @RequestHeader("userId") String userId) {
        return ResponseEntity.ok(commentService.deleteComment(commentId, userId));
    }
}