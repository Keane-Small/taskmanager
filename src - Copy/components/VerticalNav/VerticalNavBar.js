import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FiHome, FiMessageSquare, FiBell, FiCalendar, FiSettings } from 'react-icons/fi';
import UserAvatar from './UserAvatar';
import AddButton from './AddButton';
import NavItem from './NavItem';
import { useNav } from '../../context/NavContext';

const NavContainer = styled(motion.nav)`
  position: fixed;
  left: 15px;
  top: 10px;
  bottom: 10px;
  width: 56px;
  background-color: #FFFDD0;
  border-radius: 12px;
  padding: 12px 8px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 1000;
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
  { id: 'home', icon: FiHome, label: 'Home', notificationCount: 0 },
  { id: 'messages', icon: FiMessageSquare, label: 'Messages', notificationCount: 3 },
  { id: 'notifications', icon: FiBell, label: 'Notifications', notificationCount: 7 },
  { id: 'calendar', icon: FiCalendar, label: 'Calendar', notificationCount: 0 },
];

const VerticalNavBar = () => {
  const { activeNavItemId, setActiveNavItemId } = useNav();

  const handleNavClick = (itemId) => {
    setActiveNavItemId(itemId);
  };

  const handleAddClick = () => {
    console.log('Add button clicked');
  };

  const handleAvatarClick = () => {
    console.log('Avatar clicked');
  };

  const handleSettingsClick = () => {
    setActiveNavItemId('settings');
  };

  return (
    <NavContainer
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <TopSection>
        <UserAvatar
          src="https://i.pravatar.cc/150?img=12"
          isOnline={true}
          onClick={handleAvatarClick}
        />
        <AddButton onClick={handleAddClick} />
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
