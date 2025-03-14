import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import NotificationBell from './NotificationBell';
import { useNotifications } from '../../hooks/useNotifications';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { FaBars } from "react-icons/fa6";
import { FaSearch } from 'react-icons/fa';

const HeaderContainer = styled.header`
  display: flex;
  height: 64px;
  top: 0;
  left: 0;
  right: 0;
  width: 100%;
  display: flex;
  align-items: center;
  padding: 0 20px;
  background: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  z-index: 100;

  @media (max-width: 600px) {
    padding: 0 10px;
    height: 56px;
  }
`;

const Brand = styled.div`
  font-size: 20px;
  font-weight: 600;
  margin-right: auto;
  text-align: left;
`;

const IconsContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const MenuContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  margin-right: 16px;
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

const MenuIcon = styled(IconButton)`
  position: relative;
  display: flex;
`;

const DropdownMenu = styled.div<{ isOpen: boolean }>`
  position: absolute;
  top: 45px;
  right: 0;
  background: white;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border-radius: 4px;
  width: 200px;
  z-index: 150;
  display: ${({ isOpen }) => isOpen ? 'block' : 'none'};
  opacity: ${({ isOpen }) => isOpen ? '1' : '0'};
  transform: ${({ isOpen }) => isOpen ? 'translateY(0)' : 'translateY(-10px)'};
  transition: opacity 0.2s ease, transform 0.2s ease;
`;

const DropdownItem = styled.button`
  width: 100%;
  padding: 10px 16px;
  background: none;
  border: none;
  text-align: left;
  font-size: 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  
  &:hover {
    background-color: rgba(0, 0, 0, 0.05);
  }
`;


const Header: React.FC = () => {
  const { notifications, handleNotificationClick, markAsRead } = useNotifications();
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleLoginClick = () => {
    navigate('/login');
  };

  const handleMenuItemClick = (path: string) => {
    navigate(path);
    setMenuOpen(false);
  };
  
  // Close the menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <HeaderContainer>
      <Brand>Aryshi</Brand>
      
      
      {isAuthenticated ? (
        <IconsContainer>
          <IconButton aria-label="검색">
            <FaSearch />
          </IconButton>
          <NotificationBell
            notifications={notifications}
            onNotificationClick={handleNotificationClick}
            onMarkAsRead={markAsRead}
          />
          <MenuContainer ref={menuRef}>
            <MenuIcon onClick={toggleMenu} aria-label="메뉴">
              <FaBars />
            </MenuIcon>
            <DropdownMenu isOpen={menuOpen}>
              <DropdownItem onClick={() => handleMenuItemClick('/profile')}>프로필</DropdownItem>
              <DropdownItem onClick={() => handleMenuItemClick('/settings')}>설정</DropdownItem>
              <DropdownItem onClick={() => logout()}>로그아웃</DropdownItem>
            </DropdownMenu>
          </MenuContainer>
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
