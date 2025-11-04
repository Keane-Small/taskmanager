import React from 'react';
import styled from 'styled-components';
import { FiArrowRight, FiMoreVertical, FiUsers, FiTrendingUp, FiClock } from 'react-icons/fi';
import { motion } from 'framer-motion';

const DashboardContainer = styled.div`
  position: fixed;
  left: 100px;
  top: 95px;
  right: 20px;
  bottom: 15px;
  background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
  border-radius: 20px;
  padding: 30px;
  overflow-y: auto;
  color: white;

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.2);
    border-radius: 4px;
  }
`;

const DashboardGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 380px;
  gap: 24px;
  height: 100%;

  @media (max-width: 1200px) {
    grid-template-columns: 1fr;
  }
`;

const LeftColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const RightColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`;

const SectionTitle = styled.h2`
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  color: white;
`;

const ViewAll = styled.button`
  background: transparent;
  border: none;
  color: rgba(255, 255, 255, 0.6);
  cursor: pointer;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: color 0.2s;

  &:hover {
    color: white;
  }
`;

const UrgentTasksContainer = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  padding: 20px;
  backdrop-filter: blur(10px);
`;

const TaskCard = styled(motion.div)`
  background: ${props => props.$color || 'rgba(255, 255, 255, 0.1)'};
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 12px;
  cursor: pointer;
  position: relative;
  transition: transform 0.2s;

  &:hover {
    transform: translateX(4px);
  }

  &:last-child {
    margin-bottom: 0;
  }
`;

const TaskHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
`;

const TaskTime = styled.div`
  font-size: 12px;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 8px;
`;

const TaskTitle = styled.h3`
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: ${props => props.$textColor || 'rgba(0, 0, 0, 0.9)'};
`;

const TaskDetails = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin-top: 12px;
  flex-wrap: wrap;
`;

const TaskMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: ${props => props.$textColor || 'rgba(0, 0, 0, 0.7)'};
`;

const StatusBadge = styled.span`
  background: ${props => props.$bg || 'rgba(0, 0, 0, 0.2)'};
  color: ${props => props.$color || 'rgba(0, 0, 0, 0.9)'};
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 600;
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 6px;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 3px;
  overflow: hidden;
  margin-top: 12px;
`;

const ProgressFill = styled.div`
  height: 100%;
  width: ${props => props.$progress || 0}%;
  background: rgba(0, 0, 0, 0.4);
  border-radius: 3px;
  transition: width 0.3s ease;
`;

const MoreButton = styled.button`
  background: transparent;
  border: none;
  color: rgba(0, 0, 0, 0.6);
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  transition: background 0.2s;

  &:hover {
    background: rgba(0, 0, 0, 0.1);
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-bottom: 24px;
`;

const StatCard = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  padding: 20px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

const StatValue = styled.div`
  font-size: 32px;
  font-weight: 700;
  color: white;
  margin-bottom: 4px;
`;

const StatLabel = styled.div`
  font-size: 13px;
  color: rgba(255, 255, 255, 0.6);
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const TaskStatistics = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  padding: 24px;
  backdrop-filter: blur(10px);
`;

const DonutContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 40px;
  margin: 30px 0;
`;

const DonutChart = styled.div`
  position: relative;
  width: 160px;
  height: 160px;
`;

const DonutCircle = styled.svg`
  transform: rotate(-90deg);
`;

const DonutCenter = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
`;

const DonutValue = styled.div`
  font-size: 36px;
  font-weight: 700;
  color: white;
`;

const DonutLabel = styled.div`
  font-size: 12px;
  color: rgba(255, 255, 255, 0.6);
`;

const StatsList = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  margin-top: 20px;
`;

const StatItem = styled.div`
  text-align: center;
`;

const StatItemValue = styled.div`
  font-size: 24px;
  font-weight: 700;
  color: white;
  margin-bottom: 4px;
`;

const StatItemLabel = styled.div`
  font-size: 11px;
  color: rgba(255, 255, 255, 0.5);
  text-transform: uppercase;
`;

const AvatarGroup = styled.div`
  display: flex;
  align-items: center;
  margin-left: auto;
`;

const Avatar = styled.div`
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: ${props => props.$color || '#888'};
  border: 2px solid ${props => props.$borderColor || 'transparent'};
  margin-left: -8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  font-weight: 600;
  color: white;

  &:first-child {
    margin-left: 0;
  }
