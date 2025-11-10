import { useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FiUser, FiMail, FiLock, FiSave, FiCamera, FiLogOut, FiSettings, FiShield } from "react-icons/fi";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

const ContentBox = styled.div`
  position: fixed;
  left: 110px;
  top: 20px;
  right: 20px;
  bottom: 20px;
  background: linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%);
  border-radius: 16px;
  overflow-y: auto;
  padding: 0;
  box-shadow: 0 4px 20px rgba(45, 90, 61, 0.08);

  @media (max-width: 768px) {
    position: static;
    left: auto;
    top: auto;
    right: auto;
    bottom: auto;
    margin: 20px;
    border-radius: 12px;
    min-height: calc(100vh - 140px);
  }

  @media (max-width: 480px) {
    margin: 10px;
    border-radius: 8px;
  }
`;

const Header = styled.div`
  background: linear-gradient(135deg, #f0f9f3 0%, #e8f5ea 100%);
  color: #1a4d2a;
  padding: 2rem;
  border-radius: 16px 16px 0 0;
  position: relative;
  overflow: hidden;
  border-bottom: 3px solid #2D5A3D;

  &::before {
    content: '';
    position: absolute;
    top: -50%;
    right: -10%;
    width: 200px;
    height: 200px;
    background: rgba(45, 90, 61, 0.05);
    border-radius: 50%;
  }

  &::after {
    content: '';
    position: absolute;
    bottom: -30%;
    left: -5%;
    width: 150px;
    height: 150px;
    background: rgba(45, 90, 61, 0.03);
    border-radius: 50%;
  }

  @media (max-width: 768px) {
    padding: 1.5rem;
    border-radius: 12px 12px 0 0;
  }

  @media (max-width: 480px) {
    padding: 1rem;
    border-radius: 8px 8px 0 0;
  }
`;

const HeaderContent = styled.div`
  position: relative;
  z-index: 2;
  display: flex;
  align-items: center;
  gap: 1rem;

  @media (max-width: 480px) {
    flex-direction: column;
    text-align: center;
    gap: 0.5rem;
  }
`;

const HeaderIcon = styled.div`
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #2D5A3D 0%, #3A6B4D 100%);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  color: white;
  box-shadow: 0 4px 12px rgba(45, 90, 61, 0.3);

  @media (max-width: 480px) {
    width: 50px;
    height: 50px;
    font-size: 20px;
  }
`;

const HeaderText = styled.div`
  flex: 1;
`;

const Heading = styled.h1`
  margin: 0;
  font-size: 2rem;
  font-weight: 700;
  color: #1a4d2a;
  
  @media (max-width: 480px) {
    font-size: 1.5rem;
  }
`;

const Subtitle = styled.p`
  margin: 0.5rem 0 0 0;
  font-size: 1rem;
  color: #4a7c5d;
  
  @media (max-width: 480px) {
    font-size: 0.9rem;
    margin: 0.25rem 0 0 0;
  }
`;

const SettingsContainer = styled.div`
  padding: 2rem;
  max-width: 800px;
  margin: 0 auto;

  @media (max-width: 768px) {
    padding: 1.5rem;
  }

  @media (max-width: 480px) {
    padding: 1rem;
  }
`;

const Section = styled.div`
  background: #ffffff;
  border-radius: 16px;
  padding: 2rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 4px 20px rgba(45, 90, 61, 0.08);
  border: 1px solid rgba(45, 90, 61, 0.1);
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 8px 30px rgba(45, 90, 61, 0.12);
    transform: translateY(-2px);
  }

  @media (max-width: 768px) {
    padding: 1.5rem;
    border-radius: 12px;
  }

  @media (max-width: 480px) {
    padding: 1rem;
    border-radius: 8px;
    margin-bottom: 1rem;
  }
`;

const SectionTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 700;
  color: #2D5A3D;
  margin: 0 0 1.5rem 0;
  display: flex;
  align-items: center;
  gap: 12px;
  padding-bottom: 1rem;
  border-bottom: 2px solid rgba(45, 90, 61, 0.1);

  svg {
    font-size: 1.5rem;
    color: #2D5A3D;
  }

  @media (max-width: 480px) {
    font-size: 1.1rem;
    margin-bottom: 1rem;
    padding-bottom: 0.75rem;
    
    svg {
      font-size: 1.25rem;
    }
  }
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;

  @media (max-width: 480px) {
    margin-bottom: 1rem;
  }
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-size: 0.95rem;
  font-weight: 600;
  color: #374151;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.875rem 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  font-size: 1rem;
  transition: all 0.3s ease;
  box-sizing: border-box;
  font-family: inherit;
  background: #ffffff;

  &:focus {
    outline: none;
    border-color: #2D5A3D;
    box-shadow: 0 0 0 3px rgba(45, 90, 61, 0.1);
  }

  &:disabled {
    background-color: #f9fafb;
    color: #6b7280;
    cursor: not-allowed;
  }

  &::placeholder {
    color: #9ca3af;
  }

  @media (max-width: 480px) {
    padding: 0.75rem;
    border-radius: 8px;
    font-size: 0.95rem;
  }
`;

const Button = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.875rem 1.5rem;
  background: linear-gradient(135deg, #2D5A3D 0%, #3A6B4D 100%);
  color: #ffffff;
  border: none;
  border-radius: 12px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 140px;

  &:hover {
    background: linear-gradient(135deg, #1F3E2A 0%, #2D5A3D 100%);
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(45, 90, 61, 0.3);
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    background: #9ca3af;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }

  @media (max-width: 480px) {
    width: 100%;
    padding: 0.75rem 1rem;
    border-radius: 8px;
    font-size: 0.9rem;
  }
`;

const Message = styled.div`
  padding: 1rem 1.25rem;
  border-radius: 12px;
  margin-bottom: 1.5rem;
  font-size: 0.95rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background-color: ${(props) =>
    props.$type === "success" 
      ? "rgba(45, 90, 61, 0.1)" 
      : "rgba(239, 68, 68, 0.1)"};
  color: ${(props) => 
    props.$type === "success" 
      ? "#2D5A3D" 
      : "#dc2626"};
  border: 2px solid ${(props) =>
    props.$type === "success" 
      ? "rgba(45, 90, 61, 0.2)" 
      : "rgba(239, 68, 68, 0.2)"};

  &::before {
    content: ${(props) => props.$type === "success" ? "'✓'" : "'⚠'"};
    font-size: 1.25rem;
    font-weight: 700;
  }

  @media (max-width: 480px) {
    padding: 0.75rem 1rem;
    border-radius: 8px;
    font-size: 0.9rem;
  }
`;

const InfoText = styled.p`
  color: #6b7280;
  font-size: 0.875rem;
  margin: 0.5rem 0 0 0;
  line-height: 1.4;
`;

const ProfileImageSection = styled.div`
  display: flex;
  align-items: center;
  gap: 2rem;

  @media (max-width: 640px) {
    flex-direction: column;
    gap: 1.5rem;
    text-align: center;
  }
`;

const ProfileImageContainer = styled.div`
  position: relative;
  width: 120px;
  height: 120px;
  border-radius: 50%;
  overflow: hidden;
  background: #f3f4f6;
  border: 4px solid rgba(45, 90, 61, 0.2);
  transition: all 0.3s ease;

  &:hover {
    border-color: #2D5A3D;
    transform: scale(1.05);
    
    .upload-overlay {
      opacity: 1;
    }
  }

  @media (max-width: 480px) {
    width: 100px;
    height: 100px;
  }
`;

const ProfileImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const ProfileInitials = styled.div`
  width: 100%;
  height: 100%;
  background: #9ca3af;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
  font-weight: 700;
  color: white;
  text-transform: uppercase;

  @media (max-width: 480px) {
    font-size: 2.5rem;
  }
`;

const UploadOverlay = styled.label`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(45, 90, 61, 0.9);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: all 0.3s ease;
  cursor: pointer;
  color: white;
  font-size: 0.75rem;
  font-weight: 600;
  gap: 0.25rem;
  backdrop-filter: blur(4px);

  svg {
    font-size: 1.5rem;
  }
`;

const HiddenInput = styled.input`
  display: none;
`;

const ImageInfo = styled.div`
  flex: 1;
`;

const ImageTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 700;
  color: #2D5A3D;
  margin: 0 0 0.5rem 0;
