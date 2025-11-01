import React from 'react';
import styled from 'styled-components';
import ProjectHealthCard from '../components/ProjectHealthCard';
import TimeComparisonWidget from '../components/TimeComparisonWidget';

const DashboardContainer = styled.div`
  width: 100%;
  height: 100%;
  padding: 0;
  background-color: transparent;
  margin-top: -2rem;
  margin-left: -2rem;
`;

const DashboardContent = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  padding: 0;
`;

const ProjectHealthSection = styled.div`
  grid-column: 1 / -1;
  margin-bottom: 20px;
`;

const SectionTitle = styled.h2`
  margin: 0 0 20px 0;
  font-size: 24px;
  font-weight: 700;
  color: #ffffff;
`;

const ProjectHealthGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
`;

const StatCard = styled.div`
  background: #DAF1DE;
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
  background: linear-gradient(135deg, #235347 0%, #8EB69B 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 8px;
`;

const StatSubtext = styled.p`
  margin: 0;
  font-size: 14px;
  color: #999;
`;

const ChartContainer = styled.div`
  background: #DAF1DE;
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
  color: #0B2B26;
`;

const DashboardPage = () => {
  // Sample project data
  const projects = [
    {
      name: 'Website Redesign',
      status: 'On Track',
      completionPercentage: 75,
      nextDeadline: '2025-11-15'
    },
    {
      name: 'Mobile App Development',
      status: 'At Risk',
      completionPercentage: 45,
      nextDeadline: '2025-11-10'
    },
    {
      name: 'Marketing Campaign',
      status: 'Behind Schedule',
      completionPercentage: 30,
      nextDeadline: '2025-11-08'
    }
  ];

  return (
    <DashboardContainer>
      <DashboardContent>
        <ProjectHealthSection>
          <SectionTitle>Project Health Overview</SectionTitle>
          <ProjectHealthGrid>
            {projects.map((project, index) => (
              <ProjectHealthCard
                key={index}
                projectName={project.name}
                status={project.status}
                completionPercentage={project.completionPercentage}
                nextDeadline={project.nextDeadline}
              />
            ))}
          </ProjectHealthGrid>
        </ProjectHealthSection>

        <TimeComparisonWidget plannedHours={40} actualHours={38} />

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
