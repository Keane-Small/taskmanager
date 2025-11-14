import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { 
  FiTrendingUp, 
  FiCalendar, 
  FiBarChart2, 
  FiAlertTriangle,
  FiRefreshCw,
  FiCheckCircle,
  FiClock
} from 'react-icons/fi';
import { useTheme } from '../context/ThemeContext';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const PageContainer = styled.div`
  position: fixed;
  left: 110px;
  top: 20px;
  right: 20px;
  bottom: 20px;
  background: white;
  border-radius: 16px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: 0 4px 20px ${props => props.theme.shadow};
  transition: background 0.3s ease, box-shadow 0.3s ease;

  @media (max-width: 768px) {
    position: static;
    left: auto;
    top: auto;
    right: auto;
    bottom: auto;
    margin: 20px;
    min-height: calc(100vh - 140px);
  }
`;

const PageHeader = styled.div`
  background: white;
  color: ${props => props.theme.text};
  padding: 2rem;
  position: relative;
  overflow: hidden;
  border-bottom: 3px solid ${props => props.theme.primary};
  transition: all 0.3s ease;

  &::before {
    content: '';
    position: absolute;
    top: -50%;
    right: -10%;
    width: 200px;
    height: 200px;
    background: ${props => props.theme.primaryLight}15;
    border-radius: 50%;
  }

  &::after {
    content: '';
    position: absolute;
    bottom: -30%;
    left: -5%;
    width: 150px;
    height: 150px;
    background: ${props => props.theme.primaryLight}10;
    border-radius: 50%;
  }

  @media (max-width: 768px) {
    padding: 1.5rem;
  }
`;

const PageTitle = styled.h1`
  position: relative;
  z-index: 2;
  font-size: 32px;
  font-weight: 700;
  color: ${props => props.theme.text};
  margin-bottom: 8px;
  margin: 0;
`;

const PageSubtitle = styled.p`
  position: relative;
  z-index: 2;
  font-size: 16px;
  color: ${props => props.theme.textSecondary};
  margin: 8px 0 0 0;
`;

const RefreshButton = styled.button`
  position: relative;
  z-index: 2;
  background: ${props => props.theme.primary};
  color: white;
  border: none;
  border-radius: 8px;
  padding: 10px 20px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s;
  margin-top: 16px;

  &:hover {
    background: ${props => props.theme.primaryDark};
    transform: translateY(-2px);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const ScrollableContent = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 32px;

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: ${props => props.theme.background};
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: ${props => props.theme.primary}40;
    border-radius: 4px;
    
    &:hover {
      background: ${props => props.theme.primary}60;
    }
  }

  @media (max-width: 768px) {
    padding: 20px;
  }
`;

const InsightsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 24px;
`;

const InsightCard = styled(motion.div)`
  background: ${props => props.theme.background};
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 2px 8px ${props => props.theme.shadow};
  border: 1px solid ${props => props.theme.border};
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 4px 16px ${props => props.theme.shadow};
    transform: translateY(-2px);
  }
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
`;

const IconWrapper = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  background: ${props => props.$color || props.theme.primary}15;
  color: ${props => props.$color || props.theme.primary};
`;

const CardTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: ${props => props.theme.text};
  margin: 0;
`;

const CardContent = styled.div`
  color: ${props => props.theme.textSecondary};
`;

const HighlightText = styled.div`
  font-size: 36px;
  font-weight: 700;
  color: ${props => props.$color || props.theme.primary};
  margin: 16px 0;
  display: flex;
  align-items: baseline;
  gap: 8px;
`;

const HighlightLabel = styled.span`
  font-size: 16px;
  font-weight: 400;
  color: ${props => props.theme.textSecondary};
`;

const MetricRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid ${props => props.theme.border};

  &:last-child {
    border-bottom: none;
  }
`;

const MetricLabel = styled.span`
  font-size: 14px;
  color: ${props => props.theme.textSecondary};
`;

