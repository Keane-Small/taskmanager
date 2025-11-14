import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

import { FiMessageCircle, FiCalendar, FiSettings, FiFolder, FiBarChart2 } from 'react-icons/fi';
import { MdDashboard } from 'react-icons/md';
import NavItem from './NavItem';

import { useNav } from '../../context/NavContext';
import { useMessages } from '../../context/MessageContext';
import { useTheme } from '../../context/ThemeContext';

const NavContainer = styled(motion.nav)`
  position: fixed;
  left: 15px;
  top: 10px;
  bottom: 10px;
  width: 70px;
  background-color: ${props => props.$bgColor};
  border-radius: 20px;
  padding: 16px 12px;
  box-shadow: 0 4px 20px ${props => props.$shadow};
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 1000;
  transition: all 0.3s ease;
  
  &:hover {
    box-shadow: 0 8px 32px ${props => props.$shadow};
  }
`;

const LogoContainer = styled.div`
  width: 48px;
  height: 48px;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  overflow: hidden;
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.05);
  }
`;

const Logo = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
`;


const MiddleSection = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  margin-top: 8px;
  overflow: visible;
  
  &::-webkit-scrollbar {
    display: none;
  }
  
  -ms-overflow-style: none;
  scrollbar-width: none;
`;

const BottomSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  margin-top: auto;
  padding-top: 20px;
`;

const VerticalNavBar = () => {
  const { activeNavItemId, setActiveNavItemId } = useNav();
  const { unreadCount } = useMessages();
  const { theme } = useTheme();

  const navItems = [
    { id: 'home', icon: MdDashboard, label: 'Dashboard', notificationCount: 0 },
    { id: 'projects', icon: FiFolder, label: 'Projects', notificationCount: 0 },
    { id: 'messages', icon: FiMessageCircle, label: 'Messages', notificationCount: unreadCount },
    { id: 'calendar', icon: FiCalendar, label: 'Calendar', notificationCount: 0 },
    { id: 'insights', icon: FiBarChart2, label: 'AI Insights', notificationCount: 0 },
  ];

  const handleNavClick = (itemId) => {
    setActiveNavItemId(itemId);
  };



  const handleSettingsClick = () => {
    setActiveNavItemId('settings');
  };

  return (
    <NavContainer
      $bgColor={theme.colors.navBg}
      $shadow={theme.colors.shadow}
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut', type: 'spring', stiffness: 100 }}
    >
      <LogoContainer>
        <Logo src="/logo-nav.png" alt="TaskManager Logo" />
      </LogoContainer>
      
      <MiddleSection>
        {navItems.map((item) => (
          <NavItem
            key={item.id}
            icon={item.icon}
            notificationCount={item.notificationCount}
            isActive={activeNavItemId === item.id}
            onClick={() => handleNavClick(item.id)}
            ariaLabel={item.label}
          />
        ))}
      </MiddleSection>

      <BottomSection>
        <NavItem
          icon={FiSettings}
          notificationCount={0}
          isActive={activeNavItemId === 'settings'}
          onClick={handleSettingsClick}
          ariaLabel="Settings"
        />
      </BottomSection>
    </NavContainer>
  );
};

export default VerticalNavBar;
