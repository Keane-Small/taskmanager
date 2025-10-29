import React from 'react';
import { useNav } from '../context/NavContext';
import HomePage from '../pages/HomePage';
import ProjectsPage from '../pages/ProjectsPage';
import MessagesPage from '../pages/MessagesPage';
import NotificationsPage from '../pages/NotificationsPage';
import CalendarPage from '../pages/CalendarPage';
import SettingsPage from '../pages/SettingsPage';

const MainContent = () => {
  const { activeNavItemId } = useNav();

  const renderPage = () => {
    switch (activeNavItemId) {
      case 'home':
        return <HomePage />;
      case 'projects':
        return <ProjectsPage />;
      case 'messages':
        return <MessagesPage />;
      case 'notifications':
        return <NotificationsPage />;
      case 'calendar':
        return <CalendarPage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <ProjectsPage />;
    }
  };

  return renderPage();
};

export default MainContent;
