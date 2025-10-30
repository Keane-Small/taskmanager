import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const AvatarContainer = styled(motion.div)`
  position: relative;
  width: 48px;
  height: 48px;
  cursor: pointer;
  margin-bottom: 20px;
`;

const AvatarImage = styled.img`
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
`;

const StatusBadge = styled.div`
  position: absolute;
  bottom: 2px;
  right: 2px;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: ${props => props.$isOnline ? '#00FF00' : '#FF0000'};
  border: 2px solid #FFFDD0;
`;

const UserAvatar = ({ src, isOnline = true, onClick }) => {
  return (
    <AvatarContainer
      onClick={onClick}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      transition={{ duration: 0.2 }}
      role="button"
      aria-label="User profile"
    >
      <AvatarImage src={src} alt="User avatar" />
      <StatusBadge $isOnline={isOnline} />
    </AvatarContainer>
  );
};

export default UserAvatar;
