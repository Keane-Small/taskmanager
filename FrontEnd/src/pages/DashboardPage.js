import React from 'react';
import styled from 'styled-components';

const DashboardContainer = styled.div`
  width: 100%;
  height: 100%;
  padding: 0;
  background-color: transparent;
`;

const DashboardContent = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  padding: 20px;
`;

const StatCard = styled.div`
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: transform 0.2s, box-shadow 0.2s;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
  }
`;

const StatTitle = styled.h3`
  margin: 0 0 12px 0;
  font-size: 14px;
  font-weight: 500;
  color: #666;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const StatValue = styled.div`
  font-size: 36px;
  font-weight: 700;
  color: #000;
  margin-bottom: 8px;
`;

const StatSubtext = styled.p`
  margin: 0;
  font-size: 14px;
  color: #999;
`;

const ChartContainer = styled.div`
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  grid-column: span 2;
  min-height: 300px;
`;

const ChartTitle = styled.h3`
  margin: 0 0 20px 0;
  font-size: 18px;
  font-weight: 600;
  color: #000;
`;

const DashboardPage = () => {
  return (
    <DashboardContainer>
      <DashboardContent>
        <StatCard>
          <StatTitle>Total Projects</StatTitle>
          <StatValue>9</StatValue>
          <StatSubtext>3 active, 6 completed</StatSubtext>
        </StatCard>

        <StatCard>
          <StatTitle>Total Tasks</StatTitle>
          <StatValue>113</StatValue>
          <StatSubtext>45 in progress, 68 completed</StatSubtext>
        </StatCard>

        <StatCard>
          <StatTitle>Team Members</StatTitle>
          <StatValue>24</StatValue>
          <StatSubtext>All active</StatSubtext>
        </StatCard>

        <StatCard>
          <StatTitle>Completion Rate</StatTitle>
          <StatValue>68%</StatValue>
          <StatSubtext>+5% from last week</StatSubtext>
        </StatCard>

        <ChartContainer>
          <ChartTitle>Project Activity</ChartTitle>
          <StatSubtext>Activity chart coming soon...</StatSubtext>
        </ChartContainer>
      </DashboardContent>
    </DashboardContainer>
  );
};

export default DashboardPage;
