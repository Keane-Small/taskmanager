import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FiPlus, FiMoreHorizontal, FiSearch, FiFilter, FiCalendar, FiArrowLeft, FiArrowRight, FiTrash2 } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import AddProjectModal from '../components/AddProjectModal';
import ConfirmModal from '../components/ConfirmModal';
import TaskModal from '../components/TaskModal';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const ContentBox = styled.div`
  position: fixed;
  left: 100px;
  top: 95px;
  right: 20px;
  bottom: 15px;
  background: linear-gradient(135deg, #4A56E2 0%, #7C3AED 50%, #9333EA 100%);
  border-radius: 20px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;

const ProjectHeader = styled.div`
  padding: 16px 32px;
  background: rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
`;

const TopRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`;

const Breadcrumb = styled.div`
  color: rgba(255, 255, 255, 0.7);
  font-size: 13px;
  margin-bottom: 8px;
`;

const ProjectTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const ChangeButton = styled.button`
  padding: 6px 16px;
  background: rgba(255, 255, 255, 0.15);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 8px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  backdrop-filter: blur(10px);
  transition: all 0.2s;

  &:hover {
    background: rgba(255, 255, 255, 0.25);
  }
`;

const ProjectMetadata = styled.div`
  display: grid;
  grid-template-columns: auto auto auto auto;
  gap: 32px;
  margin-bottom: 24px;
  color: white;
`;

const MetadataItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const MetadataLabel = styled.div`
  font-size: 12px;
  color: rgba(255, 255, 255, 0.7);
`;

const MetadataValue = styled.div`
  font-size: 14px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const Tag = styled.span`
  padding: 6px 14px;
  background: ${props => props.$color || 'rgba(255, 255, 255, 0.2)'};
  color: ${props => props.$textColor || '#000'};
  border-radius: 8px;
  font-size: 12px;
  font-weight: 600;
`;

const MembersRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const MembersLabel = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  color: white;
  font-size: 14px;
`;

const InviteButton = styled.button`
  padding: 8px 16px;
  background: rgba(255, 255, 255, 0.15);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 8px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  backdrop-filter: blur(10px);
  transition: all 0.2s;

  &:hover {
    background: rgba(255, 255, 255, 0.25);
  }
`;

const KanbanContainer = styled.div`
  flex: 1;
  background: #1a1a1a;
  padding: 24px;
  overflow: auto;
  display: flex;
  flex-direction: column;
`;

const KanbanToolbar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`;

const TaskCount = styled.div`
  color: rgba(255, 255, 255, 0.7);
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 12px;
`;

const AddNewButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background: #4A56E2;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #3A46D2;
    transform: translateY(-1px);
  }
`;

const ToolbarRight = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const SearchBar = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const SearchInput = styled.input`
  padding: 8px 12px 8px 36px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  color: white;
  font-size: 13px;
  width: 200px;

  &::placeholder {
    color: rgba(255, 255, 255, 0.4);
  }

  &:focus {
    outline: none;
    border-color: rgba(255, 255, 255, 0.3);
  }
`;

const SearchIcon = styled(FiSearch)`
  position: absolute;
  left: 12px;
  color: rgba(255, 255, 255, 0.4);
`;

const IconButton = styled.button`
  padding: 8px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  color: rgba(255, 255, 255, 0.7);
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  transition: all 0.2s;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    color: white;
  }
`;

const KanbanBoard = styled.div`
  display: flex;
  gap: 16px;
  flex: 1;
  overflow-x: auto;
  padding-bottom: 16px;
`;

const Column = styled.div`
  min-width: 320px;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 12px;
  padding: 16px;
  display: flex;
  flex-direction: column;
`;

const ColumnHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`;

const ColumnTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: white;
  font-size: 14px;
  font-weight: 600;
`;

const TaskCounter = styled.span`
  background: rgba(255, 255, 255, 0.1);
  padding: 2px 8px;
  border-radius: 10px;
  font-size: 12px;
`;

const ColumnActions = styled.div`
  display: flex;
  gap: 4px;
`;

