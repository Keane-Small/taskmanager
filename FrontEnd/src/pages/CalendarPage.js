import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useAuth } from '../context/AuthContext';
import { FiChevronLeft, FiChevronRight, FiX } from 'react-icons/fi';
import TaskBoard from '../components/TaskBoard';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const ContentBox = styled.div`
  position: fixed;
  left: 100px;
  top: 95px;
  right: 20px;
  bottom: 15px;
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

const MonthYearSection = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const NavButton = styled.button`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: none;
  background-color: #FFFFFF;
  color: #000000;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  
  &:hover {
    background-color: #F0F0F0;
    transform: scale(1.1);
  }
  
  &:active {
    transform: scale(0.95);
  }
`;

const MonthYear = styled.h1`
  font-size: 28px;
  font-weight: 600;
  color: #0B2B26;
  margin: 0;
  min-width: 200px;
  text-align: center;
`;

const ViewSelector = styled.div`
  display: flex;
  gap: 8px;
`;

const ViewButton = styled.button`
  padding: 8px 16px;
  border: none;
  border-radius: 8px;
  background-color: ${props => props.$active ? '#235347' : '#FFFFFF'};
  color: ${props => props.$active ? '#FFFFFF' : '#163832'};
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background-color: ${props => props.$active ? '#163832' : 'rgba(142, 182, 155, 0.2)'};
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
  color: ${props => props.$isToday ? '#FFFFFF' : '#0B2B26'};
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
  border-radius: 50%;
  background-color: ${props => props.$isToday ? '#235347' : 'transparent'};
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

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
`;

const ModalContent = styled.div`
  background-color: #FFFFFF;
  border-radius: 16px;
  padding: 30px;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  position: relative;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;
`;

const ModalTitle = styled.h2`
  margin: 0;
  font-size: 24px;
  font-weight: 600;
  color: #000000;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s;
  
  &:hover {
    transform: scale(1.1);
  }
`;

const ModalSection = styled.div`
  margin-bottom: 16px;
`;

const ModalLabel = styled.div`
  font-size: 12px;
  font-weight: 600;
  color: #666;
  text-transform: uppercase;
  margin-bottom: 4px;
`;

const ModalValue = styled.div`
  font-size: 16px;
  color: #000;
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 8px;
  background-color: #F0F0F0;
  border-radius: 4px;
  overflow: hidden;
  margin-top: 8px;
`;

const ProgressFill = styled.div`
  height: 100%;
  background-color: #000000;
  border-radius: 4px;
  width: ${props => props.$percentage}%;
  transition: width 0.3s ease;
`;

const CollaboratorsList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 8px;
`;

const CollaboratorChip = styled.div`
  background-color: #F0F0F0;
  padding: 6px 12px;
  border-radius: 16px;
  font-size: 13px;
  color: #000;
`;

const ViewProjectButton = styled.button`
  width: 100%;
  padding: 12px;
  background-color: #000000;
  color: #FFFFFF;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  margin-top: 20px;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: #333333;
  }
`;

