import React from 'react';
import styled from 'styled-components';

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  backdrop-filter: blur(4px);
`;

const Modal = styled.div`
  background-color: #FFFFFF;
  border-radius: 16px;
  padding: 32px;
  max-width: 440px;
  width: 90%;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  animation: slideIn 0.2s ease-out;

  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateY(-20px) scale(0.95);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }
`;

const Title = styled.h2`
  margin: 0 0 12px 0;
  font-size: 24px;
  font-weight: 600;
  color: #000000;
`;

const Message = styled.p`
  margin: 0 0 28px 0;
  font-size: 15px;
  line-height: 1.5;
  color: #666666;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
`;

const Button = styled.button`
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
  
  &:active {
    transform: scale(0.98);
  }
`;

const CancelButton = styled(Button)`
  background-color: #F5F5F5;
  color: #333333;
  
  &:hover {
    background-color: #E8E8E8;
  }
`;

const ConfirmButton = styled(Button)`
  background-color: #FF4444;
  color: #FFFFFF;
  
  &:hover {
    background-color: #FF2222;
  }
`;

const ConfirmModal = ({ isOpen, title, message, onConfirm, onCancel, confirmText = 'Delete', cancelText = 'Cancel' }) => {
  if (!isOpen) return null;

  return (
    <Overlay onClick={onCancel}>
      <Modal onClick={(e) => e.stopPropagation()}>
        <Title>{title}</Title>
        <Message>{message}</Message>
        <ButtonGroup>
          <CancelButton onClick={onCancel}>{cancelText}</CancelButton>
          <ConfirmButton onClick={onConfirm}>{confirmText}</ConfirmButton>
        </ButtonGroup>
      </Modal>
    </Overlay>
  );
};

export default ConfirmModal;
