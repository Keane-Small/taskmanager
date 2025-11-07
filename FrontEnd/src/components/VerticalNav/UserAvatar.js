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

const AvatarInitials = styled.div`
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: #9ca3af;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  font-weight: 600;
  color: white;
  text-transform: uppercase;
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

const UserAvatar = ({ src, name, isOnline = true, onClick }) => {
  // Helper function to get user initials
  const getUserInitials = (userName) => {
    if (!userName) return "??";
    const nameParts = userName.trim().split(" ");
    if (nameParts.length === 1) {
      return nameParts[0].charAt(0);
    }
    return nameParts[0].charAt(0) + nameParts[nameParts.length - 1].charAt(0);
  };

  return (
    <AvatarContainer
      onClick={onClick}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      transition={{ duration: 0.2 }}
      role="button"
      aria-label="User profile"
    >
      {src ? (
        <AvatarImage src={src} alt="User avatar" />
      ) : (
        <AvatarInitials>{getUserInitials(name)}</AvatarInitials>
      )}
      <StatusBadge $isOnline={isOnline} />
    </AvatarContainer>
  );
};

export default UserAvatar;
