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
import './MainApp.css';

const AppContent = () => {
  const { activeNavItemId } = useNav();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
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
          <button className="logout-btn" onClick={handleLogout}>
            <FiLogOut />
            <span>Logout</span>
          </button>
        </div>
        <div className="content-area">
          {renderContent()}
        </div>
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