const SmallIconButton = styled.button`
  width: 24px;
  height: 24px;
  background: transparent;
  border: none;
  color: rgba(255, 255, 255, 0.5);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: all 0.2s;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    color: white;
  }
`;

const TasksList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  overflow-y: auto;
  max-height: calc(100vh - 400px);
  padding-right: 4px;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.02);
    border-radius: 10px;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 10px;
  }
`;

const TaskCard = styled(motion.div)`
  background: ${props => props.$bgColor || '#A0E7C5'};
  border-radius: 12px;
  padding: 16px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
`;

const TaskDate = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  color: rgba(0, 0, 0, 0.6);
  font-size: 12px;
  margin-bottom: 8px;
`;

const TaskTitle = styled.div`
  color: #1a1a1a;
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 12px;
`;

const TaskFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 12px;
`;

const PriorityBadge = styled.span`
  padding: 4px 10px;
  background: ${props => {
    switch(props.$priority) {
      case 'high': return '#FF6B6B';
      case 'medium': return '#FFA726';
      case 'low': return '#66BB6A';
      default: return '#9E9E9E';
    }
  }};
  color: white;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
`;

const TaskAvatars = styled.div`
  display: flex;
  align-items: center;
`;

const TaskAvatar = styled.div`
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: linear-gradient(135deg, #4A56E2 0%, #7C3AED 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  font-weight: 600;
  margin-left: -8px;
  border: 2px solid ${props => props.$borderColor || '#A0E7C5'};

  &:first-child {
    margin-left: 0;
  }
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 6px;
  background: rgba(0, 0, 0, 0.1);
  border-radius: 3px;
  overflow: hidden;
  margin-top: 12px;
`;

const ProgressFill = styled.div`
  height: 100%;
  background: linear-gradient(135deg, #4A56E2 0%, #7C3AED 100%);
  border-radius: 3px;
  width: ${props => props.$progress || 0}%;
  transition: width 0.3s ease;
`;

const EmptyColumn = styled.div`
  text-align: center;
  color: rgba(255, 255, 255, 0.3);
  font-size: 14px;
  padding: 40px 20px;
`;



const ProjectsPage = () => {
  const { user } = useAuth();
  const [projectList, setProjectList] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleteConfirm, setDeleteConfirm] = useState({ isOpen: false, projectId: null, projectName: '' });

  useEffect(() => {
    fetchProjects();
  }, [user]);

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
        setProjectList(data);
      } else {
        setProjectList([]);
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
      setProjectList([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddProject = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSubmitProject = async (projectData) => {
    try {
      const token = localStorage.getItem('token');
      const newProject = {
        ...projectData,
        totalTasks: 0,
        completedTasks: 0
      };

      const response = await fetch(`${API_URL}/projects`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(newProject),
      });

      if (response.ok) {
        const createdProject = await response.json();
        setProjectList([...projectList, createdProject]);
        handleCloseModal();
      } else {
        const errorData = await response.json();
        console.error('Failed to create project:', errorData);
        alert(`Failed to create project: ${errorData.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error creating project:', error);
      alert('Error creating project. Please check console and try again.');
    }
  };

  const handleOpenProject = (project) => {
    setSelectedProject(project);
  };

  const handleDeleteProject = (projectId, projectName) => {
    setDeleteConfirm({ isOpen: true, projectId, projectName });
  };

  const confirmDelete = async () => {
    const { projectId } = deleteConfirm;
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/projects/${projectId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setProjectList(projectList.filter(p => (p._id || p.id) !== projectId));
      }
    } catch (error) {
      console.error('Error deleting project:', error);
    } finally {
      setDeleteConfirm({ isOpen: false, projectId: null, projectName: '' });
    }
  };

  const cancelDelete = () => {
    setDeleteConfirm({ isOpen: false, projectId: null, projectName: '' });
  };

  const calculatePercentage = (completed, total) => {
    if (total === 0) return 0;
    return Math.round((completed / total) * 100);
  };

  const handleAddTask = async (taskData) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/projects/${selectedProject._id}/tasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(taskData),
      });

      if (response.ok) {
        const newTask = await response.json();
        setTasks([...tasks, newTask]);
        setIsTaskModalOpen(false);
      } else {
        const errorData = await response.json();
        console.error('Failed to create task:', errorData);
        alert(`Failed to create task: ${errorData.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error creating task:', error);
      alert('Error creating task. Please try again.');
    }
  };

  const [tasks, setTasks] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch tasks when a project is selected
  useEffect(() => {
    if (selectedProject) {
      fetchTasks();
    }
  }, [selectedProject]);

  const fetchTasks = async () => {
    if (!selectedProject) return;
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/projects/${selectedProject._id}/tasks`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setTasks(data);
      } else {
        setTasks([]);
      }
    } catch (error) {
      console.error('Error fetching tasks:', error);
      setTasks([]);
    }
  };

  const getTasksByStatus = (status) => {
    return tasks.filter(task => task.status === status);
  };

  const getTaskColor = (index) => {
    const colors = ['#A0E7C5', '#FFD4A3', '#D4B5FF', '#A3D8FF'];
    return colors[index % colors.length];
  };

  const formatDate = (date) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const calculateTaskProgress = (task) => {
    // Simple progress calculation based on status
    if (task.status === 'completed') return 100;
    if (task.status === 'in-progress') return 50;
    return 0;
  };

  if (loading) {
    return (
      <ContentBox>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
          <p>Loading...</p>
        </div>
      </ContentBox>
    );
  }

  // Show Kanban board if a project is selected
  if (selectedProject) {
    const backlogTasks = getTasksByStatus('backlog');
    const inProgressTasks = getTasksByStatus('in-progress');
    const doneTasks = getTasksByStatus('completed');
    const archivedTasks = getTasksByStatus('archived');

    return (
      <ContentBox>
        <ProjectHeader>
          <TopRow>
            <Breadcrumb>
              <span onClick={() => setSelectedProject(null)} style={{ cursor: 'pointer' }}>Projects</span>
              <span style={{ margin: '0 8px', color: 'rgba(255, 255, 255, 0.5)' }}>/</span>
              <span>{selectedProject.name}</span>
            </Breadcrumb>
            <ChangeButton onClick={() => setSelectedProject(null)}>
              <FiArrowLeft size={14} style={{ marginRight: '4px' }} />
              Back
            </ChangeButton>
          </TopRow>
          <ProjectTitle>{selectedProject.name}</ProjectTitle>
          
          <ProjectMetadata>
            <MetadataItem>
              <MetadataLabel>Priority</MetadataLabel>
              <MetadataValue>
                <Tag 
                  $color={
                    selectedProject.priority === 'high' ? '#FF6B6B' :
                    selectedProject.priority === 'medium' ? '#FFA726' :
                    '#66BB6A'
                  } 
                  $textColor="white"
                >
                  {(selectedProject.priority || 'medium').toUpperCase()}
                </Tag>
              </MetadataValue>
            </MetadataItem>
            <MetadataItem>
              <MetadataLabel>Start Date</MetadataLabel>
              <MetadataValue>
                <FiCalendar size={14} />
                {formatDate(selectedProject.startDate) || 'Not set'}
              </MetadataValue>
            </MetadataItem>
            <MetadataItem>
              <MetadataLabel>Due Date</MetadataLabel>
              <MetadataValue>
                <FiCalendar size={14} />
                {formatDate(selectedProject.dueDate) || 'Not set'}
              </MetadataValue>
            </MetadataItem>
            <MetadataItem>
              <MetadataLabel>Status</MetadataLabel>
              <MetadataValue>{selectedProject.status || 'Active'}</MetadataValue>
            </MetadataItem>
          </ProjectMetadata>

          <MembersRow>
            <MembersLabel>
              <span style={{ fontWeight: 600 }}>Team Members:</span>
              <TaskAvatars>
                {selectedProject.collaborators && selectedProject.collaborators.length > 0 ? (
                  selectedProject.collaborators.slice(0, 4).map((collab, index) => {
                    let displayText = '??';
                    if (typeof collab === 'string') {
                      displayText = collab.substring(0, 2).toUpperCase();
                    } else if (collab.userId) {
                      if (typeof collab.userId === 'object') {
                        displayText = collab.userId.name?.substring(0, 2).toUpperCase() || 
                                     collab.userId.email?.substring(0, 2).toUpperCase() || '??';
                      } else {
                        displayText = 'U' + index;
                      }
                    }
                    return <TaskAvatar key={index} $borderColor="transparent">{displayText}</TaskAvatar>;
                  })
                ) : (
                  <span style={{ fontSize: '13px', color: 'rgba(255, 255, 255, 0.6)', marginLeft: '8px' }}>No members yet</span>
                )}
              </TaskAvatars>
            </MembersLabel>
            <InviteButton>
              <FiPlus size={14} style={{ marginRight: '4px' }} />
              Invite
            </InviteButton>
          </MembersRow>
        </ProjectHeader>

        <KanbanContainer>
          <KanbanToolbar>
            <TaskCount>
              <span>All Tasks: {tasks.length}</span>
            </TaskCount>
            <ToolbarRight>
              <SearchBar>
                <SearchIcon />
                <SearchInput 
                  type="text" 
                  placeholder="Type to search..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </SearchBar>
              <IconButton>
                <FiFilter size={16} />
                Filters
              </IconButton>
              <IconButton>
                <FiCalendar size={16} />
                Sort
              </IconButton>
              <AddNewButton onClick={() => setIsTaskModalOpen(true)}>
                <FiPlus size={16} />
                Add Task
              </AddNewButton>
            </ToolbarRight>
          </KanbanToolbar>

          <KanbanBoard>
            {/* BACKLOG Column */}
            <Column>
              <ColumnHeader>
                <ColumnTitle>
                  BACKLOG <TaskCounter>{backlogTasks.length}</TaskCounter>
                </ColumnTitle>
                <ColumnActions>
                  <SmallIconButton><FiPlus size={14} /></SmallIconButton>
                  <SmallIconButton><FiMoreHorizontal size={14} /></SmallIconButton>
                </ColumnActions>
              </ColumnHeader>
              <TasksList>
                {backlogTasks.length > 0 ? backlogTasks.map((task, index) => (
                  <TaskCard
                    key={task._id}
                    $bgColor={getTaskColor(index)}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <TaskDate>
                      <FiCalendar size={12} />
                      {formatDate(task.dueDate) || 'No date'}
                    </TaskDate>
                    <TaskTitle>{task.title}</TaskTitle>
                    <TaskFooter>
                      <PriorityBadge $priority={task.priority}>{task.priority || 'low'}</PriorityBadge>
                      <TaskAvatars>
                        {task.assignedTo && task.assignedTo.slice(0, 2).map((user, i) => (
                          <TaskAvatar key={i} $borderColor={getTaskColor(index)}>
                            {typeof user === 'object' ? user.name?.substring(0, 2).toUpperCase() : 'U'}
                          </TaskAvatar>
                        ))}
                      </TaskAvatars>
                    </TaskFooter>
                    {task.status === 'in-progress' && (
                      <ProgressBar>
                        <ProgressFill $progress={calculateTaskProgress(task)} />
                      </ProgressBar>
                    )}
                  </TaskCard>
                )) : (
                  <EmptyColumn>No tasks in backlog</EmptyColumn>
                )}
              </TasksList>
            </Column>

            {/* IN PROGRESS Column */}
            <Column>
              <ColumnHeader>
                <ColumnTitle>
                  IN PROGRESS <TaskCounter>{inProgressTasks.length}</TaskCounter>
                </ColumnTitle>
                <ColumnActions>
                  <SmallIconButton><FiPlus size={14} /></SmallIconButton>
                  <SmallIconButton><FiMoreHorizontal size={14} /></SmallIconButton>
                </ColumnActions>
              </ColumnHeader>
              <TasksList>
                {inProgressTasks.length > 0 ? inProgressTasks.map((task, index) => (
                  <TaskCard
                    key={task._id}
                    $bgColor={getTaskColor(index + 1)}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <TaskDate>
                      <FiCalendar size={12} />
                      {formatDate(task.dueDate) || 'No date'}
                    </TaskDate>
                    <TaskTitle>{task.title}</TaskTitle>
                    <TaskFooter>
                      <PriorityBadge $priority={task.priority}>{task.priority || 'medium'}</PriorityBadge>
                      <TaskAvatars>
                        {task.assignedTo && task.assignedTo.slice(0, 2).map((user, i) => (
                          <TaskAvatar key={i} $borderColor={getTaskColor(index + 1)}>
                            {typeof user === 'object' ? user.name?.substring(0, 2).toUpperCase() : 'U'}
                          </TaskAvatar>
                        ))}
                      </TaskAvatars>
                    </TaskFooter>
                    <ProgressBar>
                      <ProgressFill $progress={calculateTaskProgress(task)} />
                    </ProgressBar>
                  </TaskCard>
                )) : (
                  <EmptyColumn>No tasks in progress</EmptyColumn>
                )}
              </TasksList>
            </Column>

            {/* DONE Column */}
            <Column>
              <ColumnHeader>
                <ColumnTitle>
                  DONE <TaskCounter>{doneTasks.length}</TaskCounter>
                </ColumnTitle>
                <ColumnActions>
                  <SmallIconButton><FiPlus size={14} /></SmallIconButton>
                  <SmallIconButton><FiMoreHorizontal size={14} /></SmallIconButton>
                </ColumnActions>
              </ColumnHeader>
              <TasksList>
                {doneTasks.length > 0 ? doneTasks.map((task, index) => (
                  <TaskCard
                    key={task._id}
                    $bgColor={getTaskColor(index + 2)}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <TaskDate>
                      <FiCalendar size={12} />
                      {formatDate(task.dueDate) || 'No date'}
                    </TaskDate>
                    <TaskTitle>{task.title}</TaskTitle>
                    <TaskFooter>
                      <PriorityBadge $priority={task.priority}>{task.priority || 'low'}</PriorityBadge>
                      <TaskAvatars>
                        {task.assignedTo && task.assignedTo.slice(0, 2).map((user, i) => (
                          <TaskAvatar key={i} $borderColor={getTaskColor(index + 2)}>
                            {typeof user === 'object' ? user.name?.substring(0, 2).toUpperCase() : 'U'}
                          </TaskAvatar>
                        ))}
                      </TaskAvatars>
                    </TaskFooter>
                    <ProgressBar>
                      <ProgressFill $progress={100} />
                    </ProgressBar>
                  </TaskCard>
                )) : (
                  <EmptyColumn>No completed tasks</EmptyColumn>
                )}
              </TasksList>
            </Column>

            {/* ARCHIVED Column */}
            <Column>
              <ColumnHeader>
                <ColumnTitle>
                  ARCHIVED <TaskCounter>{archivedTasks.length}</TaskCounter>
                </ColumnTitle>
                <ColumnActions>
                  <SmallIconButton><FiPlus size={14} /></SmallIconButton>
                  <SmallIconButton><FiMoreHorizontal size={14} /></SmallIconButton>
                </ColumnActions>
              </ColumnHeader>
              <TasksList>
                {archivedTasks.length > 0 ? archivedTasks.map((task, index) => (
                  <TaskCard
                    key={task._id}
                    $bgColor={getTaskColor(index + 3)}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <TaskDate>
                      <FiCalendar size={12} />
                      {formatDate(task.dueDate) || 'No date'}
                    </TaskDate>
                    <TaskTitle>{task.title}</TaskTitle>
                    <TaskFooter>
                      <PriorityBadge $priority={task.priority}>{task.priority || 'low'}</PriorityBadge>
                      <TaskAvatars>
                        {task.assignedTo && task.assignedTo.slice(0, 2).map((user, i) => (
                          <TaskAvatar key={i} $borderColor={getTaskColor(index + 3)}>
                            {typeof user === 'object' ? user.name?.substring(0, 2).toUpperCase() : 'U'}
                          </TaskAvatar>
                        ))}
                      </TaskAvatars>
                    </TaskFooter>
                  </TaskCard>
                )) : (
                  <EmptyColumn>No archived tasks</EmptyColumn>
                )}
              </TasksList>
            </Column>
          </KanbanBoard>
        </KanbanContainer>

        <TaskModal
          isOpen={isTaskModalOpen}
          onClose={() => setIsTaskModalOpen(false)}
          onSubmit={handleAddTask}
          projectId={selectedProject._id}
        />

        <ConfirmModal
          isOpen={deleteConfirm.isOpen}
          title="Delete Project"
          message={`Are you sure you want to delete "${deleteConfirm.projectName}"? This action cannot be undone.`}
          onConfirm={confirmDelete}
          onCancel={cancelDelete}
          confirmText="Delete"
          cancelText="Cancel"
        />
      </ContentBox>
    );
  }

  // Show project list when no project is selected
  return (
    <ContentBox>
      <ProjectHeader style={{ marginBottom: '24px' }}>
        <TopRow>
          <div style={{ color: 'white', fontSize: '24px', fontWeight: '600' }}>All Projects</div>
          <AddNewButton onClick={handleAddProject}>
            <FiPlus size={16} />
            Create Project
          </AddNewButton>
        </TopRow>
      </ProjectHeader>

      <AddProjectModal 
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmitProject}
      />

      <ConfirmModal
        isOpen={deleteConfirm.isOpen}
        title="Delete Project"
        message={`Are you sure you want to delete "${deleteConfirm.projectName}"? This action cannot be undone.`}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
        confirmText="Delete"
        cancelText="Cancel"
      />

      <KanbanContainer>
        {projectList.length === 0 ? (
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'center', 
            height: '60vh',
            gap: '20px'
          }}>
            <h2 style={{ color: 'rgba(255, 255, 255, 0.8)' }}>No Projects Yet</h2>
            <p style={{ color: 'rgba(255, 255, 255, 0.5)' }}>Create your first project to get started</p>
            <AddNewButton onClick={handleAddProject}>
              <FiPlus size={18} />
              Create New Project
            </AddNewButton>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px' }}>
            {projectList.map((project, index) => (
              <TaskCard
                key={project._id || project.id}
                $bgColor={getTaskColor(index)}
                onClick={() => handleOpenProject(project)}
                initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{ scale: 1.02 }}
                  >
                    <TaskDate>
                      <FiCalendar size={12} />
                      {formatDate(project.dueDate) || 'No due date'}
                    </TaskDate>
                    <TaskTitle>{project.name}</TaskTitle>
                    <div style={{ fontSize: '13px', color: 'rgba(0, 0, 0, 0.6)', marginBottom: '8px' }}>
                      Status: {project.status || 'Active'}
                    </div>
                    <TaskFooter>
                      <div style={{ fontSize: '12px', color: 'rgba(0, 0, 0, 0.7)' }}>
                        {project.completedTasks || 0}/{project.totalTasks || 0} tasks
                      </div>
                      <TaskAvatars>
                        {project.collaborators && project.collaborators.length > 0 ? (
                          project.collaborators.slice(0, 3).map((collab, i) => {
                            let displayText = '??';
                            if (typeof collab === 'string') {
                              displayText = collab.substring(0, 2).toUpperCase();
                            } else if (collab.userId) {
                              if (typeof collab.userId === 'object') {
                                displayText = collab.userId.name?.substring(0, 2).toUpperCase() || 
                                             collab.userId.email?.substring(0, 2).toUpperCase() || '??';
                              } else {
                                displayText = 'U' + i;
                              }
                            }
                            return <TaskAvatar key={i} $borderColor={getTaskColor(index)}>{displayText}</TaskAvatar>;
                          })
                        ) : null}
                      </TaskAvatars>
                    </TaskFooter>
                    <ProgressBar>
                      <ProgressFill $progress={calculatePercentage(project.completedTasks, project.totalTasks)} />
                    </ProgressBar>
                  </TaskCard>
            ))}
          </div>
        )}
      </KanbanContainer>
    </ContentBox>
  );
};

export default ProjectsPage;
