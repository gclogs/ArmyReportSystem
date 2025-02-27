import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Notification } from '../schemas/notification';
import { notificationService } from '../services/notification';

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    // 초기 알림 목록 로드
    loadNotifications();

    // 실시간 알림 구독
    const unsubscribe = notificationService.subscribe((notification) => {
      setNotifications(prev => [notification, ...prev]);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const loadNotifications = async () => {
    try {
      const notifications = await notificationService.getNotifications();
      setNotifications(notifications);
    } catch (error) {
      console.error('알림 로드 중 오류:', error);
    }
  };

  const handleNotificationClick = (notification: Notification) => {
    // 알림 종류에 따른 네비게이션 처리
    if (notification.reportId) {
      navigate(`/reports/${notification.reportId}`);
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      await notificationService.markAsRead(notificationId);
      setNotifications(prev =>
        prev.map(n =>
          n.id === notificationId ? { ...n, isRead: true } : n
        )
      );
    } catch (error) {
      console.error('알림 읽음 처리 중 오류:', error);
    }
  };

  return {
    notifications,
    handleNotificationClick,
    markAsRead,
  };
}
