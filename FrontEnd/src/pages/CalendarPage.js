import React, { useState } from 'react';
import styled from 'styled-components';

const ContentBox = styled.div`
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

const CalendarHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
`;

const MonthYear = styled.h1`
  font-size: 28px;
  font-weight: 600;
  color: #000000;
  margin: 0;
`;

const ViewSelector = styled.div`
  display: flex;
  gap: 8px;
`;

const ViewButton = styled.button`
  padding: 8px 16px;
  border: none;
  border-radius: 8px;
  background-color: ${props => props.$active ? '#000000' : '#FFFFFF'};
  color: ${props => props.$active ? '#FFFFFF' : '#666666'};
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background-color: ${props => props.$active ? '#000000' : '#F0F0F0'};
  }
`;

const CalendarGrid = styled.div`
  background-color: #FFFFFF;
  border-radius: 16px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  overflow: hidden;
`;

const WeekHeader = styled.div`
  display: grid;
  grid-template-columns: 80px repeat(5, 1fr);
  border-bottom: 2px solid #F0F0F0;
  background-color: #FAFAFA;
`;

const TimeLabel = styled.div`
  padding: 20px;
  font-size: 12px;
  color: #999999;
  font-weight: 500;
`;

const DayHeader = styled.div`
  padding: 20px;
  text-align: center;
  border-left: 1px solid #F0F0F0;
`;

const DayName = styled.div`
  font-size: 12px;
  color: #999999;
  font-weight: 500;
  text-transform: uppercase;
  margin-bottom: 4px;
`;

const DayNumber = styled.div`
  font-size: 20px;
  font-weight: 600;
  color: ${props => props.$isToday ? '#FFFFFF' : '#000000'};
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
  border-radius: 50%;
  background-color: ${props => props.$isToday ? '#000000' : 'transparent'};
`;

const CalendarBody = styled.div`
  display: grid;
  grid-template-columns: 80px repeat(5, 1fr);
`;

const TimeSlot = styled.div`
  padding: 15px 20px;
  font-size: 12px;
  color: #999999;
  border-top: 1px solid #F0F0F0;
  border-right: 1px solid #F0F0F0;
  background-color: #FAFAFA;
`;

const DayColumn = styled.div`
  position: relative;
  border-left: 1px solid #F0F0F0;
  border-top: 1px solid #F0F0F0;
  min-height: 60px;
  padding: 8px;
`;

const Event = styled.div`
  background-color: ${props => props.$color};
  border-radius: 8px;
  padding: 8px 12px;
  margin-bottom: 4px;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
`;

const EventTitle = styled.div`
  font-size: 13px;
  font-weight: 600;
  color: #000000;
  margin-bottom: 4px;
`;

const EventTime = styled.div`
  font-size: 11px;
  color: #666666;
  margin-bottom: 6px;
`;

const EventParticipants = styled.div`
  display: flex;
  gap: 4px;
`;

const ParticipantAvatar = styled.div`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: #FFFFFF;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 9px;
  font-weight: 600;
  color: #000000;
  border: 1px solid rgba(0, 0, 0, 0.1);
`;

const CalendarPage = () => {
  const [view, setView] = useState('week');
  
  const days = [
    { name: 'Wed', number: 17, isToday: false },
    { name: 'Thu', number: 18, isToday: true },
    { name: 'Fri', number: 19, isToday: false },
    { name: 'Sat', number: 20, isToday: false },
    { name: 'Sun', number: 21, isToday: false },
  ];

  const timeSlots = ['9:00', '10:00', '11:00', '12:00', '1:00', '2:00', '3:00', '4:00', '5:00'];

  const events = {
    17: [
      { time: '9:00', title: 'Team Standup', color: '#FFE5B4', participants: ['JD', 'SM', 'AL'] },
      { time: '2:00', title: 'Design Review', color: '#E6D5FF', participants: ['KS', 'RJ'] },
    ],
    18: [
      { time: '10:00', title: 'Client Meeting', color: '#FFB3BA', participants: ['TW', 'BH'] },
      { time: '3:00', title: 'Sprint Planning', color: '#BAFFC9', participants: ['MK', 'LP', 'GH'] },
    ],
    19: [
      { time: '9:00', title: 'Code Review', color: '#BAE1FF', participants: ['QR', 'NP'] },
      { time: '11:00', title: 'Workshop', color: '#FFFFBA', participants: ['CD', 'EF'] },
      { time: '4:00', title: '1-on-1', color: '#FFE5B4', participants: ['IJ'] },
    ],
    20: [
      { time: '10:00', title: 'Product Demo', color: '#E6D5FF', participants: ['KL', 'MN', 'OP'] },
    ],
    21: [
      { time: '11:00', title: 'Team Lunch', color: '#BAFFC9', participants: ['All'] },
    ],
  };

  return (
    <ContentBox>
      <CalendarHeader>
        <MonthYear>May 2023</MonthYear>
        <ViewSelector>
          <ViewButton $active={view === 'day'} onClick={() => setView('day')}>Day</ViewButton>
          <ViewButton $active={view === 'week'} onClick={() => setView('week')}>Week</ViewButton>
          <ViewButton $active={view === 'month'} onClick={() => setView('month')}>Month</ViewButton>
        </ViewSelector>
      </CalendarHeader>

      <CalendarGrid>
        <WeekHeader>
          <TimeLabel>Time</TimeLabel>
          {days.map((day, index) => (
            <DayHeader key={index}>
              <DayName>{day.name}</DayName>
              <DayNumber $isToday={day.isToday}>{day.number}</DayNumber>
            </DayHeader>
          ))}
        </WeekHeader>

        <CalendarBody>
          {timeSlots.map((time, timeIndex) => (
            <React.Fragment key={timeIndex}>
              <TimeSlot>{time}</TimeSlot>
              {days.map((day, dayIndex) => (
                <DayColumn key={dayIndex}>
                  {events[day.number]?.filter(event => event.time === time).map((event, eventIndex) => (
                    <Event key={eventIndex} $color={event.color}>
                      <EventTitle>{event.title}</EventTitle>
                      <EventTime>{event.time}</EventTime>
                      <EventParticipants>
                        {event.participants.map((participant, pIndex) => (
                          <ParticipantAvatar key={pIndex}>{participant}</ParticipantAvatar>
                        ))}
                      </EventParticipants>
                    </Event>
                  ))}
                </DayColumn>
              ))}
            </React.Fragment>
          ))}
        </CalendarBody>
      </CalendarGrid>
    </ContentBox>
  );
};

export default CalendarPage;
