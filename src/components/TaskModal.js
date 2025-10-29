import React, { useState } from 'react';
import styled from 'styled-components';
import { FiX } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

const ModalOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
`;

const ModalContent = styled(motion.div)`
  background-color: #FFFFFF;
  border-radius: 16px;
  padding: 30px;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  position: relative;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`;

const ModalTitle = styled.h2`
  margin: 0;
  font-size: 24px;
  font-weight: 600;
  color: #000000;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s;
  
  &:hover {
    transform: scale(1.1);
  }
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
`;

const FormLabel = styled.label`
  display: block;
  margin-bottom: 8px;
  font-size: 14px;
  font-weight: 600;
  color: #333;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px;
  border: 2px solid #E0E0E0;
  border-radius: 8px;
  font-size: 14px;
  transition: border-color 0.2s;
  box-sizing: border-box;
  
  &:focus {
    outline: none;
    border-color: #000000;
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 12px;
  border: 2px solid #E0E0E0;
  border-radius: 8px;
  font-size: 14px;
  transition: border-color 0.2s;
  box-sizing: border-box;
  min-height: 100px;
  resize: vertical;
  font-family: inherit;
  
  &:focus {
    outline: none;
    border-color: #000000;
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 12px;
  border: 2px solid #E0E0E0;
  border-radius: 8px;
  font-size: 14px;
  transition: border-color 0.2s;
  box-sizing: border-box;
  background-color: #FFFFFF;
  cursor: pointer;
  
  &:focus {
    outline: none;
    border-color: #000000;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 24px;
`;

const Button = styled.button`
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  
  ${props => props.variant === 'primary' ? `
    background-color: #000000;
    color: #FFFFFF;
    
    &:hover {
      background-color: #333333;
    }
  ` : props.variant === 'danger' ? `
    background-color: #FF4444;
    color: #FFFFFF;
    
    &:hover {
      background-color: #CC0000;
    }
  ` : `
    background-color: #F0F0F0;
    color: #000000;
    
    &:hover {
      background-color: #E0E0E0;
    }
  `}
  
  &:active {
    transform: scale(0.98);
  }
`;

const TaskModal = ({ isOpen, onClose, onSubmit, onDelete, task, projectId }) => {
  const [formData, setFormData] = useState({
    title: task?.title || '',
    description: task?.description || '',
    status: task?.status || 'todo',
    assignedTo: task?.assignedTo || ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      alert('Please enter a task title');
      return;
    }

    onSubmit(formData);
    
    // Reset form
    setFormData({
      title: '',
      description: '',
      status: 'todo',
      assignedTo: ''
    });
  };

  const handleClose = () => {
    setFormData({
      title: task?.title || '',
      description: task?.description || '',
      status: task?.status || 'todo',
      assignedTo: task?.assignedTo || ''
    });
    onClose();
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      onDelete(task.id);
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <ModalOverlay
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
        >
          <ModalContent
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <ModalHeader>
              <ModalTitle>{task ? 'Edit Task' : 'Add New Task'}</ModalTitle>
              <CloseButton onClick={handleClose}>
                <FiX size={24} />
              </CloseButton>
            </ModalHeader>
            
            <form onSubmit={handleSubmit}>
              <FormGroup>
                <FormLabel>Task Title</FormLabel>
                <Input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Enter task title"
                  required
                />
              </FormGroup>
              
              <FormGroup>
                <FormLabel>Description</FormLabel>
                <TextArea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Enter task description"
                />
              </FormGroup>
              
              <FormGroup>
                <FormLabel>Status</FormLabel>
                <Select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                >
                  <option value="todo">To Do</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                </Select>
              </FormGroup>
              
              <FormGroup>
                <FormLabel>Assigned To (Initials)</FormLabel>
                <Input
                  type="text"
                  name="assignedTo"
                  value={formData.assignedTo}
                  onChange={handleInputChange}
                  placeholder="e.g., JD"
                  maxLength="3"
                />
              </FormGroup>
              
              <ButtonGroup>
                {task && (
                  <Button type="button" variant="danger" onClick={handleDelete}>
                    Delete
                  </Button>
                )}
                <Button type="button" onClick={handleClose}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary">
                  {task ? 'Save Changes' : 'Add Task'}
                </Button>
              </ButtonGroup>
            </form>
          </ModalContent>
        </ModalOverlay>
      )}
    </AnimatePresence>
  );
};

export default TaskModal;
