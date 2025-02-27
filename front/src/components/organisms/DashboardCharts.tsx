import React from 'react';
import styled from 'styled-components';
import { ReportStatistics } from '../../schemas/dashboard';

const ChartsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin-bottom: 24px;
`;

const ChartCard = styled.div`
  background: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const ChartTitle = styled.h3`
  margin: 0 0 16px;
  font-size: 16px;
  font-weight: 500;
  color: #666;
`;

const BarChart = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const BarGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const BarLabel = styled.span`
  width: 80px;
  font-size: 14px;
  color: #666;
`;

const BarValue = styled.span`
  width: 40px;
  font-size: 14px;
  color: #333;
  text-align: right;
`;

const Bar = styled.div<{ value: number; color: string }>`
  flex: 1;
  height: 24px;
  background: ${props => props.color}20;
  border-radius: 4px;
  overflow: hidden;

  &::after {
    content: '';
    display: block;
    width: ${props => props.value}%;
    height: 100%;
    background: ${props => props.color};
    transition: width 0.3s ease;
  }
`;

interface DashboardChartsProps {
  statistics: ReportStatistics;
}

const statusColors = {
  new: '#007AFF',
  in_progress: '#FF9500',
  resolved: '#34C759',
  rejected: '#FF3B30',
};

const priorityColors = {
  urgent: '#FF3B30',
  high: '#FF9500',
  medium: '#FFD60A',
  low: '#34C759',
};

const DashboardCharts: React.FC<DashboardChartsProps> = ({ statistics }) => {
  const totalByStatus = Object.values(statistics.byStatus).reduce((a, b) => a + b, 0);
  const totalByPriority = Object.values(statistics.byPriority).reduce((a, b) => a + b, 0);

  return (
    <ChartsContainer>
      <ChartCard>
        <ChartTitle>보고서 상태</ChartTitle>
        <BarChart>
          {Object.entries(statistics.byStatus).map(([status, count]) => (
            <BarGroup key={status}>
              <BarLabel>
                {status === 'new' && '신규'}
                {status === 'in_progress' && '진행중'}
                {status === 'resolved' && '해결됨'}
                {status === 'rejected' && '반려'}
              </BarLabel>
              <Bar
                value={(count / totalByStatus) * 100}
                color={statusColors[status as keyof typeof statusColors]}
              />
              <BarValue>{count}</BarValue>
            </BarGroup>
          ))}
        </BarChart>
      </ChartCard>

      <ChartCard>
        <ChartTitle>우선순위 분포</ChartTitle>
        <BarChart>
          {Object.entries(statistics.byPriority).map(([priority, count]) => (
            <BarGroup key={priority}>
              <BarLabel>
                {priority === 'urgent' && '긴급'}
                {priority === 'high' && '높음'}
                {priority === 'medium' && '중간'}
                {priority === 'low' && '낮음'}
              </BarLabel>
              <Bar
                value={(count / totalByPriority) * 100}
                color={priorityColors[priority as keyof typeof priorityColors]}
              />
              <BarValue>{count}</BarValue>
            </BarGroup>
          ))}
        </BarChart>
      </ChartCard>
    </ChartsContainer>
  );
};

export default DashboardCharts;
