import React from 'react';
import VerticalNavBar from '../components/VerticalNav/VerticalNavBar';
import { NavProvider } from '../context/NavContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { FiLogOut } from 'react-icons/fi';
import './MainApp.css';

const MainApp = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <NavProvider>
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
            <h1>Your Tasks</h1>
            <p>Task management interface coming soon...</p>
          </div>
        </div>
      </div>
    </NavProvider>
  );
};

export default MainApp;
