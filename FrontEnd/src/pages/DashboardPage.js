import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FiArrowRight, FiMoreVertical, FiUsers, FiTrendingUp, FiClock, FiCalendar } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const DashboardContainer = styled.div`
  position: fixed;
  left: 100px;
  top: 95px;
  right: 20px;
  bottom: 15px;
  background: linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%);
  border-radius: 20px;
  padding: 30px;
  overflow-y: auto;
  color: #1f2937;
  box-shadow: 0 4px 20px rgba(45, 90, 61, 0.08);

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: #f3f4f6;
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(45, 90, 61, 0.3);
    border-radius: 4px;
    
    &:hover {
      background: rgba(45, 90, 61, 0.5);
    }
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
  color: #2D5A3D;
`;

const ViewAll = styled.button`
  background: transparent;
  border: none;
  color: #6b7280;
  cursor: pointer;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: color 0.2s;

  &:hover {
    color: #2D5A3D;
  }
`;

const UrgentTasksContainer = styled.div`
  background: #ffffff;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 4px 12px rgba(45, 90, 61, 0.08);
  border: 1px solid rgba(45, 90, 61, 0.1);
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
  background: #ffffff;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 4px 12px rgba(45, 90, 61, 0.08);
  border: 1px solid rgba(45, 90, 61, 0.1);
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 8px 24px rgba(45, 90, 61, 0.12);
    transform: translateY(-2px);
  }
`;

const StatValue = styled.div`
  font-size: 32px;
  font-weight: 700;
  color: #2D5A3D;
  margin-bottom: 4px;
`;

const StatLabel = styled.div`
  font-size: 13px;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const TaskStatistics = styled.div`
  background: #ffffff;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 12px rgba(45, 90, 61, 0.08);
  border: 1px solid rgba(45, 90, 61, 0.1);
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 8px 24px rgba(45, 90, 61, 0.12);
    transform: translateY(-2px);
  }
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
  color: #2D5A3D;
`;

const DonutLabel = styled.div`
  font-size: 12px;
  color: #6b7280;
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
  color: #2D5A3D;
  margin-bottom: 4px;