const MetricValue = styled.span`
  font-size: 16px;
  font-weight: 600;
  color: ${props => props.theme.text};
`;

const RiskBadge = styled.span`
  display: inline-block;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  background: ${props => {
    switch(props.$level) {
      case 'critical': return '#ff4444';
      case 'high': return '#ff9800';
      case 'medium': return '#ffc107';
      case 'low': return '#4caf50';
      default: return '#999';
    }
  }};
  color: white;
`;

const RecommendationList = styled.div`
  margin-top: 16px;
`;

const RecommendationItem = styled.div`
  padding: 12px;
  background: ${props => props.theme.cardBackground};
  border-radius: 8px;
  margin-bottom: 8px;
  border-left: 3px solid ${props => {
    switch(props.$type) {
      case 'critical': return '#ff4444';
      case 'warning': return '#ff9800';
      case 'info': return '#2196f3';
      default: return '#4caf50';
    }
  }};
`;

const RecommendationText = styled.p`
  margin: 0;
  font-size: 14px;
  color: ${props => props.theme.text};
`;

const DayChart = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 16px;
  justify-content: space-between;
`;

const DayBar = styled.div`
  flex: 1;
  text-align: center;
`;

const BarContainer = styled.div`
  height: 100px;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  margin-bottom: 8px;
`;

const Bar = styled.div`
  width: 100%;
  background: ${props => props.$isMax ? props.theme.primary : props.theme.primaryLight};
  border-radius: 4px 4px 0 0;
  height: ${props => props.$height}%;
  transition: height 0.3s ease;
`;

const DayLabel = styled.div`
  font-size: 11px;
  color: ${props => props.theme.textSecondary};
  font-weight: 600;
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
  color: ${props => props.theme.textSecondary};
