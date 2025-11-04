import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiCheckCircle, FiMail, FiLock, FiEye, FiEyeOff, FiX, FiUser } from 'react-icons/fi';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';

const AuthModal = ({ isOpen, onClose, initialMode = 'login' }) => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [mode, setMode] = useState(initialMode);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Update mode when initialMode prop changes
  useEffect(() => {
    setMode(initialMode);
  }, [initialMode]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
    setSuccessMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

    try {
      if (mode === 'login') {
        const response = await fetch(`${API_URL}/users/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
          }),
        });

        const data = await response.json();

        if (response.ok) {
          localStorage.setItem('token', data.token);
          login(data.user);
          onClose();
          navigate('/app');
        } else {
          setError(data.message || 'Login failed. Please check your credentials.');
        }
      } else if (mode === 'forgot-password') {
        const response = await fetch(`${API_URL}/users/forgot-password`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: formData.email,
          }),
        });

        const data = await response.json();

        if (response.ok) {
          setSuccessMessage('Password reset link has been sent to your email address.');
          setFormData({ name: '', email: '', password: '', confirmPassword: '' });
        } else {
          setError(data.message || 'Failed to send reset email. Please try again.');
        }
      } else {
        // Signup validation
        if (formData.password !== formData.confirmPassword) {
          setError('Passwords do not match');
          return;
        }
        
        if (formData.password.length < 6) {
          setError('Password must be at least 6 characters');
          return;
        }

        const response = await fetch(`${API_URL}/users/register`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            password: formData.password,
          }),
        });

        const data = await response.json();

        if (response.ok) {
          // Auto-login after registration
          const loginResponse = await fetch(`${API_URL}/users/login`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: formData.email,
              password: formData.password,
            }),
          });

          const loginData = await loginResponse.json();

          if (loginResponse.ok) {
            localStorage.setItem('token', loginData.token);
            login(loginData.user);
            onClose();
            navigate('/app');
          }
        } else {
          setError(data.message || 'Registration failed. Please try again.');
        }
      }
    } catch (err) {
      console.error('Auth error:', err);
      setError('Unable to connect to server. Please try again later.');
    }
  };

  const toggleMode = () => {
    if (mode === 'login') {
      setMode('signup');
    } else if (mode === 'signup') {
      setMode('login');
    } else if (mode === 'forgot-password') {
      setMode('login');
    }
    setError('');
    setSuccessMessage('');
    setFormData({ name: '', email: '', password: '', confirmPassword: '' });
  };

  const showForgotPassword = () => {
    setMode('forgot-password');
    setError('');
    setSuccessMessage('');
    setFormData({ name: '', email: '', password: '', confirmPassword: '' });
  };

  const getTitle = () => {
    switch (mode) {
      case 'signup': return 'Get started free';
      case 'forgot-password': return 'Reset Password';
      default: return 'Welcome back';
    }
  };

  const getSubtitle = () => {
    switch (mode) {
      case 'signup': return 'Create your account and start organizing your tasks';
      case 'forgot-password': return 'Enter your email to receive a password reset link';
      default: return 'Sign in to continue to TaskFlow';
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <Overlay
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <ModalContainer
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ type: "spring", damping: 25, stiffness: 500 }}
          >
            <CloseButton onClick={onClose}>
              <FiX />
            </CloseButton>
            
            <Header>
              <Logo>
                <FiCheckCircle />
                <span>TaskFlow</span>
              </Logo>
              <Title>{getTitle()}</Title>
              <Subtitle>{getSubtitle()}</Subtitle>
            </Header>

            {error && <ErrorMessage>{error}</ErrorMessage>}
            {successMessage && <SuccessMessage>{successMessage}</SuccessMessage>}

            <Form onSubmit={handleSubmit}>
              {mode === 'signup' && (
                <FormGroup>
                  <Label>Full name</Label>
                  <InputWrapper>
                    <FiUser className="input-icon" />
                    <Input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter your full name"
                      required
                    />
                  </InputWrapper>
                </FormGroup>
              )}

              <FormGroup>
                <Label>{mode === 'forgot-password' ? 'Email' : 'Email address'}</Label>
                <InputWrapper>
                  <FiMail className="input-icon" />
                  <Input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    required
                  />
                </InputWrapper>
              </FormGroup>

              {mode !== 'forgot-password' && (
                <FormGroup>
                  <Label>Password</Label>
                  <InputWrapper>
                    <FiLock className="input-icon" />
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder={mode === 'signup' ? 'Create a password' : '••••••••'}
                      required
                    />
                    <TogglePassword
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <FiEyeOff /> : <FiEye />}
                    </TogglePassword>
                  </InputWrapper>
                  {mode === 'signup' && (
                    <HelperText>Must be at least 6 characters</HelperText>
                  )}
                </FormGroup>
              )}

              {mode === 'signup' && (
                <FormGroup>
                  <Label>Confirm password</Label>
                  <InputWrapper>
                    <FiLock className="input-icon" />
                    <Input
                      type={showConfirmPassword ? 'text' : 'password'}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Confirm your password"
                      required
                    />
                    <TogglePassword
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
                    </TogglePassword>
                  </InputWrapper>
                </FormGroup>
              )}

              {mode === 'login' && (
                <LoginOptions>
                  <CheckboxWrapper>
                    <Checkbox
                      type="checkbox"
                      id="rememberMe"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                    />
                    <CheckboxLabel htmlFor="rememberMe">Remember me</CheckboxLabel>
                  </CheckboxWrapper>
                  <ForgotPasswordLink onClick={showForgotPassword}>
                    Forgot password?
                  </ForgotPasswordLink>
                </LoginOptions>
              )}

              <SubmitButton type="submit">
                {mode === 'login' ? 'Sign In' : 
                 mode === 'signup' ? 'Create Account' : 
                 'Send Reset Link'}
              </SubmitButton>
            </Form>

            {mode === 'signup' && (
              <Terms>
                By signing up, you agree to our <TermsLink>Terms of Service</TermsLink> and <TermsLink>Privacy Policy</TermsLink>
              </Terms>
            )}

            <Footer>
              {mode !== 'forgot-password' && (
                <>
                  <span>or</span>
                  <FooterText>
                    {mode === 'login' ? "Don't have an account? " : "Already have an account? "}
                    <FooterLink onClick={toggleMode}>
                      {mode === 'login' ? 'Sign up' : 'Sign in'}
                    </FooterLink>
                  </FooterText>
                </>
              )}
              {mode === 'forgot-password' && (
                <FooterText>
                  Remember your password? 
                  <FooterLink onClick={toggleMode}>
                    Back to Sign in
                  </FooterLink>
                </FooterText>
              )}
            </Footer>
          </ModalContainer>
        </>
      )}
    </AnimatePresence>
  );
};

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  z-index: 1000;
  pointer-events: auto;
`;

const ModalContainer = styled(motion.div)`
  position: fixed;
  top: 1%;
  left: 35%;
  transform: translate(-50%, -50%);
  background: white;
  padding: 2rem;
  border-radius: 24px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  z-index: 1001;
  width: 90%;
  max-width: 456px;
  min-width: 400px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  pointer-events: auto;
  margin: 0;
  box-sizing: border-box;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 1.5rem;
  right: 1.5rem;
  background: none;
  border: none;
  color: #9ca3af;
  cursor: pointer;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.2s ease;

  &:hover {
    background: #f3f4f6;
    color: #6b7280;
  }

  svg {
    width: 20px;
    height: 20px;
  }
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 2rem;
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  color: #2D5A3D;
  font-weight: 600;
  font-size: 1.25rem;

  svg {
    font-size: 1.5rem;
  }
`;

const Title = styled.h1`
  margin: 0 0 0.5rem 0;
  font-size: 2rem;
  font-weight: 700;
  color: #111827;
  line-height: 1.2;
`;

const Subtitle = styled.p`
  margin: 0;
  color: #6b7280;
  font-size: 1rem;
  line-height: 1.5;
`;

const Form = styled.form`
  width: 100%;
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #374151;
  font-size: 0.875rem;
`;

const InputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;

  .input-icon {
    position: absolute;
    left: 1rem;
    color: #9ca3af;
    z-index: 1;
    font-size: 1rem;
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 0.875rem 1rem 0.875rem 2.75rem;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  font-size: 1rem;
  transition: all 0.2s ease;
  box-sizing: border-box;
  background: #f9fafb;

  &:focus {
    outline: none;
    border-color: #2D5A3D;
    background: white;
    box-shadow: 0 0 0 3px rgba(45, 90, 61, 0.1);
  }

  &::placeholder {
    color: #9ca3af;
  }
`;

const TogglePassword = styled.button`
  position: absolute;
  right: 1rem;
  background: none;
  border: none;
  color: #9ca3af;
  cursor: pointer;
  padding: 0.25rem;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    color: #6b7280;
  }

  svg {
    font-size: 1rem;
  }
`;

const HelperText = styled.div`
  margin-top: 0.5rem;
  font-size: 0.875rem;
  color: #6b7280;
`;

const LoginOptions = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const CheckboxWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const Checkbox = styled.input`
  width: 16px;
  height: 16px;
  accent-color: #2D5A3D;
`;

const CheckboxLabel = styled.label`
  font-size: 0.875rem;
  color: #374151;
  cursor: pointer;
`;

const ForgotPasswordLink = styled.button`
  background: none;
  border: none;
  color: #6b7280;
  font-size: 0.875rem;
  cursor: pointer;
  text-decoration: none;

  &:hover {
    color: #2D5A3D;
  }
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 0.875rem;
  background: #2D5A3D;
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-bottom: 1.5rem;

  &:hover {
    background: #1F3E2A;
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }
`;

const Terms = styled.div`
  text-align: center;
  font-size: 0.875rem;
  color: #6b7280;
  margin-bottom: 1.5rem;
  line-height: 1.5;
`;

const TermsLink = styled.button`
  background: none;
  border: none;
  color: #2D5A3D;
  cursor: pointer;
  text-decoration: underline;
  padding: 0;
  font-size: inherit;

  &:hover {
    color: #1F3E2A;
  }
`;

const Footer = styled.div`
  text-align: center;

  span {
    display: block;
    color: #d1d5db;
    font-size: 0.875rem;
    margin-bottom: 1rem;
    position: relative;

    &:before,
    &:after {
      content: '';
      position: absolute;
      top: 50%;
      width: 40%;
      height: 1px;
      background: #e5e7eb;
    }

    &:before {
      left: 0;
    }

    &:after {
      right: 0;
    }
  }
`;

const FooterText = styled.div`
  color: #6b7280;
  font-size: 0.875rem;
`;

const FooterLink = styled.button`
  background: none;
  border: none;
  color: #2D5A3D;
  font-weight: 600;
  cursor: pointer;
  padding: 0;
  font-size: inherit;
  margin-left: 0.25rem;

  &:hover {
    text-decoration: underline;
    color: #1F3E2A;
  }
`;

const ErrorMessage = styled.div`
  background: #fee2e2;
  border: 1px solid #ef4444;
  color: #991b1b;
  padding: 0.75rem;
  border-radius: 8px;
  margin-bottom: 1rem;
  font-size: 0.875rem;
`;

const SuccessMessage = styled.div`
  background: #d1fae5;
  border: 1px solid #10b981;
  color: #065f46;
  padding: 0.75rem;
  border-radius: 8px;
  margin-bottom: 1rem;
  font-size: 0.875rem;
`;

export default AuthModal;