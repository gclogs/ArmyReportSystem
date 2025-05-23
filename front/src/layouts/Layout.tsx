import React from 'react';
import styled from 'styled-components';
import { Outlet } from 'react-router-dom';
import Header from '../components/common/Header';
import HomeTab from '../components/home/HomeTab';

const LayoutContainer = styled.div`
  width: 100%;
  background-color: #ffffff;
`;

const Main = styled.main`
  min-height: calc(100vh - 120px);

  @media (max-width: 600px) {
    padding: 56px 0 48px;
  }
`;

const Layout: React.FC = () => {
  return (
    <LayoutContainer>
      <Header />
      <HomeTab />
      <Main>
        <Outlet />
      </Main>
    </LayoutContainer>
  );
};

export default Layout;
