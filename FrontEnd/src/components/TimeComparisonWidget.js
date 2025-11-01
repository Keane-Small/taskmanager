import React from 'react';
import styled from 'styled-components';
import { FiClock } from 'react-icons/fi';

const WidgetCard = styled.div`
  background: #DAF1DE;
  border-radius: 12px;
  padding: 24px;
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
  margin-bottom: 20px;
`;

const Title = styled.h3`
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #0B2B26;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const WeekLabel = styled.span`
  font-size: 13px;
  color: #6c757d;
  font-weight: 500;
`;

const ChartContainer = styled.div`
  margin-bottom: 20px;
`;

const ChartRow = styled.div`
  margin-bottom: 16px;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const ChartLabel = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
`;

const LabelText = styled.span`
  font-size: 14px;
  font-weight: 500;
  color: #495057;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const ColorDot = styled.span`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: ${props => props.color};
`;

const HoursText = styled.span`
  font-size: 16px;
  font-weight: 700;
  color: ${props => props.color};
`;

const BarContainer = styled.div`
  width: 100%;
  height: 32px;
  background-color: #e9ecef;
  border-radius: 8px;
  overflow: hidden;
  position: relative;
`;

const Bar = styled.div`
  height: 100%;
  width: ${props => props.percentage}%;
  background: ${props => props.gradient};
  transition: width 0.6s ease;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding-right: 10px;
  border-radius: 8px;
  opacity: 0.9;
`;

const DeviationSection = styled.div`
  background-color: ${props => props.isNegative ? 'rgba(255, 193, 7, 0.15)' : props.isPositive ? 'rgba(142, 182, 155, 0.2)' : 'rgba(142, 182, 155, 0.1)'};
  border-left: 4px solid ${props => props.isNegative ? '#ffc107' : props.isPositive ? '#8EB69B' : '#8EB69B'};
  padding: 12px 16px;
  border-radius: 8px;
  margin-bottom: 16px;
`;

const DeviationLabel = styled.div`
  font-size: 12px;
  color: #6c757d;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 4px;
`;

const DeviationValue = styled.div`
  font-size: 18px;
  font-weight: 700;
  color: ${props => props.color};
  display: flex;
  align-items: center;
  gap: 6px;
`;

const DeviationText = styled.span`
  font-size: 13px;
  font-weight: 500;
  color: #495057;
`;

const TimeLogButton = styled.button`
  width: 100%;
  padding: 12px;
  background: linear-gradient(135deg, #235347 0%, #163832 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  
  &:hover {
    background: linear-gradient(135deg, #163832 0%, #0B2B26 100%);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(35, 83, 71, 0.4);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

const TimeComparisonWidget = ({ plannedHours = 40, actualHours = 38 }) => {
  const maxHours = Math.max(plannedHours, actualHours, 50); // Set minimum scale
  const plannedPercentage = (plannedHours / maxHours) * 100;
  const actualPercentage = (actualHours / maxHours) * 100;
  
  const deviation = actualHours - plannedHours;
  const deviationPercentage = plannedHours > 0 ? ((deviation / plannedHours) * 100).toFixed(1) : 0;
  const isSignificantDeviation = Math.abs(deviationPercentage) > 10;
  
  const isNegative = deviation > 0 && isSignificantDeviation; // Over planned
  const isPositive = deviation < 0 && isSignificantDeviation; // Under planned
  
  const deviationColor = isNegative ? '#856404' : isPositive ? '#163832' : '#163832';
  
  const handleTimeLogClick = () => {
    console.log('Time Log button clicked');
    // Add your time log navigation logic here
  };
  
  // Get current week dates
  const getCurrentWeek = () => {
    const now = new Date();
    const dayOfWeek = now.getDay();
    const monday = new Date(now);
    monday.setDate(now.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    
    const formatDate = (date) => {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };
    
    return `${formatDate(monday)} - ${formatDate(sunday)}`;
  };

  return (
    <WidgetCard>
      <Header>
        <Title>
          <FiClock size={20} />
          Time Tracking
        </Title>
        <WeekLabel>{getCurrentWeek()}</WeekLabel>
      </Header>

      <ChartContainer>
        <ChartRow>
          <ChartLabel>
            <LabelText>
              <ColorDot color="#235347" />
              Planned Hours
            </LabelText>
            <HoursText color="#235347">{plannedHours}h</HoursText>
          </ChartLabel>
          <BarContainer>
            <Bar 
              percentage={plannedPercentage}
              gradient="linear-gradient(90deg, #235347 0%, #163832 100%)"
            />
          </BarContainer>
        </ChartRow>

        <ChartRow>
          <ChartLabel>
            <LabelText>
              <ColorDot color="#8EB69B" />
              Actual Hours Spent
            </LabelText>
            <HoursText color="#8EB69B">{actualHours}h</HoursText>
          </ChartLabel>
          <BarContainer>
            <Bar 
              percentage={actualPercentage}
              gradient="linear-gradient(90deg, #8EB69B 0%, #DAF1DE 100%)"
            />
          </BarContainer>
        </ChartRow>
      </ChartContainer>

      <DeviationSection isNegative={isNegative} isPositive={isPositive}>
        <DeviationLabel>Deviation</DeviationLabel>
        <DeviationValue color={deviationColor}>
          {deviation > 0 ? '+' : ''}{deviation}h
          <DeviationText>
            ({deviation > 0 ? '+' : ''}{deviationPercentage}%)
            {isSignificantDeviation && (
              <span> - {deviation > 0 ? 'Over planned' : 'Under planned'}</span>
            )}
          </DeviationText>
        </DeviationValue>
      </DeviationSection>

      <TimeLogButton onClick={handleTimeLogClick}>
        <FiClock size={16} />
        View Time Log
      </TimeLogButton>
    </WidgetCard>
  );
};

export default TimeComparisonWidget;