`;

const InsightsPage = () => {
  const { theme } = useTheme();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [productivity, setProductivity] = useState(null);
  const [deadlines, setDeadlines] = useState(null);
  const [workload, setWorkload] = useState(null);
  const [risks, setRisks] = useState(null);

  useEffect(() => {
    fetchAllInsights();
  }, []);

  const fetchAllInsights = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };

      const [prodRes, deadRes, workRes, riskRes] = await Promise.all([
        fetch(`${API_URL}/analytics/productivity`, { headers }).catch(err => ({ ok: false })),
        fetch(`${API_URL}/analytics/deadline-suggestions`, { headers }).catch(err => ({ ok: false })),
        fetch(`${API_URL}/analytics/workload-balance`, { headers }).catch(err => ({ ok: false })),
        fetch(`${API_URL}/analytics/risk-prediction`, { headers }).catch(err => ({ ok: false }))
      ]);

      if (prodRes.ok) {
        const data = await prodRes.json();
        setProductivity(data);
      }
      if (deadRes.ok) {
        const data = await deadRes.json();
        setDeadlines(data);
      }
      if (workRes.ok) {
        const data = await workRes.json();
        setWorkload(data);
      }
      if (riskRes.ok) {
        const data = await riskRes.json();
        setRisks(data);
      }
    } catch (error) {
      console.error('Error fetching insights:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    setLoading(false);
    await fetchAllInsights();
  };

  if (loading) {
    return (
      <PageContainer theme={theme}>
        <LoadingContainer theme={theme}>
          <FiRefreshCw size={32} className="spin" />
        </LoadingContainer>
      </PageContainer>
    );
  }

  return (
    <PageContainer theme={theme}>
      <PageHeader>
        <PageTitle theme={theme}>AI-Powered Insights</PageTitle>
        <PageSubtitle theme={theme}>
          Smart analytics to help you work more efficiently
        </PageSubtitle>
        <RefreshButton 
          theme={theme} 
          onClick={handleRefresh}
          disabled={refreshing}
        >
          <FiRefreshCw className={refreshing ? 'spin' : ''} />
          {refreshing ? 'Refreshing...' : 'Refresh Data'}
        </RefreshButton>
      </PageHeader>

      <ScrollableContent theme={theme}>
        <InsightsGrid>
          {/* Productivity Analytics Card */}
          {productivity && (
          <InsightCard
            theme={theme}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <CardHeader>
              <IconWrapper $color="#4caf50" theme={theme}>
                <FiTrendingUp />
              </IconWrapper>
              <CardTitle theme={theme}>Productivity Analytics</CardTitle>
            </CardHeader>
            <CardContent theme={theme}>
              <HighlightText $color="#4caf50" theme={theme}>
                {productivity.productivityIncrease > 0 ? '+' : ''}{productivity.productivityIncrease}%
                <HighlightLabel theme={theme}>more productive</HighlightLabel>
              </HighlightText>
              <p style={{ fontSize: '14px', marginBottom: '16px' }}>
                You're <strong>{Math.abs(productivity.productivityIncrease)}%</strong> more productive on{' '}
                <strong>{productivity.mostProductiveDay}s</strong>
              </p>
              
              <DayChart>
                {productivity.dayStats.map((day, index) => {
                  const maxCompleted = Math.max(...productivity.dayStats.map(d => d.completed));
                  const height = maxCompleted > 0 ? (day.completed / maxCompleted) * 100 : 0;
                  return (
                    <DayBar key={index}>
                      <BarContainer>
                        <Bar 
                          $height={height} 
                          $isMax={day.completed === maxCompleted}
                          theme={theme}
                        />
                      </BarContainer>
                      <DayLabel theme={theme}>{day.name.slice(0, 3)}</DayLabel>
                    </DayBar>
                  );
                })}
              </DayChart>

              <MetricRow theme={theme}>
                <MetricLabel theme={theme}>Tasks This Week</MetricLabel>
                <MetricValue theme={theme}>{productivity.totalTasksThisWeek}</MetricValue>
              </MetricRow>
              <MetricRow theme={theme}>
                <MetricLabel theme={theme}>Week-over-Week Change</MetricLabel>
                <MetricValue theme={theme} style={{ color: productivity.weekOverWeekChange >= 0 ? '#4caf50' : '#ff4444' }}>
                  {productivity.weekOverWeekChange > 0 ? '+' : ''}{productivity.weekOverWeekChange}%
                </MetricValue>
              </MetricRow>
            </CardContent>
          </InsightCard>
        )}

        {/* Smart Deadline Suggestions Card */}
        {deadlines && (
          <InsightCard
            theme={theme}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <CardHeader>
              <IconWrapper $color="#2196f3" theme={theme}>
                <FiCalendar />
              </IconWrapper>
              <CardTitle theme={theme}>Smart Deadline Suggestions</CardTitle>
            </CardHeader>
            <CardContent theme={theme}>
              <p style={{ fontSize: '14px', marginBottom: '16px' }}>
                Based on your history of <strong>{deadlines.completionHistory}</strong> completed tasks
              </p>

              <MetricRow theme={theme}>
                <MetricLabel theme={theme}>Urgent Tasks</MetricLabel>
                <MetricValue theme={theme}>{deadlines.suggestions.urgent} days</MetricValue>
              </MetricRow>
              <MetricRow theme={theme}>
                <MetricLabel theme={theme}>High Priority</MetricLabel>
                <MetricValue theme={theme}>{deadlines.suggestions.high} days</MetricValue>
              </MetricRow>
              <MetricRow theme={theme}>
                <MetricLabel theme={theme}>Medium Priority</MetricLabel>
                <MetricValue theme={theme}>{deadlines.suggestions.medium} days</MetricValue>
              </MetricRow>
              <MetricRow theme={theme}>
                <MetricLabel theme={theme}>Low Priority</MetricLabel>
                <MetricValue theme={theme}>{deadlines.suggestions.low} days</MetricValue>
              </MetricRow>

              {deadlines.recommendedDeadlines.length > 0 && (
                <>
                  <p style={{ fontSize: '14px', marginTop: '16px', marginBottom: '8px', fontWeight: '600' }}>
                    <FiCheckCircle size={14} style={{ verticalAlign: 'middle', marginRight: '4px' }} />
                    {deadlines.recommendedDeadlines.length} tasks need deadlines
                  </p>
                </>
              )}
            </CardContent>
          </InsightCard>
        )}

        {/* Workload Balancing Card */}
        {workload && (
          <InsightCard
            theme={theme}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <CardHeader>
              <IconWrapper $color="#ff9800" theme={theme}>
                <FiBarChart2 />
              </IconWrapper>
              <CardTitle theme={theme}>Workload Balance</CardTitle>
            </CardHeader>
            <CardContent theme={theme}>
              <HighlightText $color="#ff9800" theme={theme}>
                {workload.totalHours}h
                <HighlightLabel theme={theme}>estimated work</HighlightLabel>
              </HighlightText>

              <MetricRow theme={theme}>
                <MetricLabel theme={theme}>Active Tasks</MetricLabel>
                <MetricValue theme={theme}>{workload.totalTasks}</MetricValue>
              </MetricRow>
              <MetricRow theme={theme}>
                <MetricLabel theme={theme}>Workload Status</MetricLabel>
                <RiskBadge $level={
                  workload.balanceStatus === 'overloaded' ? 'high' :
                  workload.balanceStatus === 'underutilized' ? 'low' : 'medium'
                }>
                  {workload.balanceStatus}
                </RiskBadge>
              </MetricRow>

              {workload.recommendations.length > 0 && (
                <RecommendationList>
                  <p style={{ fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>
                    Recommendations:
                  </p>
                  {workload.recommendations.slice(0, 3).map((rec, index) => (
                    <RecommendationItem key={index} $type={rec.type} theme={theme}>
                      <RecommendationText theme={theme}>{rec.message}</RecommendationText>
                    </RecommendationItem>
                  ))}
                </RecommendationList>
              )}
            </CardContent>
          </InsightCard>
        )}

        {/* Risk Prediction Card */}
        {risks && risks.projects.length > 0 && (
          <InsightCard
            theme={theme}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
          >
            <CardHeader>
              <IconWrapper $color="#ff4444" theme={theme}>
                <FiAlertTriangle />
              </IconWrapper>
              <CardTitle theme={theme}>Risk Predictions</CardTitle>
            </CardHeader>
            <CardContent theme={theme}>
              {risks.highRiskCount > 0 && (
                <HighlightText $color="#ff4444" theme={theme}>
                  {risks.highRiskCount}
                  <HighlightLabel theme={theme}>high-risk projects</HighlightLabel>
                </HighlightText>
              )}

              {risks.projects.slice(0, 4).map((project, index) => (
                <MetricRow key={index} theme={theme}>
                  <div>
                    <MetricLabel theme={theme} style={{ display: 'block', marginBottom: '4px' }}>
                      {project.projectName}
                    </MetricLabel>
                    <RiskBadge $level={project.riskLevel}>
                      {project.delayProbability}% delay risk
                    </RiskBadge>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <MetricValue theme={theme} style={{ display: 'block', fontSize: '14px' }}>
                      {project.completedTasks}/{project.totalTasks}
                    </MetricValue>
                    <MetricLabel theme={theme} style={{ fontSize: '11px' }}>
                      {project.overdueTasks > 0 && `${project.overdueTasks} overdue`}
                    </MetricLabel>
                  </div>
                </MetricRow>
              ))}
            </CardContent>
          </InsightCard>
        )}
        </InsightsGrid>
      </ScrollableContent>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .spin {
          animation: spin 1s linear infinite;
        }
      `}</style>
    </PageContainer>
  );
};

export default InsightsPage;
