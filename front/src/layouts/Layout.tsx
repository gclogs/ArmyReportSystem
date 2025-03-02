import React from 'react';
import styled from 'styled-components';
import { Outlet } from 'react-router-dom';
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

const Layout: React.FC = () => {
  return (
    <LayoutContainer>
      <Header />
      <Main>
        <Outlet />
      </Main>
      <BottomNavigation />
    </LayoutContainer>
  );
};

export default Layout;
