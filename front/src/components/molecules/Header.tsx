import React from 'react';
import styled from 'styled-components';
import NotificationBell from './NotificationBell';
import { useNotifications } from '../../hooks/useNotifications';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const HeaderContainer = styled.header`
  height: 64px;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  background: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  z-index: 100;
`;

const Brand = styled.div`
  font-size: 20px;
  font-weight: 600;
`;

const IconsContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const IconButton = styled.button`
  padding: 8px;
  background: none;
  border: none;
  cursor: pointer;
  color: inherit;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  transition: background-color 0.2s;

  &:hover {
    background-color: rgba(0, 0, 0, 0.05);
  }

  &:active {
    background-color: rgba(0, 0, 0, 0.1);
  }
`;

const LoginButton = styled(IconButton)`
  padding: 8px 16px;
  background-color: #4CAF50;
  color: white;
  border-radius: 4px;
  font-weight: 500;

  &:hover {
    background-color: #45a049;
  }
`;

const Header: React.FC = () => {
  const { notifications, handleNotificationClick, markAsRead } = useNotifications();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate('/login');
  };

  return (
    <HeaderContainer>
      <Brand>군대보고체계</Brand>
      {isAuthenticated ? (
        <IconsContainer>
          <IconButton aria-label="검색">
            검색
          </IconButton>
          <NotificationBell
            notifications={notifications}
            onNotificationClick={handleNotificationClick}
            onMarkAsRead={markAsRead}
          />
          <IconButton aria-label="프로필">
            프로필
          </IconButton>
        </IconsContainer>
      ) : (
        <IconsContainer>
          <LoginButton onClick={handleLoginClick}>
            로그인
          </LoginButton>
        </IconsContainer>
      )}
    </HeaderContainer>
  );
};

export default Header;
