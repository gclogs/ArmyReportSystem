package com.gclogs.armyreportsystem.user.controller;

import com.gclogs.armyreportsystem.user.dto.UserInfoResponse;
import com.gclogs.armyreportsystem.user.exception.UserNotFoundException;
import com.gclogs.armyreportsystem.user.service.UserService;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/{userId}")
    public ResponseEntity<UserInfoResponse> getUserById(@PathVariable String userId) {
        UserInfoResponse userInfo = userService.getUserInfo(userId);
        return ResponseEntity.ok(userInfo);
    }
    
    @ExceptionHandler(UserNotFoundException.class)
    public ResponseEntity<UserInfoResponse> handleUserNotFound(UserNotFoundException e) {
        UserInfoResponse response = UserInfoResponse.builder()
                .success(false)
                .message(e.getMessage())
                .build();
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
    }
}
