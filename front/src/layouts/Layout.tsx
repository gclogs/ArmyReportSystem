import React from 'react';
import styled from 'styled-components';
import Header from '../components/molecules/Header';
import BottomNavigation from '../components/molecules/BottomNavigation';

const LayoutContainer = styled.div`
  min-height: 100vh;
  background-color: #ffffff;
`;

const Main = styled.main`
  padding: 64px 0 56px;
  min-height: calc(100vh - 120px);
`;

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <LayoutContainer>
      <Header />
      <Main>{children}</Main>
      <BottomNavigation />
    </LayoutContainer>
  );
};

export default Layout;
