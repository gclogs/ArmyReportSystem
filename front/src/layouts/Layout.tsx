import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';

const LayoutContainer = styled.div`
  display: flex;
  min-height: 100vh;
`;

const Sidebar = styled.nav`
  width: 250px;
  background-color: #1a2236;
  color: white;
  padding: 20px;
`;

const Content = styled.main`
  flex: 1;
  padding: 20px;
  background-color: #f5f6fa;
`;

const Logo = styled.div`
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 40px;
  color: white;
`;

const NavLink = styled(Link)<{ active?: boolean }>`
  display: flex;
  align-items: center;
  padding: 12px 16px;
  color: ${props => props.active ? 'white' : '#a0aec0'};
  text-decoration: none;
  border-radius: 8px;
  margin-bottom: 8px;
  background-color: ${props => props.active ? '#2d3748' : 'transparent'};
  
  &:hover {
    background-color: #2d3748;
    color: white;
  }
`;

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();

  return (
    <LayoutContainer>
      <Sidebar>
        <Logo>군대 보고 시스템</Logo>
        <NavLink to="/" active={location.pathname === '/'}>
          대시보드
        </NavLink>
        <NavLink to="/reports" active={location.pathname === '/reports'}>
          보고서
        </NavLink>
        <NavLink to="/approvals" active={location.pathname === '/approvals'}>
          승인 관리
        </NavLink>
        <NavLink to="/profile" active={location.pathname === '/profile'}>
          프로필
        </NavLink>
        <NavLink to="/settings" active={location.pathname === '/settings'}>
          응애
        </NavLink>
      </Sidebar>
      <Content>
        {children}
      </Content>
    </LayoutContainer>
  );
};

export default Layout;
