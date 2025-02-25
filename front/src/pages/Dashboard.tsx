import React from 'react';
import styled from 'styled-components';

const DashboardContainer = styled.div`
  padding: 20px;
`;

const Header = styled.div`
  margin-bottom: 30px;
`;

const Title = styled.h1`
  font-size: 24px;
  color: #1a2236;
  margin-bottom: 10px;
`;

const Subtitle = styled.p`
  color: #64748b;
  font-size: 16px;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
`;

const Card = styled.div`
  background: white;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
`;

const CardTitle = styled.h3`
  font-size: 16px;
  color: #64748b;
  margin-bottom: 10px;
`;

const CardValue = styled.div`
  font-size: 24px;
  font-weight: bold;
  color: #1a2236;
`;

const Dashboard: React.FC = () => {
  return (
    <DashboardContainer>
      <Header>
        <Title>대시보드</Title>
        <Subtitle>오늘의 보고서 현황을 확인하세요</Subtitle>
      </Header>

      <Grid>
        <Card>
          <CardTitle>대기 중인 보고서</CardTitle>
          <CardValue>12</CardValue>
        </Card>
        <Card>
          <CardTitle>승인된 보고서</CardTitle>
          <CardValue>45</CardValue>
        </Card>
        <Card>
          <CardTitle>반려된 보고서</CardTitle>
          <CardValue>3</CardValue>
        </Card>
        <Card>
          <CardTitle>총 보고서</CardTitle>
          <CardValue>60</CardValue>
        </Card>
      </Grid>

      {/* 추가적인 대시보드 컴포넌트들을 여기에 추가할 수 있습니다 */}
    </DashboardContainer>
  );
};

export default Dashboard;