`;

const StatItemLabel = styled.div`
  font-size: 11px;
  color: #6b7280;
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
  const { user } = useAuth();
  const [urgentTasks, setUrgentTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [taskStats, setTaskStats] = useState({
    total: 0,
    completed: 0,
    inProgress: 0,
    backlog: 0
  });

  useEffect(() => {
    fetchUrgentTasks();
    fetchAllTaskStats();
  }, []);

  const fetchUrgentTasks = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/tasks/urgent`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUrgentTasks(data);
      } else {
        setUrgentTasks([]);
      }
    } catch (error) {
      console.error('Error fetching urgent tasks:', error);
      setUrgentTasks([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllTaskStats = async () => {
    try {
      const token = localStorage.getItem('token');
      
      // Get all projects first
      const projectsResponse = await fetch(`${API_URL}/projects`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!projectsResponse.ok) return;
      
      const projects = await projectsResponse.json();
      
      // Aggregate stats from all projects
      let totalTasks = 0;
      let completedTasks = 0;
      let inProgressTasks = 0;
      let backlogTasks = 0;

      for (const project of projects) {
        totalTasks += project.totalTasks || 0;
        completedTasks += project.completedTasks || 0;
      }

      // Get detailed task counts
      const tasksPromises = projects.map(p => 
        fetch(`${API_URL}/tasks/project/${p._id}/stats`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }).then(r => r.ok ? r.json() : null)
      );

      const tasksData = await Promise.all(tasksPromises);
      tasksData.forEach(data => {
        if (data) {
          inProgressTasks += data.inProgress || 0;
          backlogTasks += data.todo || 0;
        }
      });

      setTaskStats({
        total: totalTasks,
        completed: completedTasks,
        inProgress: inProgressTasks,
        backlog: backlogTasks
      });
    } catch (error) {
      console.error('Error fetching task stats:', error);
    }
  };

  const getTaskColor = (priority, index) => {
    const colorMap = {
      high: 'linear-gradient(135deg, #ff8a80 0%, #ff6e65 100%)',
      medium: 'linear-gradient(135deg, #ffd180 0%, #ffab40 100%)',
      low: 'linear-gradient(135deg, #80deea 0%, #4dd0e1 100%)'
    };
    
    const fallbackColors = [
      'linear-gradient(135deg, #b388ff 0%, #9575cd 100%)',
      'linear-gradient(135deg, #69f0ae 0%, #00e676 100%)',
      'linear-gradient(135deg, #ff8a80 0%, #ff6e65 100%)',
      'linear-gradient(135deg, #80deea 0%, #4dd0e1 100%)',
    ];
    
    return colorMap[priority] || fallbackColors[index % fallbackColors.length];
  };

  const getTextColor = (priority) => {
    return priority === 'high' ? '#fff' : '#000';
  };

  const formatDate = (date) => {
    if (!date) return 'No due date';
    const taskDate = new Date(date);
    const now = new Date();
    const diffTime = taskDate - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'Overdue';
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    if (diffDays <= 7) return `${diffDays} days`;
    
    return taskDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const formatTimeRange = (dueDate) => {
    if (!dueDate) return 'No deadline';
    const date = new Date(dueDate);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
  };

  const getCompletionPercentage = () => {
    if (taskStats.total === 0) return 0;
    return Math.round((taskStats.completed / taskStats.total) * 100);
  };

  const getIncompletePercentage = () => {
    if (taskStats.total === 0) return 0;
    return Math.round(((taskStats.total - taskStats.completed) / taskStats.total) * 100);
  };

  return (
    <DashboardContainer>
      <DashboardGrid>
        <LeftColumn>
          <StatsGrid>
            <StatCard>
              <StatValue>{getCompletionPercentage()}%</StatValue>
              <StatLabel>Completed Tasks</StatLabel>
            </StatCard>
            <StatCard>
              <StatValue>{getIncompletePercentage()}%</StatValue>
              <StatLabel>Unfinished Tasks</StatLabel>
            </StatCard>
            <StatCard>
              <StatValue>{taskStats.total}</StatValue>
              <StatLabel>Total Tasks</StatLabel>
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
                    stroke="#e5e7eb"
                    strokeWidth="20"
                  />
                  <circle
                    cx="80"
                    cy="80"
                    r="60"
                    fill="none"
                    stroke="#2D5A3D"
                    strokeWidth="20"
                    strokeDasharray={`${2 * Math.PI * 60 * (getCompletionPercentage() / 100)} ${2 * Math.PI * 60}`}
                    strokeLinecap="round"
                  />
                </DonutCircle>
                <DonutCenter>
                  <DonutValue>{getCompletionPercentage()}%</DonutValue>
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
                      stroke="#e5e7eb"
                      strokeWidth="15"
                    />
                    <circle
                      cx="60"
                      cy="60"
                      r="45"
                      fill="none"
                      stroke="#ff8a80"
                      strokeWidth="15"
                      strokeDasharray={`${2 * Math.PI * 45 * (getIncompletePercentage() / 100)} ${2 * Math.PI * 45}`}
                      strokeLinecap="round"
                    />
                  </DonutCircle>
                  <DonutCenter>
                    <DonutValue style={{ fontSize: '28px' }}>{getIncompletePercentage()}%</DonutValue>
                    <DonutLabel>Incomplete</DonutLabel>
                  </DonutCenter>
                </DonutChart>
              </div>
            </DonutContainer>
            <StatsList>
              <StatItem>
                <StatItemValue>{taskStats.inProgress}</StatItemValue>
                <StatItemLabel>🚀 In Progress</StatItemLabel>
              </StatItem>
              <StatItem>
                <StatItemValue>{taskStats.backlog}</StatItemValue>
                <StatItemLabel>� Backlog</StatItemLabel>
              </StatItem>
            </StatsList>
          </TaskStatistics>
        </LeftColumn>

        <RightColumn>
          <UrgentTasksContainer>
            <SectionHeader>
              <SectionTitle>Urgent Tasks ({urgentTasks.length})</SectionTitle>
            </SectionHeader>
            
            {loading ? (
              <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
                Loading urgent tasks...
              </div>
            ) : urgentTasks.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
                <p style={{ margin: 0, fontSize: '16px', fontWeight: '600' }}>No urgent tasks</p>
                <p style={{ margin: '8px 0 0 0', fontSize: '14px' }}>You're all caught up! 🎉</p>
              </div>
            ) : (
              urgentTasks.map((task, index) => {
                const color = getTaskColor(task.priority, index);
                const textColor = getTextColor(task.priority);
                
                return (
                  <TaskCard
                    key={task._id}
                    $color={color}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <TaskHeader>
                      <div>
                        <TaskTime style={{ color: textColor, opacity: 0.7 }}>
                          <FiCalendar size={12} style={{ marginRight: '4px' }} />
                          Due: {formatDate(task.dueDate)}
                        </TaskTime>
                        <TaskTitle $textColor={textColor}>{task.title}</TaskTitle>
                        {task.description && (
                          <p style={{ 
                            margin: '8px 0 0 0', 
                            fontSize: '13px', 
                            color: textColor,
                            opacity: 0.8 
                          }}>
                            {task.description}
                          </p>
                        )}
                        {task.projectId && (
                          <p style={{ 
                            margin: '4px 0 0 0', 
                            fontSize: '12px', 
                            color: textColor,
                            opacity: 0.7,
                            fontWeight: 600
                          }}>
                            📁 {task.projectId.name || 'Project'}
                          </p>
                        )}
                      </div>
                      <MoreButton>
                        <FiMoreVertical size={18} />
                      </MoreButton>
                    </TaskHeader>

                    <TaskDetails>
                      {task.assignedTo && task.assignedTo.length > 0 && (
                        <TaskMeta $textColor={textColor}>
                          <FiUsers size={14} />
                          <span>{task.assignedTo.length} assigned</span>
                        </TaskMeta>
                      )}
                      <StatusBadge $bg="rgba(0,0,0,0.15)" $color={textColor}>
                        {task.status.replace('-', ' ')}
                      </StatusBadge>
                      <StatusBadge 
                        $bg={task.priority === 'high' ? 'rgba(255,0,0,0.3)' : 'rgba(0,0,0,0.15)'} 
                        $color={textColor}
                      >
                        {task.priority} priority
                      </StatusBadge>
                    </TaskDetails>

                    {task.status === 'in-progress' && (
                      <ProgressBar>
                        <ProgressFill $progress={50} />
                      </ProgressBar>
                    )}
                  </TaskCard>
                );
              })
            )}
          </UrgentTasksContainer>
        </RightColumn>
      </DashboardGrid>
    </DashboardContainer>
  );
};

export default DashboardPage;
