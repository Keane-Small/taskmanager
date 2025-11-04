import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FiX, FiPlus, FiSearch } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

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
  justify-content: space-between;
  gap: 10px;
  background-color: #000000;
  color: #FFFFFF;
  padding: 10px 12px;
  border-radius: 8px;
  font-size: 13px;
  width: 100%;
  margin-bottom: 8px;
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

const SearchContainer = styled.div`
  position: relative;
  margin-bottom: 12px;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 10px 12px 10px 36px;
  border: 2px solid #E0E0E0;
  border-radius: 8px;
  font-size: 14px;
  box-sizing: border-box;
  
  &:focus {
    outline: none;
    border-color: #000000;
  }
`;

const SearchIcon = styled(FiSearch)`
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #999;
`;

const UserDropdown = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border: 2px solid #E0E0E0;
  border-radius: 8px;
  max-height: 200px;
  overflow-y: auto;
  z-index: 1000;
  margin-top: 4px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
`;

const UserItem = styled.div`
  padding: 10px 12px;
  cursor: pointer;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: #F0F0F0;
  }
`;

const UserName = styled.div`
  font-weight: 600;
  font-size: 14px;
  color: #000;
`;

const UserEmail = styled.div`
  font-size: 12px;
  color: #666;
  margin-top: 2px;
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
  
  ${props => props.$variant === 'primary' ? `
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
    priority: 'medium',
    startDate: '',
    dueDate: '',
    collaborators: []
  });
  
  const [searchQuery, setSearchQuery] = useState('');
  const [allUsers, setAllUsers] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchUsers();
    }
  }, [isOpen]);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/users`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setAllUsers(data);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const filteredUsers = allUsers.filter(user =>
    !formData.collaborators.find(c => c.userId === user._id) &&
    (user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
     user.email.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddCollaborator = (user) => {
    setFormData(prev => ({
      ...prev,
      collaborators: [...prev.collaborators, {
        userId: user._id,
        name: user.name,
        email: user.email,
        role: 'Editor'
      }]
    }));
    setSearchQuery('');
    setShowDropdown(false);
  };

  const handleRemoveCollaborator = (userId) => {
    setFormData(prev => ({
      ...prev,
      collaborators: prev.collaborators.filter(c => c.userId !== userId)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      alert('Please enter a project name');
      return;
    }

    const projectData = {
      name: formData.name,
      priority: formData.priority,
      status: formData.status,
      startDate: formData.startDate || null,
      dueDate: formData.dueDate || 'TBD',
      collaborators: formData.collaborators.map(c => ({
        userId: c.userId,
        role: c.role
      }))
    };

    onSubmit(projectData);
    
    // Reset form
    setFormData({
      name: '',
      status: 'Planning',
      priority: 'medium',
      startDate: '',
      dueDate: '',
      collaborators: []
    });
    setSearchQuery('');
  };

  const handleClose = () => {
    setFormData({
      name: '',
      status: 'Planning',
      priority: 'medium',
      startDate: '',
      dueDate: '',
      collaborators: []
    });
    setSearchQuery('');
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
                <FormLabel>Priority</FormLabel>
                <Select
                  name="priority"
                  value={formData.priority}
                  onChange={handleInputChange}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </Select>
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
                <FormLabel>Start Date</FormLabel>
                <Input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleInputChange}
                />
              </FormGroup>

              <FormGroup>
                <FormLabel>Due Date</FormLabel>
                <Input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleInputChange}
                />
              </FormGroup>
              
              <FormGroup>
                <FormLabel>End Date (Due Date)</FormLabel>
                <Input
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleInputChange}
                />
              </FormGroup>
              
              <FormGroup>
                <FormLabel>Collaborators</FormLabel>
                <SearchContainer>
                  <SearchIcon />
                  <SearchInput
                    type="text"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setShowDropdown(e.target.value.length > 0);
                    }}
                    onFocus={() => searchQuery && setShowDropdown(true)}
                    placeholder="Search users by name or email..."
                  />
                  {showDropdown && filteredUsers.length > 0 && (
                    <UserDropdown>
                      {filteredUsers.slice(0, 5).map(user => (
                        <UserItem
                          key={user._id}
                          onClick={() => handleAddCollaborator(user)}
                        >
                          <UserName>{user.name}</UserName>
                          <UserEmail>{user.email}</UserEmail>
                        </UserItem>
                      ))}
                    </UserDropdown>
                  )}
                </SearchContainer>
                {formData.collaborators.length > 0 && (
                  <CollaboratorContainer>
                    {formData.collaborators.map((collaborator) => (
                      <CollaboratorTag key={collaborator.userId}>
                        <div>
                          <div style={{ fontWeight: 600 }}>{collaborator.name}</div>
                          <div style={{ fontSize: '11px', opacity: 0.8 }}>{collaborator.email}</div>
                        </div>
                        <RemoveTagButton
                          type="button"
                          onClick={() => handleRemoveCollaborator(collaborator.userId)}
                        >
                          <FiX size={14} />
                        </RemoveTagButton>
                      </CollaboratorTag>
                    ))}
                  </CollaboratorContainer>
                )}
              </FormGroup>
              
              <ButtonGroup>
                <Button type="button" onClick={handleClose}>
                  Cancel
                </Button>
                <Button type="submit" $variant="primary">
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
