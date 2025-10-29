import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FiHome, FiMessageSquare, FiBell, FiCalendar, FiSettings, FiUser } from 'react-icons/fi';
import UserAvatar from './UserAvatar';
import NavItem from './NavItem';

import { useNav } from '../../context/NavContext';
import { useNavigate } from 'react-router-dom';

const NavContainer = styled(motion.nav)`
  position: fixed;
  left: 15px;
  top: 10px;
  bottom: 10px;
  width: 56px;
  background-color: #ffffff;
  border-radius: 12px;
  padding: 12px 8px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 1000;
  border: 1px solid rgba(0, 0, 0, 0.1);
`;

const TopSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`;

const MiddleSection = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  margin-top: 20px;
  overflow-y: auto;
  
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

const navItems = [
  { id: 'home', icon: FiHome, label: 'Dashboard', notificationCount: 0 },
  { id: 'messages', icon: FiMessageSquare, label: 'Messages', notificationCount: 0 },
  { id: 'notifications', icon: FiBell, label: 'Notifications', notificationCount: 0 },
  { id: 'calendar', icon: FiCalendar, label: 'Calendar', notificationCount: 0 },
  { id: 'profile', icon: FiUser, label: 'Profile', notificationCount: 0 },
];

const VerticalNavBar = () => {
  const { activeNavItemId, setActiveNavItemId } = useNav();
  const navigate = useNavigate();

  const handleNavClick = (itemId) => {
    setActiveNavItemId(itemId);
    switch (itemId) {
      case 'home':
        navigate('/app');
        break;
      case 'messages':
        navigate('/messaging');
        break;
      case 'notifications':
        navigate('/notifications');
        break;
      case 'calendar':
        navigate('/calendar');
        break;
      case 'profile':
        navigate('/profile');
        break;
      default:
        break;
    }
  };

  const handleSettingsClick = () => {
    setActiveNavItemId('settings');
    navigate('/settings');
  };

  return (
    <NavContainer
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut', type: 'spring', stiffness: 100 }}
    >
      <TopSection>
        <UserAvatar
          src="https://i.pravatar.cc/150?img=12"
          isOnline={true}
          onClick={() => handleNavClick('profile')}
        />
      </TopSection>

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
