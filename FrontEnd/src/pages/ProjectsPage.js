import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FiArrowRight, FiPlus } from 'react-icons/fi';
import AddProjectModal from '../components/AddProjectModal';
import TaskBoard from '../components/TaskBoard';
import { projectsAPI } from '../services/api';

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
  width: ${props => props.percentage}%;
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

const projects = [
  {
    id: 1,
    name: 'Website Redesign',
    status: 'In Progress',
    dueDate: 'Nov 15, 2025',
    collaborators: ['JD', 'SM', 'AL'],
    color: '#FFE5E5',
    totalTasks: 10,
    completedTasks: 6
  },
  {
    id: 2,
    name: 'Mobile App Development',
    status: 'Planning',
    dueDate: 'Dec 30, 2025',
    collaborators: ['KS', 'RJ'],
    color: '#E5F3FF',
    totalTasks: 15,
    completedTasks: 2
  },
  {
    id: 3,
    name: 'Marketing Campaign',
    status: 'Completed',
    dueDate: 'Oct 20, 2025',
    collaborators: ['TW', 'BH', 'CN', 'PM'],
    color: '#E5FFE5',
    totalTasks: 8,
    completedTasks: 8
  },
  {
    id: 4,
    name: 'Database Migration',
    status: 'In Progress',
    dueDate: 'Nov 25, 2025',
    collaborators: ['MK', 'LP'],
    color: '#FFF5E5',
    totalTasks: 12,
    completedTasks: 7
  },
  {
    id: 5,
    name: 'API Integration',
    status: 'In Progress',
    dueDate: 'Nov 10, 2025',
    collaborators: ['GH', 'NP', 'QR'],
    color: '#F5E5FF',
    totalTasks: 20,
    completedTasks: 15
  },
  {
    id: 6,
    name: 'User Testing Phase',
    status: 'Planning',
    dueDate: 'Dec 5, 2025',
    collaborators: ['YZ', 'AB'],
    color: '#FFE5F5',
    totalTasks: 6,
    completedTasks: 1
  },
  {
    id: 7,
    name: 'Security Audit',
    status: 'Completed',
    dueDate: 'Oct 15, 2025',
    collaborators: ['CD', 'EF', 'GH'],
    color: '#E5FFFF',
    totalTasks: 10,
    completedTasks: 10
  },
  {
    id: 8,
    name: 'Content Management System',
    status: 'In Progress',
    dueDate: 'Dec 20, 2025',
    collaborators: ['IJ', 'KL', 'MN', 'OP'],
    color: '#FFEBE5',
    totalTasks: 18,
    completedTasks: 9
  },
  {
    id: 9,
    name: 'Analytics Dashboard',
    status: 'Planning',
    dueDate: 'Jan 10, 2026',
    collaborators: ['QR', 'ST'],
    color: '#E5F5E5',
    totalTasks: 14,
    completedTasks: 3
  }
];

const projectColors = ['#FFE5E5', '#E5F3FF', '#E5FFE5', '#FFF5E5', '#F5E5FF', '#FFE5F5', '#E5FFFF', '#FFEBE5', '#E5F5E5'];

const ProjectsPage = () => {
  const [projectList, setProjectList] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch projects from API
  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await projectsAPI.getAll();
      setProjectList(response.data);
    } catch (err) {
      console.error('Error fetching projects:', err);
      setError('Failed to load projects. Using demo data.');
      // Fallback to mock data if API fails
      setProjectList(projects);
    } finally {
      setIsLoading(false);
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
      const newProject = {
        name: projectData.name,
        status: projectData.status,
        dueDate: projectData.dueDate,
        collaborators: projectData.collaborators,
        color: projectColors[projectList.length % projectColors.length],
        totalTasks: 0,
        completedTasks: 0
      };

      const response = await projectsAPI.create(newProject);
      setProjectList([...projectList, response.data]);
      handleCloseModal();
    } catch (err) {
      console.error('Error creating project:', err);
      // Fallback to local state if API fails
      const newProject = {
        id: projectList.length + 1,
        ...projectData,
        color: projectColors[projectList.length % projectColors.length],
        totalTasks: 0,
        completedTasks: 0
      };
      setProjectList([...projectList, newProject]);
      handleCloseModal();
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

  return (
    <ContentBox>
      <Header>
        <Heading>Projects</Heading>
        <AddProjectButton onClick={handleAddProject}>
          <FiPlus size={18} />
          Add Project
        </AddProjectButton>
      </Header>
      
      {error && (
        <div style={{ padding: '12px', marginBottom: '20px', backgroundColor: '#FFF3CD', borderRadius: '8px', color: '#856404' }}>
          {error}
        </div>
      )}

      {isLoading ? (
        <div style={{ textAlign: 'center', padding: '40px', fontSize: '16px', color: '#666' }}>
          Loading projects...
        </div>
      ) : (
        <>
          <AddProjectModal 
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            onSubmit={handleSubmitProject}
          />

          <ProjectsGrid>
            {projectList.map(project => {
          const percentage = calculatePercentage(project.completedTasks, project.totalTasks);
          
          return (
            <ProjectCard key={project.id} color={project.color}>
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
                {project.collaborators.map((collab, index) => (
                  <Avatar key={index}>{collab}</Avatar>
                ))}
              </Collaborators>
              <ProgressSection>
                <ProgressHeader>
                  <ProgressLabel>Progress</ProgressLabel>
                  <ProgressPercentage>{percentage}%</ProgressPercentage>
                </ProgressHeader>
                <ProgressBarContainer>
                  <ProgressBarFill percentage={percentage} />
                </ProgressBarContainer>
              </ProgressSection>
            </ProjectCard>
          );
        })}
          </ProjectsGrid>
        </>
      )}
    </ContentBox>
  );
};

export default ProjectsPage;
