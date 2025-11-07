import { useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FiUser, FiMail, FiLock, FiSave, FiCamera, FiLogOut } from "react-icons/fi";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

const ContentBox = styled.div`
  position: fixed;
  left: 100px;
  top: 95px;
  right: 20px;
  bottom: 15px;
  background-color: #fafafa;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
  padding: 30px;
  overflow-y: auto;
`;

const Heading = styled.h1`
  margin: 0 0 30px 0;
  font-size: 32px;
  font-weight: 600;
  color: #000000;
`;

const SettingsContainer = styled.div`
  max-width: 800px;
`;

const Section = styled.div`
  background: #ffffff;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
`;

const SectionTitle = styled.h2`
  font-size: 20px;
  font-weight: 600;
  color: #000000;
  margin: 0 0 20px 0;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  font-size: 14px;
  font-weight: 600;
  color: #333;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 14px;
  transition: border-color 0.2s;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: #000000;
  }

  &:disabled {
    background-color: #f5f5f5;
    cursor: not-allowed;
  }
`;

const Button = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  background-color: #000000;
  color: #ffffff;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background-color: #333333;
    transform: scale(1.02);
  }

  &:active {
    transform: scale(0.98);
  }

  &:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
    transform: none;
  }
`;

const Message = styled.div`
  padding: 12px 16px;
  border-radius: 8px;
  margin-bottom: 20px;
  font-size: 14px;
  background-color: ${(props) =>
    props.$type === "success" ? "#D4EDDA" : "#F8D7DA"};
  color: ${(props) => (props.$type === "success" ? "#155724" : "#721C24")};
  border: 1px solid
    ${(props) => (props.$type === "success" ? "#C3E6CB" : "#F5C6CB")};
`;

const InfoText = styled.p`
  color: #666;
  font-size: 14px;
  margin: 8px 0 0 0;
`;

const ProfileImageSection = styled.div`
  display: flex;
  align-items: center;
  gap: 24px;
`;

const ProfileImageContainer = styled.div`
  position: relative;
  width: 120px;
  height: 120px;
  border-radius: 50%;
  overflow: hidden;
  background: #f0f0f0;
  border: 4px solid #e0e0e0;

  &:hover .upload-overlay {
    opacity: 1;
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
  font-size: 48px;
  font-weight: 600;
  color: white;
  text-transform: uppercase;
`;

const UploadOverlay = styled.label`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.2s;
  cursor: pointer;
  color: white;
  font-size: 12px;
  gap: 4px;
`;

const HiddenInput = styled.input`
  display: none;
`;

const ImageInfo = styled.div`
  flex: 1;
`;

const ImageTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: #000;
  margin: 0 0 8px 0;
`;

const ImageDescription = styled.p`
  font-size: 14px;
  color: #666;
  margin: 0;
`;

const DangerButton = styled(Button)`
  background-color: #dc3545;
  color: #ffffff;

  &:hover {
    background-color: #c82333;
    transform: scale(1.02);
  }

  &:active {
    transform: scale(0.98);
  }
`;

const SignOutDescription = styled.p`
  color: #666;
  font-size: 14px;
  margin: 0 0 20px 0;
  line-height: 1.5;
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
      <Heading>Settings</Heading>

      <SettingsContainer>
        {message.text && <Message $type={message.type}>{message.text}</Message>}

        <Section>
          <SectionTitle>
            <FiCamera size={24} />
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
                <FiCamera size={24} />
                <span>Change Photo</span>
                <HiddenInput
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </UploadOverlay>
            </ProfileImageContainer>
            <ImageInfo>
              <ImageTitle>Upload Profile Picture</ImageTitle>
              <ImageDescription>
                Click on the image to upload a new profile picture. Maximum file
                size: 5MB
              </ImageDescription>
              {imageFile && (
                <Button
                  type="button"
                  onClick={handleImageUpload}
                  disabled={loading}
                  style={{ marginTop: "12px" }}
                >
                  <FiSave size={18} />
                  {loading ? "Uploading..." : "Save Image"}
                </Button>
              )}
            </ImageInfo>
          </ProfileImageSection>
        </Section>

        <Section>
          <SectionTitle>
            <FiUser size={24} />
            Profile Information
          </SectionTitle>
          <form onSubmit={handleProfileSubmit}>
            <FormGroup>
              <Label>Name</Label>
              <Input
                type="text"
                name="name"
                value={profileData.name}
                onChange={handleProfileChange}
                placeholder="Enter your name"
                required
              />
            </FormGroup>

            <FormGroup>
              <Label>Email</Label>
              <Input
                type="email"
                name="email"
                value={profileData.email}
                onChange={handleProfileChange}
                placeholder="Enter your email"
                required
              />
              <InfoText>
                Your email is used for login and notifications
              </InfoText>
            </FormGroup>

            <Button type="submit" disabled={loading}>
              <FiSave size={18} />
              {loading ? "Saving..." : "Save Profile"}
            </Button>
          </form>
        </Section>

        <Section>
          <SectionTitle>
            <FiLock size={24} />
            Change Password
          </SectionTitle>
          <form onSubmit={handlePasswordSubmit}>
            <FormGroup>
              <Label>Current Password</Label>
              <Input
                type="password"
                name="currentPassword"
                value={passwordData.currentPassword}
                onChange={handlePasswordChange}
                placeholder="Enter current password"
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
                placeholder="Enter new password"
                required
              />
              <InfoText>Password must be at least 6 characters</InfoText>
            </FormGroup>

            <FormGroup>
              <Label>Confirm New Password</Label>
              <Input
                type="password"
                name="confirmPassword"
                value={passwordData.confirmPassword}
                onChange={handlePasswordChange}
                placeholder="Confirm new password"
                required
              />
            </FormGroup>

            <Button type="submit" disabled={loading}>
              <FiLock size={18} />
              {loading ? "Updating..." : "Update Password"}
            </Button>
          </form>
        </Section>

        <Section>
          <SectionTitle>
            <FiMail size={24} />
            Account Information
          </SectionTitle>
          <FormGroup>
            <Label>User ID</Label>
            <Input
              type="text"
              value={user?._id || user?.id || "N/A"}
              disabled
            />
            <InfoText>Your unique user identifier</InfoText>
          </FormGroup>

          <FormGroup>
            <Label>Account Created</Label>
            <Input
              type="text"
              value={
                user?.createdAt
                  ? new Date(user.createdAt).toLocaleDateString()
                  : "N/A"
              }
              disabled
            />
          </FormGroup>
        </Section>

        <Section>
          <SectionTitle>
            <FiLogOut size={24} />
            Sign Out
          </SectionTitle>
          <SignOutDescription>
            Sign out of your account on this device. You will need to enter your 
            credentials to sign back in.
          </SignOutDescription>
          <DangerButton type="button" onClick={handleSignOut}>
            <FiLogOut size={18} />
            Sign Out
          </DangerButton>
        </Section>
      </SettingsContainer>
    </ContentBox>
  );
};

export default SettingsPage;
