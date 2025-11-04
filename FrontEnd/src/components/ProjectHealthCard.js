import React from 'react';
import styled from 'styled-components';
import { FiAlertCircle, FiCheckCircle, FiClock } from 'react-icons/fi';

const Card = styled.div`
  background: #DAF1DE;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  
  &:hover {
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
    transform: translateY(-2px);
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`;

const ProjectName = styled.h3`
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #0B2B26;
`;

const StatusBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 600;
  background-color: ${props => props.$backgroundColor};
  color: ${props => props.$color};
`;

const ProgressSection = styled.div`
  margin-bottom: 16px;
`;

const ProgressBarContainer = styled.div`
  width: 100%;
  height: 10px;
  background-color: #e9ecef;
  border-radius: 5px;
  overflow: hidden;
  margin-bottom: 8px;
`;

const ProgressBar = styled.div`
  height: 100%;
  width: ${props => props.$percentage}%;
  background: ${props => props.$gradient};
  transition: width 0.5s ease;
  border-radius: 5px;
`;

const ProgressText = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 13px;
  color: #6c757d;
`;

const ProgressPercentage = styled.span`
  font-weight: 600;
  color: ${props => props.$color};
  font-size: 14px;
`;

const DeadlineSection = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px;
  background-color: #f8f9fa;
  border-radius: 8px;
  border-left: 3px solid ${props => props.$borderColor};
`;

const DeadlineIcon = styled.div`
  color: ${props => props.$color};
  display: flex;
  align-items: center;
`;

const DeadlineText = styled.div`
  flex: 1;
`;

const DeadlineLabel = styled.div`
  font-size: 11px;
  color: #6c757d;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 2px;
`;

const DeadlineDate = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: #163832;
`;

const ProjectHealthCard = ({ 
  projectName, 
  status, 
  completionPercentage, 
  nextDeadline 
}) => {
  // Status configurations
  const statusConfig = {
    'On Track': {
      icon: FiCheckCircle,
      backgroundColor: 'rgba(142, 182, 155, 0.2)',
      color: '#163832',
      progressGradient: 'linear-gradient(90deg, #8EB69B 0%, #235347 100%)',
      progressColor: '#8EB69B',
      deadlineBorderColor: '#8EB69B'
    },
    'At Risk': {
      icon: FiAlertCircle,
      backgroundColor: 'rgba(255, 193, 7, 0.15)',
      color: '#856404',
      progressGradient: 'linear-gradient(90deg, #ffc107 0%, #fd7e14 100%)',
      progressColor: '#ffc107',
      deadlineBorderColor: '#ffc107'
    },
    'Behind Schedule': {
      icon: FiAlertCircle,
      backgroundColor: 'rgba(220, 53, 69, 0.15)',
      color: '#721c24',
      progressGradient: 'linear-gradient(90deg, #dc3545 0%, #c82333 100%)',
      progressColor: '#dc3545',
      deadlineBorderColor: '#dc3545'
    }
  };

  const config = statusConfig[status] || statusConfig['On Track'];
  const StatusIcon = config.icon;

  // Format deadline date
  const formatDeadline = (deadline) => {
    if (!deadline) return 'No deadline set';
    const date = new Date(deadline);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  return (
    <Card>
      <Header>
        <ProjectName>{projectName}</ProjectName>
        <StatusBadge 
          $backgroundColor={config.backgroundColor} 
          $color={config.color}
        >
          <StatusIcon size={16} />
          {status}
        </StatusBadge>
      </Header>

      <ProgressSection>
        <ProgressBarContainer>
          <ProgressBar 
            $percentage={completionPercentage} 
            $gradient={config.progressGradient}
          />
        </ProgressBarContainer>
        <ProgressText>
          <span>Progress</span>
          <ProgressPercentage $color={config.progressColor}>
            {completionPercentage}%
          </ProgressPercentage>
        </ProgressText>
      </ProgressSection>

      <DeadlineSection $borderColor={config.deadlineBorderColor}>
        <DeadlineIcon $color={config.progressColor}>
          <FiClock size={20} />
        </DeadlineIcon>
        <DeadlineText>
          <DeadlineLabel>Next Deadline</DeadlineLabel>
          <DeadlineDate>{formatDeadline(nextDeadline)}</DeadlineDate>
        </DeadlineText>
      </DeadlineSection>
    </Card>
  );
};

export default ProjectHealthCard;
