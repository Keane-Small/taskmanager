import React from 'react';
import styled from 'styled-components';
import VerticalNavBar from '../components/VerticalNav/VerticalNavBar';
import { NavProvider, useNav } from '../context/NavContext';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useNavigate } from 'react-router-dom';
import { FiLogOut } from 'react-icons/fi';
import DashboardPage from './DashboardPage';
import ProjectsPage from './ProjectsPage';
import MessagesPage from './MessagesPage';
import CalendarPage from './CalendarPage';
import SettingsPage from './SettingsPage';
import SproutQuickCapture from '../components/SproutQuickCapture';
import NotificationCenter from '../components/NotificationCenter';
import './MainApp.css';

const MainAppContainer = styled.div`
  background: ${props => props.$bgColor};
  width: 100vw;
  height: 100vh;
  margin: 0;
  padding: 0;
  display: flex;
  transition: background-color 0.3s ease;
`;

const AppContentWrapper = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 0;
  margin: 0;
`;

const TopBar = styled.div`
  position: fixed;
  top: 15px;
  left: 100px;
  right: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  background-color: ${props => props.$bgColor};
  border-radius: 12px;
  box-shadow: 0 2px 8px ${props => props.$shadow};
  z-index: 999;
  height: 60px;
  transition: background-color 0.3s ease, box-shadow 0.3s ease;
`;

const WelcomeText = styled.div`
  color: ${props => props.$textColor};
  font-size: 1.1rem;
  font-weight: 600;
  transition: color 0.3s ease;

  @media (max-width: 768px) {
    font-size: 0.95rem;
  }
`;

const UserProfileImage = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid ${props => props.$borderColor};
  transition: border-color 0.3s ease;
`;

const UserProfileInitials = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #9ca3af;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  font-weight: 600;
  color: white;
  text-transform: uppercase;
  border: 2px solid ${props => props.$borderColor};
  transition: border-color 0.3s ease;
`;

const AppContent = () => {
  const { activeNavItemId } = useNav();
  const { user, logout } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [projects, setProjects] = React.useState([]);

  // Helper function to get user initials
  const getUserInitials = (name) => {
    if (!name) return "??";
    const nameParts = name.trim().split(" ");
    if (nameParts.length === 1) {
      return nameParts[0].charAt(0);
    }
    return nameParts[0].charAt(0) + nameParts[nameParts.length - 1].charAt(0);
  };

  // Fetch projects for Sprout
  const fetchProjects = React.useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/projects', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setProjects(data);
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  }, []);

  React.useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleProjectCreate = async (projectData) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: projectData.name,
          status: projectData.status || 'Planning',
          startDate: projectData.startDate || 'TBD',
          endDate: projectData.endDate || 'TBD',
          collaborators: projectData.collaborators || [],
          color: ['#FFE5E5', '#E5F3FF', '#E5FFE5', '#FFF5E5', '#F5E5FF'][Math.floor(Math.random() * 5)],
        }),
      });

      if (response.ok) {
        const newProject = await response.json();
        console.log('✅ Project created successfully via Sprout AI!', newProject);
        
        // Refresh projects list
        const projectsResponse = await fetch('http://localhost:5000/api/projects', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (projectsResponse.ok) {
          const data = await projectsResponse.json();
          setProjects(data);
        }

        // Show success notification
        const notification = document.createElement('div');
        notification.style.cssText = `
          position: fixed;
          bottom: 110px;
          right: 30px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 16px 24px;
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
          z-index: 9999;
          animation: slideIn 0.3s ease-out;
        `;
        notification.textContent = `✨ Project "${projectData.name}" created!`;
        document.body.appendChild(notification);
        
        setTimeout(() => {
          notification.style.animation = 'slideOut 0.3s ease-out';
          setTimeout(() => notification.remove(), 300);
        }, 3000);

        return newProject;
      }
    } catch (error) {
      console.error('Error creating project:', error);
      throw error;
    }
  };

  const handleTaskCreate = async (taskData) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: taskData.title,
          description: taskData.dueDate 
            ? `Due: ${taskData.dueDate}${taskData.time ? ` at ${taskData.time}` : ''}`
            : '',
          status: taskData.status || 'todo',
          projectId: taskData.project || null,
        }),
      });

      if (response.ok) {
        console.log('✅ Task created successfully via Sprout!');
        // Show success notification
        const notification = document.createElement('div');
        notification.style.cssText = `
          position: fixed;
          bottom: 110px;
          right: 30px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 16px 24px;
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
          z-index: 9999;
          animation: slideIn 0.3s ease-out;
        `;
        notification.textContent = `✨ Task "${taskData.title}" added!`;
        document.body.appendChild(notification);
        
        setTimeout(() => {
          notification.style.animation = 'slideOut 0.3s ease-out';
          setTimeout(() => notification.remove(), 300);
        }, 2000);
      }
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  const renderContent = () => {
    switch (activeNavItemId) {
      case 'home':
        return <DashboardPage />;
      case 'projects':
        return <ProjectsPage />;
      case 'messages':
        return <MessagesPage />;
      case 'calendar':
        return <CalendarPage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <DashboardPage />;
    }
  };

  const showTopBar = activeNavItemId === 'home';

  return (
    <MainAppContainer $bgColor={theme.colors.mainBg}>
      <VerticalNavBar />
      <AppContentWrapper>
        {showTopBar && (
          <TopBar 
            $bgColor={theme.colors.topBarBg}
            $shadow={theme.colors.shadow}
          >
            <div className="user-info">
              <WelcomeText $textColor={theme.colors.textPrimary}>
                Welcome, {user?.name || user?.email || 'User'}
              </WelcomeText>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <NotificationCenter />
              <div className="user-profile">
                {user?.profilePicture ? (
                  <UserProfileImage 
                    src={user.profilePicture} 
                    alt="Profile"
                    $borderColor={theme.colors.accentDark}
                  />
                ) : (
                  <UserProfileInitials 
                    $borderColor={theme.colors.accentDark}
                  >
                    {getUserInitials(user?.name)}
                  </UserProfileInitials>
                )}
              </div>
            </div>
          </TopBar>
        )}
        <div className="content-area">
          {renderContent()}
        </div>
        <SproutQuickCapture 
          onTaskCreate={handleTaskCreate} 
          onProjectCreate={handleProjectCreate}
          onRefreshProjects={fetchProjects}
          projects={projects} 
        />
      </AppContentWrapper>
    </MainAppContainer>
  );
};

const MainApp = () => {
  return (
    <NavProvider>
      <AppContent />
    </NavProvider>
  );
};

export default MainApp;
