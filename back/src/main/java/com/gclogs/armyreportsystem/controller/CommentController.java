// com.gclogs.armyreportsystem.controller.CommentController.java
package com.gclogs.armyreportsystem.controller;

import com.gclogs.armyreportsystem.dto.CommentRequest;
import com.gclogs.armyreportsystem.dto.CommentResponse;
import com.gclogs.armyreportsystem.service.CommentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reports/{reportId}/comments")
@RequiredArgsConstructor
public class CommentController {

    private final CommentService commentService;

    @GetMapping
    public ResponseEntity<List<CommentResponse>> getComments(@PathVariable Long reportId) {
        List<CommentResponse> comments = commentService.getCommentsByReportId(reportId);
        return ResponseEntity.ok(comments);
    }

    @PostMapping
    public ResponseEntity<CommentResponse> createComment(
            @PathVariable Long reportId,
            @RequestAttribute("userId") String userId,
            @Valid @RequestBody CommentRequest request) {
        CommentResponse response = commentService.createComment(reportId, userId, request);
        if (!response.isSuccess()) {
            return ResponseEntity.badRequest().body(response);
        }
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{commentId}")
    public ResponseEntity<CommentResponse> updateComment(
            @PathVariable Long reportId,
            @PathVariable Long commentId,
            @RequestAttribute("userId") String userId,
            @Valid @RequestBody CommentRequest request) {
        CommentResponse response = commentService.updateComment(commentId, userId, request);
        if (!response.isSuccess()) {
            return ResponseEntity.badRequest().body(response);
        }
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{commentId}")
    public ResponseEntity<CommentResponse> deleteComment(
            @PathVariable Long reportId,
            @PathVariable Long commentId,
            @RequestAttribute("userId") String userId) {
        CommentResponse response = commentService.deleteComment(commentId, userId);
        if (!response.isSuccess()) {
            return ResponseEntity.badRequest().body(response);
        }
        return ResponseEntity.ok(response);
    }
}