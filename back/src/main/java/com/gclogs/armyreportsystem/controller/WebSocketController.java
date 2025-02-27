package com.gclogs.armyreportsystem.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

/**
 * WebSocket 메시지 처리를 위한 컨트롤러
 */
@Slf4j
@Controller
@RequiredArgsConstructor
public class WebSocketController {

    /**
     * 클라이언트로부터 메시지를 수신하고 모든 구독자에게 브로드캐스트
     * 클라이언트는 /app/notify로 메시지를 보내고 /topic/notifications를 구독합니다.
     */
    @MessageMapping("/notify")
    @SendTo("/topic/notifications")
    public String broadcastNotification(String message) {
        log.info("Received notification message: {}", message);
        return message;
    }
}
