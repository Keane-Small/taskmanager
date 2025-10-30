import React, { useState } from 'react';
import styled from 'styled-components';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';

const ProfilePage = () => {
  const { user, updateUser } = useAuth();
  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(user?.profilePicture || null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: user?.fullName || '',
    role: user?.role || '',
    bio: user?.bio || '',
    skills: user?.skills?.join(', ') || ''
  });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formDataToSend = new FormData();
      if (image) {
        formDataToSend.append('profilePicture', image);
      }
      Object.keys(formData).forEach(key => {
        if (key === 'skills') {
          formDataToSend.append(key, formData[key].split(',').map(skill => skill.trim()));
        } else {
          formDataToSend.append(key, formData[key]);
        }
      });

      const response = await fetch('/api/users/profile', {
        method: 'PUT',
        body: formDataToSend
      });

      if (response.ok) {
        const updatedUser = await response.json();
        updateUser(updatedUser);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContainer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <ProfileCard>
        <ImageSection>
          <ProfileImageContainer>
            <ProfileImage src={previewUrl || '/default-avatar.png'} alt="Profile" />
            <UploadOverlay>
              <UploadInput
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                id="profile-image-upload"
              />
              <UploadLabel htmlFor="profile-image-upload">
                Change Photo
              </UploadLabel>
            </UploadOverlay>
          </ProfileImageContainer>
        </ImageSection>

        <FormSection onSubmit={handleSubmit}>
          <InputGroup>
            <Label>Full Name</Label>
            <Input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              placeholder="Enter your full name"
            />
          </InputGroup>

          <InputGroup>
            <Label>Role</Label>
            <Input
              type="text"
              name="role"
              value={formData.role}
              onChange={handleInputChange}
              placeholder="Your role (e.g., Software Developer)"
            />
          </InputGroup>

          <InputGroup>
            <Label>Bio</Label>
            <TextArea
              name="bio"
              value={formData.bio}
              onChange={handleInputChange}
              placeholder="Tell us about yourself"
              rows="4"
            />
          </InputGroup>

          <InputGroup>
            <Label>Skills</Label>
            <Input
              type="text"
              name="skills"
              value={formData.skills}
              onChange={handleInputChange}
              placeholder="Enter skills (comma-separated)"
            />
          </InputGroup>

          <SaveButton
            type="submit"
            disabled={loading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </SaveButton>
        </FormSection>
      </ProfileCard>
    </PageContainer>
  );
};

const PageContainer = styled(motion.div)`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  min-height: 100vh;
`;

const ProfileCard = styled.div`
  background: white;
  border-radius: 20px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  padding: 2rem;
  border: 1px solid rgba(0, 0, 0, 0.1);

  @media (min-width: 768px) {
    flex-direction: row;
  }
`;

const ImageSection = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 1rem;
`;

const ProfileImageContainer = styled.div`
  position: relative;
  width: 200px;
  height: 200px;
  border-radius: 50%;
  overflow: hidden;
  background: #f0f0f0;
  
  &:hover > div {
    opacity: 1;
  }
`;

const ProfileImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const UploadOverlay = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.7);
  padding: 0.5rem;
  opacity: 0;
  transition: opacity 0.3s ease;
  display: flex;
  justify-content: center;
`;

const UploadInput = styled.input`
  display: none;
`;

const UploadLabel = styled.label`
  color: white;
  cursor: pointer;
  font-size: 0.9rem;
  &:hover {
    text-decoration: underline;
  }
`;

const FormSection = styled.form`
  flex: 2;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding: 1rem;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-weight: 600;
  color: #333;
`;

const Input = styled.input`
  padding: 0.75rem;
  border: 2px solid #eee;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s ease;

  &:focus {
    border-color: #007bff;
    outline: none;
  }
`;

const TextArea = styled.textarea`
  padding: 0.75rem;
  border: 2px solid #eee;
  border-radius: 8px;
  font-size: 1rem;
  resize: vertical;
  min-height: 100px;
  transition: border-color 0.3s ease;

  &:focus {
    border-color: #007bff;
    outline: none;
  }
`;

const SaveButton = styled(motion.button)`
  padding: 1rem 2rem;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.3s ease;

  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }

  &:hover:not(:disabled) {
    background: #0056b3;
  }
`;

export default ProfilePage;