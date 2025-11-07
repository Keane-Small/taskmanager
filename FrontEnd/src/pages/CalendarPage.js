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
  position: relative;
`;

const WeekHeader = styled.div`
  display: grid;
  grid-template-columns: ${props => 
    props.$view === 'day' ? '80px 1fr' :
    props.$view === 'week' ? '80px repeat(7, 1fr)' :
    'repeat(7, 1fr)'
  };
  border-bottom: 2px solid #F0F0F0;
  background-color: #FAFAFA;
`;

const MonthGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 0px;
  background-color: #F0F0F0;
  border: 1px solid #E0E0E0;
`;

const MonthDay = styled.div`
  background-color: #FFFFFF;
  min-height: 140px;
  padding: 8px 0px;
  border: 1px solid #E0E0E0;
  border-left: ${props => props.$hasTimelineStart ? '0px' : '1px solid #E0E0E0'};
  border-right: ${props => props.$hasTimelineEnd ? '0px' : '1px solid #E0E0E0'};
  position: relative;
  opacity: ${props => props.$isCurrentMonth ? 1 : 0.5};
  overflow: visible;
  display: flex;
  flex-direction: column;
  
  /* Remove horizontal spacing for timeline continuity */
  margin: 0;
  
  &:hover {
    background-color: #FAFAFA;
  }
`;

const MonthDayNumber = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: ${props => props.$isToday ? '#FFFFFF' : '#000000'};
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background-color: ${props => props.$isToday ? '#000000' : 'transparent'};
  margin-bottom: 8px;