`;

const DashboardPage = () => {
  const urgentTasks = [
    {
      time: '9:00 - 13:00',
      title: 'Design System',
      members: 3,
      status: 'In progress',
      progress: 67,
      color: 'linear-gradient(135deg, #ff8a80 0%, #ff6e65 100%)',
      textColor: '#000',
      statusColor: '#000',
    },
    {
      time: '14:30 - 18:00',
      title: 'Designers Meeting',
      members: 5,
      description: 'A weekly call with the team\'s designers',
      color: 'linear-gradient(135deg, #b388ff 0%, #9575cd 100%)',
      textColor: '#fff',
      statusColor: '#fff',
    },
    {
      time: '17:00 - 19:00',
      title: 'Make Report',
      revenue: '$28,430.60',
      people: 19,
      tasks: 81,
      color: 'linear-gradient(135deg, #80deea 0%, #4dd0e1 100%)',
      textColor: '#000',
      statusColor: '#000',
    },
    {
      time: '18:20 - 19:16',
      title: 'Load Planning',
      members: 2,
      status: 'All with link',
      color: 'linear-gradient(135deg, #69f0ae 0%, #00e676 100%)',
      textColor: '#000',
      statusColor: '#000',
    }
  ];

  return (
    <DashboardContainer>
      <DashboardGrid>
        <LeftColumn>
          <StatsGrid>
            <StatCard>
              <StatValue>75%</StatValue>
              <StatLabel>Completed Tasks</StatLabel>
            </StatCard>
            <StatCard>
              <StatValue>25%</StatValue>
              <StatLabel>Unfinished Tasks</StatLabel>
            </StatCard>
            <StatCard>
              <StatValue>32</StatValue>
              <StatLabel>Total Projects</StatLabel>
            </StatCard>
          </StatsGrid>

          <TaskStatistics>
            <SectionTitle>Task Statistics</SectionTitle>
            <DonutContainer>
              <DonutChart>
                <DonutCircle width="160" height="160" viewBox="0 0 160 160">
                  <circle
                    cx="80"
                    cy="80"
                    r="60"
                    fill="none"
                    stroke="rgba(255, 255, 255, 0.1)"
                    strokeWidth="20"
                  />
                  <circle
                    cx="80"
                    cy="80"
                    r="60"
                    fill="none"
                    stroke="#69f0ae"
                    strokeWidth="20"
                    strokeDasharray={`${2 * Math.PI * 60 * 0.75} ${2 * Math.PI * 60}`}
                    strokeLinecap="round"
                  />
                </DonutCircle>
                <DonutCenter>
                  <DonutValue>75%</DonutValue>
                  <DonutLabel>Complete</DonutLabel>
                </DonutCenter>
              </DonutChart>
              <div>
                <DonutChart style={{ width: '120px', height: '120px' }}>
                  <DonutCircle width="120" height="120" viewBox="0 0 120 120">
                    <circle
                      cx="60"
                      cy="60"
                      r="45"
                      fill="none"
                      stroke="rgba(255, 255, 255, 0.1)"
                      strokeWidth="15"
                    />
                    <circle
                      cx="60"
                      cy="60"
                      r="45"
                      fill="none"
                      stroke="#ff8a80"
                      strokeWidth="15"
                      strokeDasharray={`${2 * Math.PI * 45 * 0.25} ${2 * Math.PI * 45}`}
                      strokeLinecap="round"
                    />
                  </DonutCircle>
                  <DonutCenter>
                    <DonutValue style={{ fontSize: '28px' }}>25%</DonutValue>
                    <DonutLabel>Incomplete</DonutLabel>
                  </DonutCenter>
                </DonutChart>
              </div>
            </DonutContainer>
            <StatsList>
              <StatItem>
                <StatItemValue>170</StatItemValue>
                <StatItemLabel>🎨 Design</StatItemLabel>
              </StatItem>
              <StatItem>
                <StatItemValue>87</StatItemValue>
                <StatItemLabel>💼 Business</StatItemLabel>
              </StatItem>
            </StatsList>
          </TaskStatistics>
        </LeftColumn>

        <RightColumn>
          <UrgentTasksContainer>
            <SectionHeader>
              <SectionTitle>Urgent Tasks (5)</SectionTitle>
            </SectionHeader>
            
            {urgentTasks.map((task, index) => (
              <TaskCard
                key={index}
                $color={task.color}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <TaskHeader>
                  <div>
                    <TaskTime style={{ color: task.textColor, opacity: 0.7 }}>
                      ⏱️ {task.time}
                    </TaskTime>
                    <TaskTitle $textColor={task.textColor}>{task.title}</TaskTitle>
                    {task.description && (
                      <p style={{ 
                        margin: '8px 0 0 0', 
                        fontSize: '13px', 
                        color: task.textColor,
                        opacity: 0.8 
                      }}>
                        {task.description}
                      </p>
                    )}
                  </div>
                  <MoreButton>
                    <FiMoreVertical size={18} />
                  </MoreButton>
                </TaskHeader>

                <TaskDetails>
                  {task.members !== undefined && (
                    <TaskMeta $textColor={task.textColor}>
                      <FiUsers size={14} />
                      <span>Members: {task.members}</span>
                    </TaskMeta>
                  )}
                  {task.status && (
                    <StatusBadge $bg="rgba(0,0,0,0.15)" $color={task.statusColor}>
                      {task.status}
                    </StatusBadge>
                  )}
                  {task.revenue && (
                    <TaskMeta $textColor={task.textColor}>
                      💰 {task.revenue}
                    </TaskMeta>
                  )}
                  {task.people !== undefined && (
                    <TaskMeta $textColor={task.textColor}>
                      👥 {task.people}
                    </TaskMeta>
                  )}
                  {task.tasks !== undefined && (
                    <TaskMeta $textColor={task.textColor}>
                      📋 {task.tasks}
                    </TaskMeta>
                  )}
                </TaskDetails>

                {task.progress !== undefined && (
                  <ProgressBar>
                    <ProgressFill $progress={task.progress} />
                  </ProgressBar>
                )}
              </TaskCard>
            ))}
          </UrgentTasksContainer>
        </RightColumn>
      </DashboardGrid>
    </DashboardContainer>
  );
};

export default DashboardPage;
