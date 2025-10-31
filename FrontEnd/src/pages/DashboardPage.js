import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FiTrendingUp, FiTrendingDown, FiCheckCircle, FiClock, FiUsers, FiFolder, FiAlertCircle, FiActivity } from 'react-icons/fi';

const DashboardContainer = styled.div`
  position: fixed;
  left: 95px;
  top: 10px;
  right: 15px;
  bottom: 10px;
  background-color: #FAFAFA;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
  padding: 30px;
  overflow-y: auto;
`;

const Header = styled.div`
  margin-bottom: 30px;
`;

const Title = styled.h1`
  margin: 0 0 8px 0;
  font-size: 32px;
  font-weight: 600;
  color: #000000;
`;

const Subtitle = styled.p`
  margin: 0;
  font-size: 16px;
  color: #666;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
`;

const StatCard = styled.div`
  background: #FFFFFF;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  transition: transform 0.2s, box-shadow 0.2s;
  position: relative;
  overflow: hidden;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: ${props => props.$color || '#000000'};
  }
`;

const StatHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
`;

const StatIcon = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: ${props => props.$color}15;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.$color};
`;

const StatTitle = styled.h3`
  margin: 0 0 4px 0;
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
  line-height: 1;
`;

const StatChange = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 14px;
  font-weight: 500;
  color: ${props => props.$positive ? '#10B981' : '#EF4444'};
`;

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 20px;
  margin-bottom: 30px;

  @media (max-width: 1200px) {
    grid-template-columns: 1fr;
  }
`;

const Card = styled.div`
  background: #FFFFFF;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
`;

const CardTitle = styled.h3`
  margin: 0 0 20px 0;
  font-size: 18px;
  font-weight: 600;
  color: #000;
`;

const ProjectsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const ProjectItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  background: #FAFAFA;
  border-radius: 12px;
  transition: background 0.2s;

  &:hover {
    background: #F0F0F0;
  }
`;

const ProjectInfo = styled.div`
  flex: 1;
`;

const ProjectName = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: #000;
  margin-bottom: 4px;
`;

const ProjectMeta = styled.div`
  font-size: 12px;
  color: #666;
`;

const ProgressBar = styled.div`
  width: 120px;
  height: 8px;
  background: #E5E7EB;
  border-radius: 4px;
  overflow: hidden;
  margin-left: 16px;
`;

const ProgressFill = styled.div`
  height: 100%;
  background: ${props => props.$color || '#000000'};
  width: ${props => props.$percentage}%;
  transition: width 0.3s ease;
`;

const ActivityList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const ActivityItem = styled.div`
  display: flex;
  gap: 12px;
`;

const ActivityIcon = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: ${props => props.$color}15;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.$color};
  flex-shrink: 0;
`;

const ActivityContent = styled.div`
  flex: 1;
`;

const ActivityText = styled.div`
  font-size: 14px;
  color: #000;
  margin-bottom: 4px;
`;

const ActivityTime = styled.div`
  font-size: 12px;
  color: #999;
`;

const ChartContainer = styled.div`
  background: #FFFFFF;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  margin-bottom: 30px;
`;

const WeekChart = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 8px;
  height: 200px;
  padding: 20px 0;
`;

const ChartBar = styled.div`
  flex: 1;
  background: linear-gradient(180deg, #000000 0%, #333333 100%);
  border-radius: 8px 8px 0 0;
  height: ${props => props.$height}%;
  position: relative;
  transition: all 0.3s ease;
  cursor: pointer;

  &:hover {
    background: linear-gradient(180deg, #333333 0%, #000000 100%);
    transform: translateY(-4px);
  }
`;

const ChartLabel = styled.div`
  text-align: center;
  font-size: 12px;
  color: #666;
  margin-top: 8px;
  font-weight: 500;
`;

const ChartValue = styled.div`
  position: absolute;
  top: -24px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 12px;
  font-weight: 600;
  color: #000;
  white-space: nowrap;
`;

