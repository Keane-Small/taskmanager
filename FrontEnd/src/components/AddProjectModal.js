import React, { useState } from 'react';
import styled from 'styled-components';
import { FiX, FiPlus } from 'react-icons/fi';
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

const CollaboratorContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding: 8px;
  border: 2px solid #E0E0E0;
  border-radius: 8px;
  min-height: 44px;
  background-color: #FFFFFF;
  align-items: center;
`;

const CollaboratorTag = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  background-color: #000000;
  color: #FFFFFF;
  padding: 6px 10px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 500;
`;

const RemoveTagButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  color: #FFFFFF;
  transition: opacity 0.2s;
  
  &:hover {
    opacity: 0.7;
  }
`;

const CollaboratorInput = styled.input`
  flex: 1;
  border: none;
  outline: none;
  padding: 4px;
  font-size: 14px;
  min-width: 60px;
`;

const AddCollaboratorButton = styled.button`
  background-color: #F0F0F0;
  border: none;
  padding: 6px 12px;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  font-weight: 500;
  transition: all 0.2s;
  
  &:hover {
    background-color: #E0E0E0;
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
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

const AddProjectModal = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    status: 'Planning',
    dueDate: '',
    collaborators: []
  });
  
  const [newCollaborator, setNewCollaborator] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddCollaborator = () => {
    const initials = newCollaborator.trim().toUpperCase();
    if (initials && initials.length <= 3 && !formData.collaborators.includes(initials)) {
      setFormData(prev => ({
        ...prev,
        collaborators: [...prev.collaborators, initials]
      }));
      setNewCollaborator('');
    }
  };

  const handleRemoveCollaborator = (collaborator) => {
    setFormData(prev => ({
      ...prev,
      collaborators: prev.collaborators.filter(c => c !== collaborator)
    }));
  };

  const handleCollaboratorKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddCollaborator();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      alert('Please enter a project name');
      return;
    }

    const projectData = {
      name: formData.name,
      status: formData.status,
      dueDate: formData.dueDate || 'TBD',
      collaborators: formData.collaborators.length > 0 ? formData.collaborators : ['TBD']
    };

    onSubmit(projectData);
    
    // Reset form
    setFormData({
      name: '',
      status: 'Planning',
      dueDate: '',
      collaborators: []
    });
    setNewCollaborator('');
  };

  const handleClose = () => {
    setFormData({
      name: '',
      status: 'Planning',
      dueDate: '',
      collaborators: []
    });
    setNewCollaborator('');
    onClose();
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
              <ModalTitle>Add New Project</ModalTitle>
              <CloseButton onClick={handleClose}>
                <FiX size={24} />
              </CloseButton>
            </ModalHeader>
            
            <form onSubmit={handleSubmit}>
              <FormGroup>
                <FormLabel>Project Name</FormLabel>
                <Input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter project name"
                  required
                />
              </FormGroup>
              
              <FormGroup>
                <FormLabel>Status</FormLabel>
                <Select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                >
                  <option value="Planning">Planning</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                </Select>
              </FormGroup>
              
              <FormGroup>
                <FormLabel>Due Date</FormLabel>
                <Input
                  type="text"
                  name="dueDate"
                  value={formData.dueDate}
                  onChange={handleInputChange}
                  placeholder="e.g., Nov 30, 2025"
                />
              </FormGroup>
              
              <FormGroup>
                <FormLabel>Collaborators (Initials)</FormLabel>
                <CollaboratorContainer>
                  {formData.collaborators.map((collaborator, index) => (
                    <CollaboratorTag key={index}>
                      {collaborator}
                      <RemoveTagButton
                        type="button"
                        onClick={() => handleRemoveCollaborator(collaborator)}
                      >
                        <FiX size={14} />
                      </RemoveTagButton>
                    </CollaboratorTag>
                  ))}
                  <CollaboratorInput
                    type="text"
                    value={newCollaborator}
                    onChange={(e) => setNewCollaborator(e.target.value.toUpperCase())}
                    onKeyPress={handleCollaboratorKeyPress}
                    placeholder={formData.collaborators.length === 0 ? "Enter initials (e.g., AB)" : ""}
                    maxLength="3"
                  />
                  <AddCollaboratorButton
                    type="button"
                    onClick={handleAddCollaborator}
                    disabled={!newCollaborator.trim()}
                  >
                    <FiPlus size={14} />
                    Add
                  </AddCollaboratorButton>
                </CollaboratorContainer>
              </FormGroup>
              
              <ButtonGroup>
                <Button type="button" onClick={handleClose}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary">
                  Add Project
                </Button>
              </ButtonGroup>
            </form>
          </ModalContent>
        </ModalOverlay>
      )}
    </AnimatePresence>
  );
};

export default AddProjectModal;
