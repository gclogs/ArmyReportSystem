import React from 'react';
import styled from 'styled-components';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import DashboardStats from '../components/organisms/DashboardStats';
import DashboardCharts from '../components/organisms/DashboardCharts';
import { ReportList } from '../components/organisms/ReportList';
import type { ReportStatistics, UnitStatistics } from '../schemas/dashboard';
import { Report } from '../schemas/report';

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
  const { user } = useAuth();
  const navigate = useNavigate();

  const { data: reportStats, isLoading: isLoadingReportStats } = useQuery<ReportStatistics>({
    queryKey: ['reportStatistics'],
    queryFn: async () => {
      const response = await fetch('/api/statistics/reports');
      if (!response.ok) throw new Error('통계 데이터 로드 실패');
      return response.json();
    },
  });

  const { data: unitStats, isLoading: isLoadingUnitStats } = useQuery<UnitStatistics>({
    queryKey: ['unitStatistics'],
    queryFn: async () => {
      const response = await fetch('/api/statistics/unit');
      if (!response.ok) throw new Error('부대 통계 로드 실패');
      return response.json();
    },
  });

  const { data: recentReports, isLoading: isLoadingReports } = useQuery({
    queryKey: ['recentReports'],
    queryFn: async () => {
      const response = await fetch('/api/reports/recent');
      if (!response.ok) throw new Error('최근 보고서 로드 실패');
      return response.json();
    },
  });

  const handleReportClick = (report: Report) => {
    navigate(`/reports/${report.id}`);
  };

  if (isLoadingReportStats || isLoadingUnitStats || isLoadingReports) {
    return <div>Loading...</div>;
  }

  return (
    <DashboardContainer>
      <Header>
        <Title>{user?.name}님의 대시보드</Title>
        <Subtitle>
          {user?.role === 'OFFICER' ? '부대 현황 및 보고서 관리' : '나의 보고서 현황'}
        </Subtitle>
      </Header>

      {reportStats && unitStats && (
        <>
          <Section>
            <DashboardStats
              reportStats={reportStats}
              unitStats={unitStats}
            />
          </Section>

          {user?.role === 'OFFICER' && (
            <Section>
              <SectionTitle>보고서 통계</SectionTitle>
              <DashboardCharts statistics={reportStats} />
            </Section>
          )}
        </>
      )}

      <Section>
        <SectionTitle>
          {user?.role === 'OFFICER' ? '처리가 필요한 보고서' : '내 보고서 현황'}
        </SectionTitle>
        {recentReports && (
          <ReportList
            reports={recentReports}
            onReportClick={handleReportClick}
          />
        )}
      </Section>
    </DashboardContainer>
  );
};

export default Dashboard;
