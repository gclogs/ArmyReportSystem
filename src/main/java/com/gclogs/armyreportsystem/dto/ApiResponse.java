package com.gclogs.armyreportsystem.dto;

import java.time.LocalDateTime;

import lombok.Getter;

@Getter
@Builder
public class ApiResponse<T> {
    private final boolean success;
    private final String message;
    private final T data;
    private final LocalDateTime timestamp;
    private final String requestId;  // 요청 추적을 위한 고유 ID
}