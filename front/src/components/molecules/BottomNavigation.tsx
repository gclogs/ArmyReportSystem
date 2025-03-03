import React from 'react';
import styled from 'styled-components';
import { Link, useLocation } from 'react-router-dom';
import { FaHouse, FaFile, FaCheck, FaGear } from 'react-icons/fa6';

const NavContainer = styled.nav`
  height: 56px;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%;
  display: flex;
  justify-content: space-around;
  background: #ffffff;
  border-top: 1px solid #f0f0f0;
  z-index: 100;

  @media (max-width: 600px) {
    height: 48px;
  }
`;

const NavItem = styled(Link)<{ active: boolean }>`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: ${props => props.active ? '#111111' : '#666666'};
  text-decoration: none;
  font-size: 12px;
  gap: 4px;
  transition: color 0.2s;

  svg {
    width: 24px;
    height: 24px;
  }

  &:hover {
    color: #111111;
  }
`;

const NavText = styled.span`
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  font-weight: ${props => props.theme.active ? '500' : '400'};

  @media (max-width: 600px) {
    font-size: 10px;
  }
`;

const BottomNavigation: React.FC = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  const getIconByName = (name: string) => {
    switch(name) {
      case 'home':
        return <FaHouse />;
      case 'report':
        return <FaFile />;
      case 'confirm':
        return <FaCheck />;
      case 'setting':
        return <FaGear />;
      default:
        return <FaHouse />;
    }
  }

  const navItems = [
    { path: '/', icon: 'home', label: '홈' },
    { path: '/reports', icon: 'report', label: '보고서' },
    { path: '/approvals', icon: 'confirm', label: '승인' },
    { path: '/settings', icon: 'setting', label: '설정' }
  ];

  return (
    <NavContainer>
      {navItems.map(item => (
        <NavItem 
          key={item.path} 
          to={item.path} 
          active={currentPath === item.path}
        >
          {getIconByName(item.icon)}
          <NavText>{item.label}</NavText>
        </NavItem>
      ))}
    </NavContainer>
  );
};

export default BottomNavigation;
