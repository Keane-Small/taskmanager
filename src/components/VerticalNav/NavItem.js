import React from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';

const ItemContainer = styled(motion.button)`
  position: relative;
  width: 100%;
  padding: 12px;
  border: none;
  background: transparent;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 8px;
  
  &:focus {
    outline: 2px solid #000000;
    outline-offset: 2px;
  }
`;

const ActiveBackground = styled(motion.div)`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #000000;
  border-radius: 24px;
  z-index: 0;
`;

const IconWrapper = styled(motion.div)`
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  color: ${props => props.isActive ? '#FFFFFF' : '#000000'};
  transition: color 0.3s ease-in-out;
`;

const NotificationBadge = styled(motion.div)`
  position: absolute;
  top: -8px;
  right: -8px;
  background-color: #FF0000;
  color: #FFFFFF;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  font-weight: bold;
  z-index: 2;
`;

const NavItem = ({ icon: Icon, notificationCount, isActive, onClick, ariaLabel }) => {
  return (
    <ItemContainer
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ duration: 0.2 }}
      aria-label={ariaLabel}
      aria-current={isActive ? 'page' : undefined}
    >
      <AnimatePresence>
        {isActive && (
          <ActiveBackground
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            layoutId="activeBackground"
          />
        )}
      </AnimatePresence>
      
      <IconWrapper isActive={isActive}>
        <Icon />
        {notificationCount > 0 && (
          <NotificationBadge
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 500, damping: 25 }}
          >
            {notificationCount > 9 ? '9+' : notificationCount}
          </NotificationBadge>
        )}
      </IconWrapper>
    </ItemContainer>
  );
};

export default NavItem;
