import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FiArrowRight, FiPlus } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import AddProjectModal from '../components/AddProjectModal';
import TaskBoard from '../components/TaskBoard';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const ContentBox = styled.div`
  position: fixed;
  left: 95px;
  top: 10px;
  right: 15px;
  bottom: 10px;
  background-color: #FFFFFF;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
  padding: 30px;
  overflow-y: auto;
`;

const Heading = styled.h1`
  margin: 0 0 30px 0;
  font-size: 32px;
  font-weight: 600;
  color: #000000;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
`;

const AddProjectButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  background-color: #000000;
  color: #FFFFFF;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s, transform 0.2s;
  
  &:hover {
    background-color: #333333;
    transform: scale(1.05);
  }
  
  &:active {
    transform: scale(0.98);
  }
`;

const ProjectsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
`;

const ProjectCard = styled.div`
  position: relative;
  background-color: ${props => props.color || '#F9F9F9'};
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: transform 0.2s, box-shadow 0.2s;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
`;

const ArrowButton = styled.button`
  position: absolute;
  top: 20px;
  right: 20px;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: rgba(0, 0, 0, 0.05);
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s, transform 0.2s;
  
  &:hover {
    background-color: rgba(0, 0, 0, 0.1);
    transform: scale(1.1);
  }
  
  &:active {
    transform: scale(0.95);
  }
`;

const ProjectName = styled.h2`
  margin: 0 0 12px 0;
  font-size: 20px;
  font-weight: 600;
  color: #000000;
  padding-right: 40px;
`;

const ProjectInfo = styled.div`
  margin-bottom: 8px;
  font-size: 14px;
  color: #666;
`;

const Label = styled.span`
  font-weight: 600;
  color: #333;
`;

const Collaborators = styled.div`
  display: flex;
  align-items: center;
  margin-top: 12px;
`;

const ProgressSection = styled.div`
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
`;

const ProgressHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
`;

const ProgressLabel = styled.span`
  font-size: 12px;
  font-weight: 600;
  color: #666;
`;

const ProgressPercentage = styled.span`
  font-size: 18px;
  font-weight: 700;
  color: #000;
`;

const ProgressBarContainer = styled.div`
  width: 100%;
  height: 8px;
  background-color: rgba(0, 0, 0, 0.1);
  border-radius: 4px;
  overflow: hidden;
`;

const ProgressBarFill = styled.div`
  height: 100%;
  background-color: #000000;
  border-radius: 4px;
  transition: width 0.3s ease;
  width: ${props => props.$percentage}%;
`;

const Avatar = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: #FFFDD0;
  border: 2px solid #fff;
  margin-left: -8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 600;
  color: #000;
  
  &:first-child {
    margin-left: 0;
  }
`;

const projectColors = ['#FFE5E5', '#E5F3FF', '#E5FFE5', '#FFF5E5', '#F5E5FF', '#FFE5F5', '#E5FFFF', '#FFEBE5', '#E5F5E5'];

const ProjectsPage = () => {
  const { user } = useAuth();
  const [projectList, setProjectList] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [loading, setLoading] = useState(true);

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
        color: projectColors[projectList.length % projectColors.length],
        totalTasks: 0,
        completedTasks: 0,
        userId: user?._id || user?.id
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
        console.error('Failed to create project');
      }
    } catch (error) {
      console.error('Error creating project:', error);
    }
  };

  const handleOpenProject = (project) => {
    setSelectedProject(project);
  };

  const handleCloseProject = () => {
    setSelectedProject(null);
  };

  const calculatePercentage = (completed, total) => {
    if (total === 0) return 0;
    return Math.round((completed / total) * 100);
  };

  // If a project is selected, show the task board
  if (selectedProject) {
    return <TaskBoard project={selectedProject} onClose={handleCloseProject} />;
  }

  if (loading) {
    return (
      <ContentBox>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
          <p>Loading projects...</p>
        </div>
      </ContentBox>
    );
  }

  return (
    <ContentBox>
      <Header>
        <Heading>Projects</Heading>
        <AddProjectButton onClick={handleAddProject}>
          <FiPlus size={18} />
          Add Project
        </AddProjectButton>
      </Header>
      
      <AddProjectModal 
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmitProject}
      />

      {projectList.length === 0 ? (
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          justifyContent: 'center', 
          height: '60%',
          gap: '20px'
        }}>
          <h2 style={{ color: '#666' }}>No Projects Yet</h2>
          <p style={{ color: '#999' }}>Create your first project to get started</p>
          <AddProjectButton onClick={handleAddProject}>
            <FiPlus size={18} />
            Create New Project
          </AddProjectButton>
        </div>
      ) : (
        <ProjectsGrid>
          {projectList.map(project => {
            const percentage = calculatePercentage(project.completedTasks, project.totalTasks);
            
            // Debug: log collaborators structure
            if (project.collaborators && project.collaborators.length > 0) {
              console.log('Project collaborators:', project.name, project.collaborators);
            }
            
            return (
              <ProjectCard key={project._id || project.id} color={project.color}>
                <ArrowButton onClick={() => handleOpenProject(project)}>
                  <FiArrowRight size={18} />
                </ArrowButton>
                <ProjectName>{project.name}</ProjectName>
                <ProjectInfo>
                  <Label>Status:</Label> {project.status}
                </ProjectInfo>
                <ProjectInfo>
                  <Label>Due Date:</Label> {project.dueDate}
                </ProjectInfo>
                <Collaborators>
                  <Label style={{ marginRight: '8px' }}>Team:</Label>
                  {project.collaborators && project.collaborators.length > 0 ? (
                    project.collaborators.map((collab, index) => {
                      // Handle both old format (string) and new format (object)
                      let displayText = '??';
                      
                      if (typeof collab === 'string') {
                        displayText = collab;
                      } else if (collab.userId) {
                        if (typeof collab.userId === 'object') {
                          // Populated user object
                          displayText = collab.userId.name?.substring(0, 2).toUpperCase() || 
                                       collab.userId.email?.substring(0, 2).toUpperCase() || 
                                       '??';
                        } else {
                          // Just an ID
                          displayText = 'U' + index;
                        }
                      }
                      
                      return <Avatar key={index}>{displayText}</Avatar>;
                    })
                  ) : (
                    <span style={{ fontSize: '14px', color: '#999' }}>No team members</span>
                  )}
                </Collaborators>
                <ProgressSection>
                  <ProgressHeader>
                    <ProgressLabel>Progress</ProgressLabel>
                    <ProgressPercentage>{percentage}%</ProgressPercentage>
                  </ProgressHeader>
                  <ProgressBarContainer>
                    <ProgressBarFill $percentage={percentage} />
                  </ProgressBarContainer>
                </ProgressSection>
              </ProjectCard>
            );
          })}
        </ProjectsGrid>
      )}
    </ContentBox>
  );
};

export default ProjectsPage;
