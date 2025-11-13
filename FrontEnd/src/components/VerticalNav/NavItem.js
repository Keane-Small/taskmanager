import React from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';

const ActiveBackground = styled(motion.div)`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: ${props => props.$gradient};
  border-radius: 12px;
  z-index: 0;
`;

const IconWrapper = styled(motion.div)`
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  color: ${props => props.$color};
  transition: color 0.3s ease-in-out;
`;

const ItemContainer = styled(motion.button)`
  position: relative;
  width: 40px;
  height: 40px;
  padding: 0;
  border: none;
  background: transparent;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 8px;
  border-radius: 12px;
  
  &:hover {
    background-color: ${props => props.$hoverBg};
  }
  
  &:hover ${IconWrapper} {
    color: ${props => props.$hoverColor};
  }
  
  &:focus {
    outline: 2px solid ${props => props.$focusColor};
    outline-offset: 2px;
  }
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
  const { theme } = useTheme();
  
  return (
    <ItemContainer
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ duration: 0.2 }}
      aria-label={ariaLabel}
      aria-current={isActive ? 'page' : undefined}
      $isActive={isActive}
      $hoverBg={isActive ? 'transparent' : theme.colors.navHover}
      $hoverColor={isActive ? theme.colors.textLight : theme.colors.textPrimary}
      $focusColor={theme.colors.accentDark}
    >
      <AnimatePresence>
        {isActive && (
          <ActiveBackground
            $gradient={theme.colors.navActive}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            layoutId="activeBackground"
          />
        )}
      </AnimatePresence>
      <IconWrapper 
        $color={isActive ? theme.colors.textLight : theme.colors.navInactive}
      >
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