`;

const ImageDescription = styled.p`
  font-size: 0.95rem;
  color: #6b7280;
  margin: 0 0 1rem 0;
  line-height: 1.5;
`;

const DangerButton = styled(Button)`
  background: linear-gradient(135deg, #dc2626 0%, #ef4444 100%);
  
  &:hover {
    background: linear-gradient(135deg, #b91c1c 0%, #dc2626 100%);
    box-shadow: 0 8px 20px rgba(220, 38, 38, 0.3);
  }
`;

const SignOutDescription = styled.p`
  color: #6b7280;
  font-size: 0.95rem;
  margin: 0 0 1.5rem 0;
  line-height: 1.6;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  
  @media (max-width: 480px) {
    flex-direction: column;
    gap: 0.75rem;
  }
`;

const SettingsPage = () => {
  const { user, updateUser, logout } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [profileImage, setProfileImage] = useState(user?.profilePicture || null);
  const [imageFile, setImageFile] = useState(null);

  // Helper function to get user initials
  const getUserInitials = (name) => {
    if (!name) return "??";
    const nameParts = name.trim().split(" ");
    if (nameParts.length === 1) {
      return nameParts[0].charAt(0);
    }
    return nameParts[0].charAt(0) + nameParts[nameParts.length - 1].charAt(0);
  };

  const [profileData, setProfileData] = useState({
    name: user?.name || "",
    email: user?.email || "",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // If user is not loaded yet, show loading
  if (!user) {
    return (
      <ContentBox>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
          }}
        >
          <p>Loading...</p>
        </div>
      </ContentBox>
    );
  }

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setMessage({ text: "Image size must be less than 5MB", type: "error" });
        return;
      }

      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageUpload = async () => {
    if (!imageFile) {
      setMessage({ text: "Please select an image first", type: "error" });
      return;
    }

    setLoading(true);
    setMessage({ text: "", type: "" });

    try {
      const formData = new FormData();
      formData.append("profilePicture", imageFile);

      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/users/profile/image`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        const updatedUserData = await response.json();
        setMessage({
          text: "Profile image updated successfully!",
          type: "success",
        });
        setImageFile(null);
        setProfileImage(updatedUserData.profilePicture);

        // Update user context - this will update the avatar in the sidebar
        updateUser(updatedUserData);
      } else {
        const error = await response.json();
        setMessage({
          text: error.message || "Failed to update image",
          type: "error",
        });
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      setMessage({
        text: "An error occurred. Please try again.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: "", type: "" });

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/users/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(profileData),
      });

      if (response.ok) {
        const updatedUserData = await response.json();
        setMessage({ text: "Profile updated successfully!", type: "success" });

        // Update user context
        updateUser(updatedUserData);
      } else {
        const error = await response.json();
        setMessage({
          text: error.message || "Failed to update profile",
          type: "error",
        });
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      setMessage({
        text: "An error occurred. Please try again.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: "", type: "" });

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({ text: "New passwords do not match", type: "error" });
      setLoading(false);
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setMessage({
        text: "Password must be at least 6 characters",
        type: "error",
      });
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/users/password`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        }),
      });

      if (response.ok) {
        setMessage({ text: "Password updated successfully!", type: "success" });
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      } else {
        const error = await response.json();
        setMessage({
          text: error.message || "Failed to update password",
          type: "error",
        });
      }
    } catch (error) {
      console.error("Error updating password:", error);
      setMessage({
        text: "An error occurred. Please try again.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = () => {
    // Clear localStorage completely
    localStorage.removeItem("token");
    localStorage.removeItem("taskflow_user");
    
    // Call logout from AuthContext
    logout();
    
    // Navigate directly to home page
    navigate("/");
  };

  return (
    <ContentBox>
      <Header>
        <HeaderContent>
          <HeaderIcon>
            <FiSettings />
          </HeaderIcon>
          <HeaderText>
            <Heading>Account Settings</Heading>
            <Subtitle>Manage your profile and preferences</Subtitle>
          </HeaderText>
        </HeaderContent>
      </Header>

      <SettingsContainer>
        {message.text && <Message $type={message.type}>{message.text}</Message>}

        <Section>
          <SectionTitle>
            <FiCamera />
            Profile Picture
          </SectionTitle>
          <ProfileImageSection>
            <ProfileImageContainer>
              {profileImage ? (
                <ProfileImage src={profileImage} alt="Profile" />
              ) : (
                <ProfileInitials>{getUserInitials(user?.name)}</ProfileInitials>
              )}
              <UploadOverlay className="upload-overlay">
                <FiCamera />
                <span>Change Photo</span>
                <HiddenInput
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </UploadOverlay>
            </ProfileImageContainer>
            <ImageInfo>
              <ImageTitle>Profile Picture</ImageTitle>
              <ImageDescription>
                Choose a profile picture to personalize your account. Click on the image to upload a new photo. Maximum file size: 5MB. Supported formats: JPG, PNG, GIF.
              </ImageDescription>
              {imageFile && (
                <Button
                  type="button"
                  onClick={handleImageUpload}
                  disabled={loading}
                >
                  <FiSave />
                  {loading ? "Uploading..." : "Save Image"}
                </Button>
              )}
            </ImageInfo>
          </ProfileImageSection>
        </Section>

        <Section>
          <SectionTitle>
            <FiUser />
            Personal Information
          </SectionTitle>
          <form onSubmit={handleProfileSubmit}>
            <FormGroup>
              <Label>Full Name</Label>
              <Input
                type="text"
                name="name"
                value={profileData.name}
                onChange={handleProfileChange}
                placeholder="Enter your full name"
                required
              />
            </FormGroup>

            <FormGroup>
              <Label>Email Address</Label>
              <Input
                type="email"
                name="email"
                value={profileData.email}
                onChange={handleProfileChange}
                placeholder="Enter your email address"
                required
              />
              <InfoText>
                Your email is used for login, notifications, and account recovery
              </InfoText>
            </FormGroup>

            <Button type="submit" disabled={loading}>
              <FiSave />
              {loading ? "Saving Changes..." : "Save Changes"}
            </Button>
          </form>
        </Section>

        <Section>
          <SectionTitle>
            <FiShield />
            Password & Security
          </SectionTitle>
          <form onSubmit={handlePasswordSubmit}>
            <FormGroup>
              <Label>Current Password</Label>
              <Input
                type="password"
                name="currentPassword"
                value={passwordData.currentPassword}
                onChange={handlePasswordChange}
                placeholder="Enter your current password"
                required
              />
            </FormGroup>

            <FormGroup>
              <Label>New Password</Label>
              <Input
                type="password"
                name="newPassword"
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
                placeholder="Enter your new password"
                required
              />
              <InfoText>Password must be at least 6 characters long and contain a mix of letters and numbers</InfoText>
            </FormGroup>

            <FormGroup>
              <Label>Confirm New Password</Label>
              <Input
                type="password"
                name="confirmPassword"
                value={passwordData.confirmPassword}
                onChange={handlePasswordChange}
                placeholder="Confirm your new password"
                required
              />
            </FormGroup>

            <Button type="submit" disabled={loading}>
              <FiLock />
              {loading ? "Updating Password..." : "Update Password"}
            </Button>
          </form>
        </Section>

        <Section>
          <SectionTitle>
            <FiMail />
            Account Details
          </SectionTitle>
          <FormGroup>
            <Label>User ID</Label>
            <Input
              type="text"
              value={user?._id || user?.id || "Not available"}
              disabled
              readOnly
            />
            <InfoText>Your unique account identifier - this cannot be changed</InfoText>
          </FormGroup>

          <FormGroup>
            <Label>Member Since</Label>
            <Input
              type="text"
              value={
                user?.createdAt
                  ? new Date(user.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })
                  : "Not available"
              }
              disabled
              readOnly
            />
            <InfoText>The date when your account was created</InfoText>
          </FormGroup>
        </Section>

        <Section>
          <SectionTitle>
            <FiLogOut />
            Session Management
          </SectionTitle>
          <SignOutDescription>
            Sign out of your account on this device. You'll need to enter your credentials to sign back in. This will not affect your account or data, only your current session.
          </SignOutDescription>
          <ButtonGroup>
            <DangerButton type="button" onClick={handleSignOut}>
              <FiLogOut />
              Sign Out
            </DangerButton>
          </ButtonGroup>
        </Section>
      </SettingsContainer>
    </ContentBox>
  );
};

export default SettingsPage;
