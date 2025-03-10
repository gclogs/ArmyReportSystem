import React from 'react';
import styled from 'styled-components';
import { Notification } from '../../schemas/notification';

const BellContainer = styled.button`
  position: relative;
  padding: 8px;
  background: none;
  border: none;
  cursor: pointer;
  color: inherit;
`;

const Badge = styled.span`
  position: absolute;
  top: 0;
  right: 0;
  background: #FF3B30;
  color: white;
  border-radius: 50%;
  width: 18px;
  height: 18px;
  font-size: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const NotificationPanel = styled.div<{ isOpen: boolean }>`
  position: absolute;
  top: 100%;
  right: 0;
  width: 320px;
  max-height: 400px;
  overflow-y: auto;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  display: ${props => props.isOpen ? 'block' : 'none'};
  z-index: 1000;
`;

const NotificationList = styled.div`
  display: flex;
  flex-direction: column;
`;

const NotificationItem = styled.div<{ isRead: boolean }>`
  padding: 12px 16px;
  border-bottom: 1px solid #f0f0f0;
  background: ${props => props.isRead ? 'white' : '#f8f9fa'};
  cursor: pointer;

  &:hover {
    background: #f5f5f5;
  }

  &:last-child {
    border-bottom: none;
  }
`;

const NotificationTitle = styled.div`
  font-weight: 500;
  margin-bottom: 4px;
`;

const NotificationMessage = styled.div`
  font-size: 14px;
  color: #666;
`;

const NotificationTime = styled.div`
  font-size: 12px;
  color: #999;
  margin-top: 4px;
`;

interface NotificationBellProps {
  notifications: Notification[];
  onNotificationClick: (notification: Notification) => void;
  onMarkAsRead: (notificationId: string) => void;
}

const NotificationBell: React.FC<NotificationBellProps> = ({
  notifications,
  onNotificationClick,
  onMarkAsRead,
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const unreadCount = notifications.filter(n => !n.isRead).length;

  const handleNotificationClick = (notification: Notification) => {
    onNotificationClick(notification);
    onMarkAsRead(notification.id);
    setIsOpen(false);
  };

  return (
    <BellContainer onClick={() => setIsOpen(!isOpen)}>
      알림
      {unreadCount > 0 && <Badge>{unreadCount}</Badge>}
      <NotificationPanel isOpen={isOpen}>
        <NotificationList>
          {notifications.length === 0 ? (
            <NotificationItem isRead={true}>
              <NotificationMessage>새로운 알림이 없습니다.</NotificationMessage>
            </NotificationItem>
          ) : (
            notifications.map(notification => (
              <NotificationItem
                key={notification.id}
                isRead={notification.isRead}
                onClick={() => handleNotificationClick(notification)}
              >
                <NotificationTitle>{notification.title}</NotificationTitle>
                <NotificationMessage>{notification.message}</NotificationMessage>
                <NotificationTime>
                  {new Date(notification.createdAt).toLocaleString()}
                </NotificationTime>
              </NotificationItem>
            ))
          )}
        </NotificationList>
      </NotificationPanel>
    </BellContainer>
  );
};

export default NotificationBell;
