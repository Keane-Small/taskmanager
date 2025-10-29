import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FiPlus } from 'react-icons/fi';

const ButtonContainer = styled(motion.button)`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background-color: #000000;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 30px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  
  &:focus {
    outline: 2px solid #000000;
    outline-offset: 2px;
  }
`;

const PlusIcon = styled(FiPlus)`
  color: #FFFFFF;
  font-size: 24px;
`;

const AddButton = ({ onClick }) => {
  return (
    <ButtonContainer
      onClick={onClick}
      whileHover={{ scale: 1.1, boxShadow: '0 4px 12px rgba(0, 0, 0, 0.25)' }}
      whileTap={{ scale: 0.95 }}
      transition={{ duration: 0.2 }}
      aria-label="Add new item"
    >
      <PlusIcon />
    </ButtonContainer>
  );
};

export default AddButton;
