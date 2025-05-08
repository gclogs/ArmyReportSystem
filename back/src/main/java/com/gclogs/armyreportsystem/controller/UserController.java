package com.gclogs.armyreportsystem.controller;

import com.gclogs.armyreportsystem.dto.UserInfoResponse;
import com.gclogs.armyreportsystem.exception.UserNotFoundException;
import com.gclogs.armyreportsystem.service.UserService;
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
