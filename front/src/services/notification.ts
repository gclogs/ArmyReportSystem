import type { Notification } from '../schemas/notification';

class NotificationService {
  private socket: WebSocket | null = null;
  private handlers: ((notification: Notification) => void)[] = [];
  private reconnectTimeout: number | null = null;

  constructor() {
    this.initializeWebSocket();
    this.requestNotificationPermission();
  }

  private initializeWebSocket() {
    // WebSocket 서버 URL을 환경 변수에서 가져오거나 기본값 사용
    const wsUrl = import.meta.env.VITE_WS_URL || 'ws://localhost:8080/ws';
    
    if (this.socket?.readyState === WebSocket.OPEN) {
      return;
    }

    try {
      this.socket = new WebSocket(wsUrl);

      this.socket.onmessage = (event) => {
        try {
          const notification: Notification = JSON.parse(event.data);
          this.handleNotification(notification);
        } catch (error) {
          console.error('알림 메시지 처리 중 오류:', error);
        }
      };

      this.socket.onclose = () => {
        // 연결이 끊어지면 3초 후 재연결 시도
        if (this.reconnectTimeout) {
          clearTimeout(this.reconnectTimeout);
        }
        this.reconnectTimeout = window.setTimeout(() => {
          this.initializeWebSocket();
        }, 3000);
      };

      this.socket.onerror = (error) => {
        console.error('WebSocket 오류:', error);
      };
    } catch (error) {
      console.error('WebSocket 연결 중 오류:', error);
      // 연결 실패 시 재시도
      if (this.reconnectTimeout) {
        clearTimeout(this.reconnectTimeout);
      }
      this.reconnectTimeout = window.setTimeout(() => {
        this.initializeWebSocket();
      }, 3000);
    }
  }

  private async requestNotificationPermission() {
    if (!('Notification' in window)) {
      console.log('이 브라우저는 알림을 지원하지 않습니다.');
      return;
    }

    try {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        console.log('알림 권한이 허용되었습니다.');
      }
    } catch (error) {
      console.error('알림 권한 요청 중 오류:', error);
    }
  }

  private handleNotification(notification: Notification) {
    // 브라우저 알림 표시
    if (Notification.permission === 'granted' && document.hidden) {
      new Notification(notification.title, {
        body: notification.message,
        icon: '/logo192.png', // PWA 아이콘 사용
      });
    }

    // 등록된 핸들러들에게 알림
    this.handlers.forEach(handler => {
      try {
        handler(notification);
      } catch (error) {
        console.error('알림 핸들러 실행 중 오류:', error);
      }
    });
  }

  public subscribe(handler: (notification: Notification) => void) {
    this.handlers.push(handler);
    return () => {
      this.handlers = this.handlers.filter(h => h !== handler);
    };
  }

  public async markAsRead(notificationId: string): Promise<void> {
    try {
      const response = await fetch(`/api/notifications/${notificationId}/read`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('알림 읽음 처리 실패');
      }
    } catch (error) {
      console.error('알림 읽음 처리 중 오류:', error);
      throw error;
    }
  }

  public async getNotifications(): Promise<Notification[]> {
    try {
      const response = await fetch('/api/notifications');
      if (!response.ok) {
        throw new Error('알림 목록 조회 실패');
      }
      return await response.json();
    } catch (error) {
      console.error('알림 목록 조회 중 오류:', error);
      throw error;
    }
  }

  public disconnect() {
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
  }
}

// 싱글톤 인스턴스 생성
export const notificationService = new NotificationService();
