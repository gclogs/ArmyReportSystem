import React from 'react';
import styled from 'styled-components';
import { ReportStatistics, UnitStatistics } from '../../schemas/dashboard';

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 20px;
  margin-bottom: 24px;
`;

const StatCard = styled.div`
  background: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const StatTitle = styled.h3`
  margin: 0 0 8px;
  font-size: 14px;
  color: #666;
`;

const StatValue = styled.div`
  font-size: 24px;
  font-weight: 600;
  color: #111;
`;

const StatSubValue = styled.div`
  font-size: 14px;
  color: #666;
  margin-top: 4px;
`;

const ProgressBar = styled.div<{ value: number }>`
  width: 100%;
  height: 4px;
  background: #f0f0f0;
  border-radius: 2px;
  margin-top: 8px;
  overflow: hidden;

  &::after {
    content: '';
    display: block;
    width: ${props => Math.min(Math.max(props.value, 0), 100)}%;
    height: 100%;
    background: #007AFF;
    transition: width 0.3s ease;
  }
`;

interface DashboardStatsProps {
  reportStats: ReportStatistics;
  unitStats: UnitStatistics;
}

const DashboardStats: React.FC<DashboardStatsProps> = ({
  reportStats,
  unitStats,
}) => {
  // 기본값 설정
  const defaultStats = {
    byStatus: {
      new: 0,
      in_progress: 0,
      resolved: 0,
      rejected: 0,
    },
    byPriority: {
      urgent: 0,
      high: 0,
      medium: 0,
      low: 0,
    },
  };

  // 실제 통계와 기본값 병합
  const stats = {
    ...defaultStats,
    ...reportStats,
    byStatus: { ...defaultStats.byStatus, ...reportStats.byStatus },
    byPriority: { ...defaultStats.byPriority, ...reportStats.byPriority },
  };

  const totalReports = stats.total || Object.values(stats.byStatus).reduce((sum, count) => sum + count, 0);
  const urgentCount = stats.byPriority.urgent;
  const urgentPercentage = totalReports > 0 ? (urgentCount / totalReports) * 100 : 0;

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}시간 ${remainingMinutes}분`;
  };

  return (
    <StatsGrid>
      <StatCard>
        <StatTitle>전체 보고서</StatTitle>
        <StatValue>{totalReports}</StatValue>
        <StatSubValue>
          진행중: {stats.byStatus.in_progress}
          {' · '}
          해결됨: {stats.byStatus.resolved}
        </StatSubValue>
      </StatCard>

      <StatCard>
        <StatTitle>긴급 보고서</StatTitle>
        <StatValue>{urgentCount}</StatValue>
        <StatSubValue>
          전체의 {urgentPercentage.toFixed(1)}%
        </StatSubValue>
      </StatCard>

      <StatCard>
        <StatTitle>평균 처리 시간</StatTitle>
        <StatValue>
          {formatDuration(stats.averageResolutionTime || 0)}
        </StatValue>
      </StatCard>

      <StatCard>
        <StatTitle>부대 응답률</StatTitle>
        <StatValue>{(unitStats.responseRate * 100).toFixed(1)}%</StatValue>
        <ProgressBar value={unitStats.responseRate * 100} />
      </StatCard>
    </StatsGrid>
  );
};

export default DashboardStats;
