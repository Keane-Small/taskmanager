import React from 'react';
import VerticalNavBar from '../components/VerticalNav/VerticalNavBar';
import { NavProvider, useNav } from '../context/NavContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { FiLogOut } from 'react-icons/fi';
import DashboardPage from './DashboardPage';
import ProjectsPage from './ProjectsPage';
import MessagesPage from './MessagesPage';
import CalendarPage from './CalendarPage';
import SettingsPage from './SettingsPage';
import SproutQuickCapture from '../components/SproutQuickCapture';
import './MainApp.css';

const AppContent = () => {
  const { activeNavItemId } = useNav();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [projects, setProjects] = React.useState([]);

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
          dueDate: projectData.dueDate || 'TBD',
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

  return (
    <div className="main-app">
      <VerticalNavBar />
      <div className="app-content">
        <div className="top-bar">
          <div className="user-info">
            <span className="welcome-text">Welcome, {user?.name || user?.email || 'User'}</span>
          </div>
          <div className="user-profile">
            <img 
              src={user?.profilePicture || "https://i.pravatar.cc/150?img=12"} 
              alt="Profile"
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                objectFit: 'cover',
                border: '2px solid #235347'
              }}
            />
          </div>
        </div>
        <div className="content-area">
          {renderContent()}
        </div>
        <SproutQuickCapture 
          onTaskCreate={handleTaskCreate} 
          onProjectCreate={handleProjectCreate}
          onRefreshProjects={fetchProjects}
          projects={projects} 
        />
      </div>
    </div>
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
