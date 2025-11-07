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
  background: linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%);
  border-radius: 16px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: 0 4px 20px rgba(45, 90, 61, 0.08);

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

const ProjectHeader = styled.div`
  background: linear-gradient(135deg, #f0f9f3 0%, #e8f5ea 100%);
  color: #1a4d2a;
  padding: 2rem;
  position: relative;
  overflow: hidden;
  border-bottom: 3px solid #2D5A3D;

  &::before {
    content: '';
    position: absolute;
    top: -50%;
    right: -10%;
    width: 200px;
    height: 200px;
    background: rgba(45, 90, 61, 0.05);
    border-radius: 50%;
  }

  &::after {
    content: '';
    position: absolute;
    bottom: -30%;
    left: -5%;
    width: 150px;
    height: 150px;
    background: rgba(45, 90, 61, 0.03);
    border-radius: 50%;
  }

  @media (max-width: 768px) {
    padding: 1.5rem;
  }
`;

const TopRow = styled.div`
  position: relative;
  z-index: 2;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }
`;

const Breadcrumb = styled.div`
  position: relative;
  z-index: 2;
  color: rgba(26, 77, 42, 0.8);
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
  font-weight: 500;
`;

const ProjectTitle = styled.h1`
  position: relative;
  z-index: 2;
  margin: 0;
  font-size: 2rem;
  font-weight: 700;
  color: #1a4d2a;
  display: flex;
  align-items: center;
  gap: 12px;

  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

const ChangeButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  background: rgba(45, 90, 61, 0.1);
  color: #1a4d2a;
  border: 1px solid rgba(45, 90, 61, 0.3);
  border-radius: 12px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
  position: relative;
  z-index: 2;

  &:hover {
    background: rgba(45, 90, 61, 0.2);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(45, 90, 61, 0.2);
  }

  @media (max-width: 768px) {
    width: 100%;
    justify-content: center;
  }
`;

const ProjectMetadata = styled.div`
  position: relative;
  z-index: 2;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2rem;
  margin-bottom: 1.5rem;
  color: #1a4d2a;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
`;

const MetadataItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 1rem;
  background: rgba(45, 90, 61, 0.05);
  border-radius: 12px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(45, 90, 61, 0.2);
`;

const MetadataLabel = styled.div`
  font-size: 0.85rem;
  color: rgba(26, 77, 42, 0.7);
  font-weight: 500;
`;

const MetadataValue = styled.div`
  font-size: 1rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
  color: #1a4d2a;
`;

const Tag = styled.span`
  padding: 0.5rem 1rem;
  background: ${props => props.$color || 'rgba(255, 255, 255, 0.2)'};
  color: ${props => props.$textColor || '#000'};
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const MembersRow = styled.div`
  position: relative;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  background: rgba(45, 90, 61, 0.05);
  border-radius: 12px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(45, 90, 61, 0.2);
`;

const MembersLabel = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  color: #1a4d2a;
  font-size: 1rem;
  font-weight: 600;
`;

const InviteButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  background: rgba(45, 90, 61, 0.1);
  color: #1a4d2a;
  border: 1px solid rgba(45, 90, 61, 0.3);
  border-radius: 12px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;

  &:hover {
    background: rgba(45, 90, 61, 0.2);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(45, 90, 61, 0.2);
  }
`;

const KanbanContainer = styled.div`
  flex: 1;
  background: #ffffff;
  padding: 2rem;
  overflow: auto;
  display: flex;
  flex-direction: column;

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const KanbanToolbar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid rgba(45, 90, 61, 0.1);

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }
`;

const TaskCount = styled.div`
  color: #6b7280;
  font-size: 1rem;
  display: flex;
  align-items: center;
  gap: 12px;
  font-weight: 500;
`;

const AddNewButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.875rem 1.5rem;
  background: linear-gradient(135deg, #2D5A3D 0%, #3A6B4D 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(45, 90, 61, 0.3);

  &:hover {
    background: linear-gradient(135deg, #1F3E2A 0%, #2D5A3D 100%);
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(45, 90, 61, 0.4);
  }

  &:active {
    transform: translateY(0);
  }
`;

const ToolbarRight = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;

  @media (max-width: 768px) {
    width: 100%;
    justify-content: space-between;
  }
`;

const SearchBar = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const SearchInput = styled.input`
  padding: 0.75rem 1rem 0.75rem 2.5rem;
  background: #ffffff;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  color: #374151;
  font-size: 0.95rem;
  width: 250px;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: #2D5A3D;
    box-shadow: 0 0 0 3px rgba(45, 90, 61, 0.1);
  }

  &::placeholder {
    color: #9ca3af;
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
  gap: 1.5rem;
  flex: 1;
  overflow-x: auto;
  padding-bottom: 1rem;

  @media (max-width: 768px) {
    gap: 1rem;
  }
`;

const Column = styled.div`
  min-width: 320px;
  background: #f9fafb;
  border: 1px solid rgba(45, 90, 61, 0.1);
  border-radius: 16px;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  box-shadow: 0 4px 12px rgba(45, 90, 61, 0.05);
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 8px 24px rgba(45, 90, 61, 0.1);
    transform: translateY(-2px);
  }

  @media (max-width: 768px) {
    min-width: 280px;
    padding: 1rem;
  }
`;

const ColumnHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid rgba(45, 90, 61, 0.1);
`;

const ColumnTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: #2D5A3D;
  font-size: 1.1rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const TaskCounter = styled.span`
  background: rgba(45, 90, 61, 0.1);
  color: #2D5A3D;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
`;

const ColumnActions = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const SmallIconButton = styled.button`
  width: 32px;
  height: 32px;
  background: transparent;
  border: 1px solid rgba(45, 90, 61, 0.2);
  color: #6b7280;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(45, 90, 61, 0.1);
    color: #2D5A3D;
    border-color: #2D5A3D;
    transform: scale(1.05);
  }
`;

const TasksList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  overflow-y: auto;
  max-height: calc(100vh - 400px);
  padding-right: 0.5rem;

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: #f3f4f6;
    border-radius: 12px;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(45, 90, 61, 0.3);
    border-radius: 12px;
    
    &:hover {
      background: rgba(45, 90, 61, 0.5);
    }
  }
`;

const TaskCard = styled(motion.div)`
  background: ${props => props.$bgColor || '#ffffff'};
  border: 1px solid rgba(45, 90, 61, 0.15);
  border-radius: 12px;
  padding: 1.25rem;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(45, 90, 61, 0.08);

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 24px rgba(45, 90, 61, 0.15);
    border-color: rgba(45, 90, 61, 0.25);
  }
`;

const TaskDate = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #6b7280;
  font-size: 0.8rem;
  margin-bottom: 0.75rem;
  font-weight: 500;
`;

const TaskTitle = styled.div`
  color: #000000;
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 1rem;
  line-height: 1.4;
`;

const TaskFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid rgba(45, 90, 61, 0.1);
`;

const PriorityBadge = styled.span`
  padding: 0.375rem 0.875rem;
  background: ${props => {
    switch(props.$priority) {
      case 'high': return 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)';
      case 'medium': return 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)';
      case 'low': return 'linear-gradient(135deg, #2D5A3D 0%, #3A6B4D 100%)';
      default: return 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)';
    }
  }};
  color: white;
  border-radius: 20px;
  font-size: 0.75rem;
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
  background: linear-gradient(135deg, #2D5A3D 0%, #3A6B4D 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  font-weight: 600;
  margin-left: -8px;
  border: 2px solid ${props => props.$borderColor || '#ffffff'};

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
  background: linear-gradient(135deg, #2D5A3D 0%, #3A6B4D 100%);
  border-radius: 3px;
  width: ${props => props.$progress || 0}%;
  transition: width 0.3s ease;
`;

const EmptyColumn = styled.div`
  text-align: center;
  color: rgba(45, 90, 61, 0.5);
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
        // Update project list and clear selected project if it was deleted
        setProjectList(projectList.filter(p => (p._id || p.id) !== projectId));
        if (selectedProject && selectedProject._id === projectId) {
          setSelectedProject(null);
        }
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
      const taskDataWithProject = {
        ...taskData,
        projectId: selectedProject._id
      };
      const response = await fetch(`${API_URL}/tasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(taskDataWithProject),
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
      const response = await fetch(`${API_URL}/tasks/project/${selectedProject._id}`, {
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

  const getTaskColor = (project, index) => {
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
    
    // Use consistent assignment based on project name (same logic as calendar)
    if (project && project.name) {
      const projectHash = project.name.split('').reduce((hash, char) => hash + char.charCodeAt(0), 0);
      const colorIndex = projectHash % pastelColors.length;
      return pastelColors[colorIndex];
    }
    
    // Fallback to index-based for other cases
    return pastelColors[index % pastelColors.length];
  };

  const formatDate = (date) => {
    if (!date || date === null || date === undefined || date === 'TBD') return '';
    
    try {
      const dateObj = new Date(date);
      // Check if date is valid
      if (isNaN(dateObj.getTime())) return '';
      return dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    } catch (error) {
      return '';
    }
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
            <div style={{ display: 'flex', gap: '8px' }}>
              <ChangeButton 
                onClick={() => handleDeleteProject(selectedProject._id, selectedProject.name)}
                style={{ backgroundColor: '#dc2626', border: '1px solid #dc2626' }}
              >
                <FiTrash2 size={14} style={{ marginRight: '4px' }} />
                Delete
              </ChangeButton>
              <ChangeButton onClick={() => setSelectedProject(null)}>
                <FiArrowLeft size={14} style={{ marginRight: '4px' }} />
                Back
              </ChangeButton>
            </div>
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
            {selectedProject.startDate && (
              <MetadataItem>
                <MetadataLabel>Start Date</MetadataLabel>
                <MetadataValue>
                  <FiCalendar size={14} />
                  {formatDate(selectedProject.startDate)}
                </MetadataValue>
              </MetadataItem>
            )}
            <MetadataItem>
              <MetadataLabel>Due Date</MetadataLabel>
              <MetadataValue>
                <FiCalendar size={14} />
                {formatDate(selectedProject.dueDate) || 'No due date'}
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
                    $bgColor={getTaskColor(selectedProject, index)}
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
                          <TaskAvatar key={i} $borderColor={getTaskColor(selectedProject, index)}>
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
                    $bgColor={getTaskColor(selectedProject, index + 1)}
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
                          <TaskAvatar key={i} $borderColor={getTaskColor(selectedProject, index + 1)}>
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
                    $bgColor={getTaskColor(selectedProject, index + 2)}
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
          <div style={{ color: '#1a4d2a', fontSize: '24px', fontWeight: '600' }}>All Projects</div>
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
            <h2 style={{ color: '#2D5A3D', fontWeight: '600' }}>No Projects Yet</h2>
            <p style={{ color: '#6b7280' }}>Create your first project to get started</p>
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