`;

const MonthEvent = styled.div`
  background: ${props => {
    const baseColor = props.$color || '#FFB5D8';
    return baseColor;
  }};
  border-radius: ${props => {
    if (props.$timelineType === 'start') return '8px 0px 0px 8px';
    if (props.$timelineType === 'end') return '0px 8px 8px 0px';
    if (props.$timelineType === 'middle') return '0px';
    return '8px';
  }};
  padding: ${props => props.$timelineType === 'middle' ? '6px 4px' : '6px 10px'};
  margin: ${props => {
    if (props.$timelineType === 'start') return '2px -1px 2px 2px';
    if (props.$timelineType === 'middle') return '2px -1px';
    if (props.$timelineType === 'end') return '2px 2px 2px -1px';
    return '2px';
  }};
  font-size: ${props => props.$timelineType === 'middle' ? '0px' : '11px'};
  font-weight: 500;
  color: #2c3e50;
  cursor: pointer;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  position: relative;
  min-height: 24px;
  display: flex;
  align-items: center;
  border: none;
  box-shadow: 0 1px 2px rgba(0,0,0,0.08);
  z-index: 10;
  transition: all 0.15s ease;
  
  /* Create continuous solid line appearance */
  ${props => props.$timelineType === 'middle' && `
    /* Middle segments show only a thin line indicator */
    background: ${props.$color};
    min-height: 4px;
    padding: 0;
    margin: 12px -1px;
    border-radius: 0;
    
    /* Small dot indicator in center */
    &::after {
      content: '';
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 6px;
      height: 6px;
      background: rgba(44, 62, 80, 0.3);
      border-radius: 50%;
    }
  `}
  
  /* Remove gaps between timeline segments */
  ${props => props.$timelineType === 'start' && `
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
  `}
  
  ${props => props.$timelineType === 'end' && `
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
  `}

  &:hover {
    transform: ${props => props.$timelineType === 'middle' ? 'scaleY(1.5)' : 'translateY(-1px)'};
    box-shadow: ${props => props.$timelineType === 'middle' ? 
      '0 0 4px rgba(0,0,0,0.2)' : 
      '0 2px 6px rgba(0,0,0,0.12)'
    };
  }
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
  grid-template-columns: ${props => 
    props.$view === 'day' ? '80px 1fr' :
    props.$view === 'week' ? '80px repeat(7, 1fr)' :
    'repeat(7, 1fr)'
  };
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

  // Generate consistent pastel colors for projects
  const getProjectColor = (project, index) => {
    const pastelColors = [
      '#FFB5D8', // Soft Pink
      '#B5D8FF', // Soft Blue  
      '#C8E6C9', // Soft Green
      '#FFE0B2', // Soft Orange
      '#D1C4E9', // Soft Purple
      '#B2DFDB', // Soft Teal
      '#FFF9C4', // Soft Yellow
      '#FFCCBC', // Soft Peach
      '#E1BEE7', // Soft Lavender
      '#C8E6C9', // Soft Mint
      '#F8BBD9', // Soft Rose
      '#DCEDC1', // Soft Lime
      '#BBDEFB', // Soft Sky Blue
      '#FFF8E1', // Soft Cream
      '#F3E5F5', // Soft Violet
      '#E0F2F1'  // Soft Seafoam
    ];
    
    // Use consistent assignment based on project name for predictable colors
    const projectHash = project.name.split('').reduce((hash, char) => hash + char.charCodeAt(0), 0);
    const colorIndex = projectHash % pastelColors.length;
    const selectedColor = pastelColors[colorIndex];
    
    return selectedColor;
  };

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
        console.log('Calendar: Projects with dates:', data.map(p => ({ name: p.name, startDate: p.startDate, dueDate: p.dueDate })));
        setProjects(data);
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  // Generate days based on current view
  const getViewDays = () => {
    const today = new Date();
    
    if (view === 'day') {
      return [{
        name: currentDate.toLocaleDateString('en-US', { weekday: 'short' }),
        number: currentDate.getDate(),
        fullDate: new Date(currentDate),
        isToday: currentDate.toDateString() === today.toDateString()
      }];
    } else if (view === 'week') {
      const currentDay = currentDate.getDay();
      const monday = new Date(currentDate);
      monday.setDate(currentDate.getDate() - currentDay + (currentDay === 0 ? -6 : 1));

      const days = [];
      for (let i = 0; i < 7; i++) {
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
    } else { // month view
      const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
      const lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
      const startDate = new Date(firstDay);
      const endDate = new Date(lastDay);
      
      // Start from the beginning of the week
      startDate.setDate(firstDay.getDate() - firstDay.getDay());
      // End at the end of the week
      endDate.setDate(lastDay.getDate() + (6 - lastDay.getDay()));
      
      const days = [];
      const current = new Date(startDate);
      
      while (current <= endDate) {
        days.push({
          name: current.toLocaleDateString('en-US', { weekday: 'short' }),
          number: current.getDate(),
          fullDate: new Date(current),
          isToday: current.toDateString() === today.toDateString(),
          isCurrentMonth: current.getMonth() === currentDate.getMonth()
        });
        current.setDate(current.getDate() + 1);
      }
      return days;
    }
  };

  const days = getViewDays();
  const timeSlots = ['8:00', '9:00', '10:00', '11:00', '12:00', '1:00', '2:00', '3:00', '4:00', '5:00'];

  // Convert projects to calendar events based on due dates and tasks
  const getEventsForDay = (date, viewType = 'week') => {
    const events = [];
    
    if (viewType === 'month') {
      // For month view, show timeline-style highlighting for projects
      projects.forEach((project, index) => {
          // Handle projects with both start and due dates (timeline)
        if (project.startDate && project.dueDate && 
            project.startDate !== 'TBD' && project.dueDate !== 'TBD') {
          const startDate = new Date(project.startDate);
          const dueDate = new Date(project.dueDate);
          const currentDate = new Date(date);
          
          // Check if current date is within project timeline
          if (currentDate >= startDate && currentDate <= dueDate) {
            const projectColor = getProjectColor(project, index);
            console.log(`Project ${project.name} assigned color: ${projectColor}`);            // Determine position in timeline
            let timelineType = 'middle';
            if (currentDate.toDateString() === startDate.toDateString()) {
              timelineType = 'start';
            } else if (currentDate.toDateString() === dueDate.toDateString()) {
              timelineType = 'end';
            }
            
            console.log(`Adding timeline event: ${project.name}, color: ${projectColor}, type: ${timelineType}`);
            events.push({
              title: project.name,
              color: projectColor,
              type: 'timeline',
              timelineType: timelineType,
              project: project,
              participants: project.collaborators?.slice(0, 3).map(collab => {
                if (typeof collab === 'string') return collab;
                const name = collab.userId?.name || collab.userId?.email || 'U';
                return name.substring(0, 2).toUpperCase();
              }) || [],
              status: project.status,
              progress: project.totalTasks > 0 
                ? Math.round((project.completedTasks / project.totalTasks) * 100) 
                : 0
            });
          }
        } else {
          // Handle projects with only start OR due date (show as single event)
          const projectColor = getProjectColor(project, index);
          console.log(`Single event project ${project.name} assigned color: ${projectColor}`);
          
          if (project.startDate && project.startDate !== 'TBD') {
            const startDate = new Date(project.startDate);
            if (startDate.toDateString() === date.toDateString()) {
              events.push({
                title: `${project.name} (Start)`,
                color: projectColor,
                type: 'single-event',
                project: project,
                participants: project.collaborators?.slice(0, 3).map(collab => {
                  if (typeof collab === 'string') return collab;
                  const name = collab.userId?.name || collab.userId?.email || 'U';
                  return name.substring(0, 2).toUpperCase();
                }) || [],
                status: project.status,
                progress: project.totalTasks > 0 
                  ? Math.round((project.completedTasks / project.totalTasks) * 100) 
                  : 0
              });
            }
          }
          
          if (project.dueDate && project.dueDate !== 'TBD') {
            const dueDate = new Date(project.dueDate);
            if (dueDate.toDateString() === date.toDateString()) {
              events.push({
                title: `${project.name} (Due)`,
                color: projectColor,
                type: 'single-event',
                project: project,
                participants: project.collaborators?.slice(0, 3).map(collab => {
                  if (typeof collab === 'string') return collab;
                  const name = collab.userId?.name || collab.userId?.email || 'U';
                  return name.substring(0, 2).toUpperCase();
                }) || [],
                status: project.status,
                progress: project.totalTasks > 0 
                  ? Math.round((project.completedTasks / project.totalTasks) * 100) 
                  : 0
              });
            }
          }
        }
      });
    } else {
      // For week/day view, show discrete events like before
      projects.forEach(project => {
        const eventsToAdd = [];
        
        // Check start date - always show if it exists
        if (project.startDate && project.startDate !== 'TBD') {
          const startDate = new Date(project.startDate);
          if (startDate.toDateString() === date.toDateString()) {
            eventsToAdd.push({
              eventTime: '8:00',
              eventType: 'project-start'
            });
          }
        }
        
        // Check due date - always show if it exists
        if (project.dueDate && project.dueDate !== 'TBD') {
          const dueDate = new Date(project.dueDate);
          if (dueDate.toDateString() === date.toDateString()) {
            eventsToAdd.push({
              eventTime: '9:00',
              eventType: 'project-due'
            });
          }
        }
        
        // Create events for each date type found
        eventsToAdd.forEach(({ eventTime, eventType }) => {
          const participants = project.collaborators?.slice(0, 3).map(collab => {
            if (typeof collab === 'string') return collab;
            const name = collab.userId?.name || collab.userId?.email || 'U';
            return name.substring(0, 2).toUpperCase();
          }) || [];

          // Use consistent project color with slight tinting for event types
          let eventColor = getProjectColor(project, projects.findIndex(p => p._id === project._id));
          let eventTitle = project.name;
          
          if (eventType === 'project-due') {
            eventTitle = `${project.name} (Due)`;
          } else if (eventType === 'project-start') {
            eventTitle = `${project.name} (Start)`;
          }
          
          events.push({
            time: eventTime,
            title: eventTitle,
            color: eventColor,
            participants,
            status: project.status,
            progress: project.totalTasks > 0 
              ? Math.round((project.completedTasks / project.totalTasks) * 100) 
              : 0,
            type: eventType,
            project: project
          });
        });
      });
    }

    // Add tasks with specific dates
    projects.forEach(project => {
      if (project.tasks) {
        project.tasks.forEach(task => {
          if (task.startDate || task.dueDate) {
            const taskStartDate = task.startDate ? new Date(task.startDate) : null;
            const taskDueDate = task.dueDate ? new Date(task.dueDate) : null;
            
            // Show task if it starts or ends on this date
            if ((taskStartDate && taskStartDate.toDateString() === date.toDateString()) ||
                (taskDueDate && taskDueDate.toDateString() === date.toDateString())) {
              
              events.push({
                time: '10:00', // Show tasks at 10am
                title: `${task.title} (${project.name})`,
                color: project.color || '#E8F4FD',
                participants: [],
                status: task.status || 'pending',
                progress: task.status === 'completed' ? 100 : 0,
                type: 'task',
                project: project,
                task: task
              });
            }
          }
        });
      }
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
          <ViewButton 
            $active={view === 'day'} 
            onClick={() => {
              console.log('Switching to day view');
              setView('day');
            }}
          >
            Day
          </ViewButton>
          <ViewButton 
            $active={view === 'week'} 
            onClick={() => {
              console.log('Switching to week view');
              setView('week');
            }}
          >
            Week
          </ViewButton>
          <ViewButton 
            $active={view === 'month'} 
            onClick={() => {
              console.log('Switching to month view');
              setView('month');
            }}
          >
            Month
          </ViewButton>
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
          {view === 'month' ? (
            <>
              <WeekHeader $view={view}>
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <DayHeader key={day}>
                    <DayName>{day}</DayName>
                  </DayHeader>
                ))}
              </WeekHeader>
              <MonthGrid>
                {days.map((day, index) => {
                  const dayEvents = getEventsForDay(day.fullDate, 'month');
                  return (
                    <MonthDay key={index} $isCurrentMonth={day.isCurrentMonth}>
                      <MonthDayNumber $isToday={day.isToday}>
                        {day.number}
                      </MonthDayNumber>
                      {dayEvents.map((event, eventIndex) => {
                        const project = event.project || projects.find(p => p.name === event.title);
                        return (
                          <MonthEvent 
                            key={eventIndex} 
                            $color={event.color}
                            $timelineType={event.timelineType}
                            onClick={() => project && handleEventClick(project)}
                            title={`${event.title} - ${event.progress}% complete`}
                          >
                            {event.timelineType === 'start' && (
                              <div style={{ 
                                display: 'flex', 
                                flexDirection: 'column',
                                width: '100%',
                                alignItems: 'flex-start'
                              }}>
                                <div style={{ 
                                  fontSize: '11px', 
                                  fontWeight: '700',
                                  lineHeight: '1.2',
                                  color: '#333'
                                }}>
                                  {event.title}
                                </div>
                                <div style={{ 
                                  fontSize: '9px', 
                                  color: 'rgba(0,0,0,0.6)',
                                  marginTop: '2px'
                                }}>
                                  {event.status}
                                </div>
                              </div>
                            )}
                            {event.timelineType === 'end' && (
                              <div style={{ 
                                display: 'flex', 
                                flexDirection: 'column',
                                width: '100%',
                                alignItems: 'flex-end',
                                textAlign: 'right'
                              }}>
                                <div style={{ 
                                  fontSize: '11px', 
                                  fontWeight: '700',
                                  lineHeight: '1.2',
                                  color: '#333'
                                }}>
                                  {event.title}
                                </div>
                                <div style={{ 
                                  fontSize: '9px', 
                                  color: 'rgba(0,0,0,0.6)',
                                  marginTop: '2px'
                                }}>
                                  {event.progress}%
                                </div>
                              </div>
                            )}
                            {event.timelineType === 'middle' && (
                              // Middle sections are handled by CSS ::after pseudo-element
                              null
                            )}
                            {event.type === 'single-event' && (
                              <div style={{ 
                                display: 'flex', 
                                flexDirection: 'column',
                                width: '100%'
                              }}>
                                <div style={{ 
                                  fontSize: '11px', 
                                  fontWeight: '700',
                                  lineHeight: '1.2',
                                  color: '#333'
                                }}>
                                  {event.title}
                                </div>
                                <div style={{ 
                                  fontSize: '9px', 
                                  color: 'rgba(0,0,0,0.6)',
                                  marginTop: '2px'
                                }}>
                                  {event.status}
                                </div>
                              </div>
                            )}
                          </MonthEvent>
                        );
                      })}
                    </MonthDay>
                  );
                })}
              </MonthGrid>
            </>
          ) : (
            <>
              <WeekHeader $view={view}>
                {view !== 'month' && <TimeLabel>Time</TimeLabel>}
                {days.map((day, index) => (
                  <DayHeader key={index}>
                    <DayName>{day.name}</DayName>
                    <DayNumber $isToday={day.isToday}>{day.number}</DayNumber>
                  </DayHeader>
                ))}
              </WeekHeader>

              <CalendarBody $view={view}>
                {timeSlots.map((time, timeIndex) => (
                  <React.Fragment key={timeIndex}>
                    {view !== 'month' && <TimeSlot>{time}</TimeSlot>}
                    {days.map((day, dayIndex) => {
                      const dayEvents = getEventsForDay(day.fullDate, view);
                      const timeEvents = dayEvents.filter(event => event.time === time);
                      
                      return (
                        <DayColumn key={dayIndex}>
                          {timeEvents.map((event, eventIndex) => {
                            const project = event.project || projects.find(p => p.name === event.title);
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
            </>
          )}
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
