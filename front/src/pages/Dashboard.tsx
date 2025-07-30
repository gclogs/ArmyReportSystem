import React from 'react';
import styled from 'styled-components';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import DashboardStats from '../components/dashboards/DashboardStats';
import DashboardCharts from '../components/dashboards/DashboardCharts';
import { ReportList } from '../components/reports/ReportList';
import type { ReportStatistics, UnitStatistics } from '../schemas/dashboard';
import { Report } from '../schemas/report';
import useAuthStore from '../stores/authStore';

const DashboardContainer = styled.div`
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;
`;

const Header = styled.div`
  margin-bottom: 24px;
`;

const Title = styled.h1`
  margin: 0;
  font-size: 24px;
  font-weight: 600;
`;

const Subtitle = styled.p`
  margin: 8px 0 0;
  color: #666;
`;

const Section = styled.section`
  margin-bottom: 32px;
`;

const SectionTitle = styled.h2`
  margin: 0 0 16px;
  font-size: 18px;
  font-weight: 600;
`;

const Dashboard: React.FC = () => {
  const { user } = useAuthStore();

  return (
    <DashboardContainer>
      <Header>
        <Title>이름: {user?.name}님의 대시보드</Title>
        <h3>{user?.rank} {user?.unitName}</h3>
        <Subtitle>나의 보고서 목록</Subtitle>
      </Header>
    </DashboardContainer>
  );
};

export default Dashboard;