const CalendarPage = () => {
  const { user } = useAuth();
  const [view, setView] = useState('week');
  const [projects, setProjects] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showTaskBoard, setShowTaskBoard] = useState(false);

  useEffect(() => {
    fetchProjects();
  }, [user]);

  // Refetch projects periodically to keep data fresh
  useEffect(() => {
    const interval = setInterval(() => {
      if (!showTaskBoard && !showModal) {
        fetchProjects();
      }
    }, 30000); // Refresh every 30 seconds when idle

    return () => clearInterval(interval);
  }, [showTaskBoard, showModal]);

  const fetchProjects = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/projects`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Calendar: Fetched projects:', data);
        setProjects(data);
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  // Generate days for current week based on currentDate
  const getWeekDays = () => {
    const today = new Date();
    const currentDay = currentDate.getDay();
    const monday = new Date(currentDate);
    monday.setDate(currentDate.getDate() - currentDay + (currentDay === 0 ? -6 : 1));

    const days = [];
    for (let i = 0; i < 5; i++) {
      const date = new Date(monday);
      date.setDate(monday.getDate() + i);
      days.push({
        name: date.toLocaleDateString('en-US', { weekday: 'short' }),
        number: date.getDate(),
        fullDate: date,
        isToday: date.toDateString() === today.toDateString()
      });
    }
    return days;
  };

  const days = getWeekDays();
  const timeSlots = ['9:00', '10:00', '11:00', '12:00', '1:00', '2:00', '3:00', '4:00', '5:00'];

  // Convert projects to calendar events based on due dates
  const getEventsForDay = (date) => {
    const events = projects
      .filter(project => {
        if (!project.dueDate || project.dueDate === 'TBD') {
          console.log('Calendar: Skipping project (no due date):', project.name, project.dueDate);
          return false;
        }
        
        // Try to parse the date
        const projectDate = new Date(project.dueDate);
        const dateMatch = projectDate.toDateString() === date.toDateString();
        
        console.log('Calendar: Checking project:', project.name, {
          dueDate: project.dueDate,
          projectDate: projectDate.toDateString(),
          checkDate: date.toDateString(),
          matches: dateMatch
        });
        
        return dateMatch;
      })
      .map(project => {
        // Extract collaborator initials
        const participants = project.collaborators?.slice(0, 3).map(collab => {
          if (typeof collab === 'string') return collab;
          const name = collab.userId?.name || collab.userId?.email || 'U';
          return name.substring(0, 2).toUpperCase();
        }) || [];

        return {
          time: '9:00', // Default time - show all projects at 9am
          title: project.name,
          color: project.color || '#FFE5B4',
          participants,
          status: project.status,
          progress: project.totalTasks > 0 
            ? Math.round((project.completedTasks / project.totalTasks) * 100) 
            : 0
        };
      });
    
    return events;
  };

  const monthYear = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  const handlePrevious = () => {
    const newDate = new Date(currentDate);
    if (view === 'month') {
      newDate.setMonth(currentDate.getMonth() - 1);
    } else if (view === 'week') {
      newDate.setDate(currentDate.getDate() - 7);
    } else {
      newDate.setDate(currentDate.getDate() - 1);
    }
    setCurrentDate(newDate);
  };

  const handleNext = () => {
    const newDate = new Date(currentDate);
    if (view === 'month') {
      newDate.setMonth(currentDate.getMonth() + 1);
    } else if (view === 'week') {
      newDate.setDate(currentDate.getDate() + 7);
    } else {
      newDate.setDate(currentDate.getDate() + 1);
    }
    setCurrentDate(newDate);
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  const handleEventClick = (project) => {
    setSelectedProject(project);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedProject(null);
  };

  const handleViewProject = () => {
    setShowModal(false);
    setShowTaskBoard(true);
  };

  const handleCloseTaskBoard = () => {
    setShowTaskBoard(false);
    setSelectedProject(null);
    // Refetch projects to get updated task counts
    fetchProjects();
  };

  // Refetch projects when component becomes visible again
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        fetchProjects();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  // Show TaskBoard if a project is selected for detailed view
  if (showTaskBoard && selectedProject) {
    return <TaskBoard project={selectedProject} onClose={handleCloseTaskBoard} />;
  }

  if (loading) {
    return (
      <ContentBox>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
          <p>Loading calendar...</p>
        </div>
      </ContentBox>
    );
  }

  return (
    <ContentBox>
      <CalendarHeader>
        <MonthYearSection>
          <NavButton onClick={handlePrevious} title="Previous">
            <FiChevronLeft size={20} />
          </NavButton>
          <MonthYear>{monthYear}</MonthYear>
          <NavButton onClick={handleNext} title="Next">
            <FiChevronRight size={20} />
          </NavButton>
          <ViewButton onClick={handleToday} style={{ marginLeft: '8px' }}>
            Today
          </ViewButton>
        </MonthYearSection>
        <ViewSelector>
          <ViewButton $active={view === 'day'} onClick={() => setView('day')}>Day</ViewButton>
          <ViewButton $active={view === 'week'} onClick={() => setView('week')}>Week</ViewButton>
          <ViewButton $active={view === 'month'} onClick={() => setView('month')}>Month</ViewButton>
        </ViewSelector>
      </CalendarHeader>

      {projects.length === 0 ? (
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          justifyContent: 'center', 
          height: '60%',
          gap: '20px'
        }}>
          <h2 style={{ color: '#163832' }}>No Projects Yet</h2>
          <p style={{ color: '#8EB69B' }}>Create projects with due dates to see them in your calendar</p>
        </div>
      ) : (
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
                {days.map((day, dayIndex) => {
                  const dayEvents = getEventsForDay(day.fullDate);
                  const timeEvents = dayEvents.filter(event => event.time === time);
                  
                  return (
                    <DayColumn key={dayIndex}>
                      {timeEvents.map((event, eventIndex) => {
                        const project = projects.find(p => p.name === event.title);
                        return (
                          <Event 
                            key={eventIndex} 
                            $color={event.color}
                            onClick={() => project && handleEventClick(project)}
                          >
                            <EventTitle>{event.title}</EventTitle>
                            <EventTime>
                              {event.status} • {event.progress}% complete
                            </EventTime>
                            <EventParticipants>
                              {event.participants.map((participant, pIndex) => (
                                <ParticipantAvatar key={pIndex}>{participant}</ParticipantAvatar>
                              ))}
                            </EventParticipants>
                          </Event>
                        );
                      })}
                    </DayColumn>
                  );
                })}
              </React.Fragment>
            ))}
          </CalendarBody>
        </CalendarGrid>
      )}

      {showModal && selectedProject && (
        <ModalOverlay onClick={handleCloseModal}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              <ModalTitle>{selectedProject.name}</ModalTitle>
              <CloseButton onClick={handleCloseModal}>
                <FiX size={24} />
              </CloseButton>
            </ModalHeader>

            <ModalSection>
              <ModalLabel>Status</ModalLabel>
              <ModalValue>{selectedProject.status}</ModalValue>
            </ModalSection>

            <ModalSection>
              <ModalLabel>Due Date</ModalLabel>
              <ModalValue>
                {selectedProject.dueDate 
                  ? new Date(selectedProject.dueDate).toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })
                  : 'No due date'}
              </ModalValue>
            </ModalSection>

            <ModalSection>
              <ModalLabel>Progress</ModalLabel>
              <ModalValue>
                {selectedProject.completedTasks} of {selectedProject.totalTasks} tasks completed
              </ModalValue>
              <ProgressBar>
                <ProgressFill 
                  $percentage={
                    selectedProject.totalTasks > 0 
                      ? Math.round((selectedProject.completedTasks / selectedProject.totalTasks) * 100)
                      : 0
                  } 
                />
              </ProgressBar>
            </ModalSection>

            {selectedProject.collaborators && selectedProject.collaborators.length > 0 && (
              <ModalSection>
                <ModalLabel>Team Members</ModalLabel>
                <CollaboratorsList>
                  {selectedProject.collaborators.map((collab, idx) => {
                    const displayName = typeof collab === 'string' 
                      ? collab 
                      : collab.userId?.name || collab.userId?.email || 'Team Member';
                    return (
                      <CollaboratorChip key={idx}>
                        {displayName}
                      </CollaboratorChip>
                    );
                  })}
                </CollaboratorsList>
              </ModalSection>
            )}

            <ViewProjectButton onClick={handleViewProject}>
              View Project Details
            </ViewProjectButton>
          </ModalContent>
        </ModalOverlay>
      )}
    </ContentBox>
  );
};

export default CalendarPage;