const DashboardPage = () => {
  const [weekData] = useState([
    { day: 'Mon', tasks: 12 },
    { day: 'Tue', tasks: 18 },
    { day: 'Wed', tasks: 15 },
    { day: 'Thu', tasks: 22 },
    { day: 'Fri', tasks: 19 },
    { day: 'Sat', tasks: 8 },
    { day: 'Sun', tasks: 5 },
  ]);

  const maxTasks = Math.max(...weekData.map(d => d.tasks));

  const recentProjects = [
    { name: 'Website Redesign', tasks: '6/10', progress: 60, color: '#FF6B6B' },
    { name: 'Mobile App Development', tasks: '2/15', progress: 13, color: '#4ECDC4' },
    { name: 'API Integration', tasks: '15/20', progress: 75, color: '#95E1D3' },
    { name: 'Database Migration', tasks: '7/12', progress: 58, color: '#FFD93D' },
  ];

  const recentActivity = [
    { 
      icon: FiCheckCircle, 
      color: '#10B981', 
      text: 'Task "Update Homepage Design" completed',
      time: '5 minutes ago'
    },
    { 
      icon: FiUsers, 
      color: '#3B82F6', 
      text: 'Sarah joined "Mobile App Development"',
      time: '23 minutes ago'
    },
    { 
      icon: FiAlertCircle, 
      color: '#F59E0B', 
      text: 'Deadline approaching for "API Integration"',
      time: '1 hour ago'
    },
    { 
      icon: FiFolder, 
      color: '#8B5CF6', 
      text: 'New project "Security Audit" created',
      time: '2 hours ago'
    },
    { 
      icon: FiActivity, 
      color: '#EC4899', 
      text: '15 tasks updated across 3 projects',
      time: '3 hours ago'
    },
  ];

  return (
    <DashboardContainer>
      <Header>
        <Title>Dashboard</Title>
        <Subtitle>Welcome back! Here's what's happening with your projects today.</Subtitle>
      </Header>

      <StatsGrid>
        <StatCard $color="#6366F1">
          <StatHeader>
            <div>
              <StatTitle>Total Projects</StatTitle>
              <StatValue>9</StatValue>
              <StatChange $positive>
                <FiTrendingUp size={16} />
                +2 this month
              </StatChange>
            </div>
            <StatIcon $color="#6366F1">
              <FiFolder size={24} />
            </StatIcon>
          </StatHeader>
        </StatCard>

        <StatCard $color="#10B981">
          <StatHeader>
            <div>
              <StatTitle>Tasks Completed</StatTitle>
              <StatValue>68</StatValue>
              <StatChange $positive>
                <FiTrendingUp size={16} />
                +12 this week
              </StatChange>
            </div>
            <StatIcon $color="#10B981">
              <FiCheckCircle size={24} />
            </StatIcon>
          </StatHeader>
        </StatCard>

        <StatCard $color="#F59E0B">
          <StatHeader>
            <div>
              <StatTitle>In Progress</StatTitle>
              <StatValue>45</StatValue>
              <StatChange>
                <FiClock size={16} />
                Across 5 projects
              </StatChange>
            </div>
            <StatIcon $color="#F59E0B">
              <FiClock size={24} />
            </StatIcon>
          </StatHeader>
        </StatCard>

        <StatCard $color="#8B5CF6">
          <StatHeader>
            <div>
              <StatTitle>Team Members</StatTitle>
              <StatValue>24</StatValue>
              <StatChange $positive>
                <FiTrendingUp size={16} />
                +3 new members
              </StatChange>
            </div>
            <StatIcon $color="#8B5CF6">
              <FiUsers size={24} />
            </StatIcon>
          </StatHeader>
        </StatCard>
      </StatsGrid>

      <ChartContainer>
        <CardTitle>Tasks Completed This Week</CardTitle>
        <WeekChart>
          {weekData.map((data, index) => (
            <div key={index} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <ChartBar $height={(data.tasks / maxTasks) * 100}>
                <ChartValue>{data.tasks}</ChartValue>
              </ChartBar>
              <ChartLabel>{data.day}</ChartLabel>
            </div>
          ))}
        </WeekChart>
      </ChartContainer>

      <ContentGrid>
        <Card>
          <CardTitle>Active Projects</CardTitle>
          <ProjectsList>
            {recentProjects.map((project, index) => (
              <ProjectItem key={index}>
                <ProjectInfo>
                  <ProjectName>{project.name}</ProjectName>
                  <ProjectMeta>{project.tasks} tasks completed</ProjectMeta>
                </ProjectInfo>
                <ProgressBar>
                  <ProgressFill $percentage={project.progress} $color={project.color} />
                </ProgressBar>
              </ProjectItem>
            ))}
          </ProjectsList>
        </Card>

        <Card>
          <CardTitle>Recent Activity</CardTitle>
          <ActivityList>
            {recentActivity.map((activity, index) => (
              <ActivityItem key={index}>
                <ActivityIcon $color={activity.color}>
                  <activity.icon size={18} />
                </ActivityIcon>
                <ActivityContent>
                  <ActivityText>{activity.text}</ActivityText>
                  <ActivityTime>{activity.time}</ActivityTime>
                </ActivityContent>
              </ActivityItem>
            ))}
          </ActivityList>
        </Card>
      </ContentGrid>
    </DashboardContainer>
  );
};

export default DashboardPage;
