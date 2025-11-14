import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { validateEmail } from '../config/authHelpers';
import { sendOTPEmail } from '../config/emailService';
import './Auth.css';
import { FiCheckCircle, FiMail, FiArrowLeft, FiCheck, FiAlertCircle, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';

const ForgotPasswordOTP = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState('email'); // 'email', 'otp', 'password'
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

  const handleSendOTP = async (e) => {
    e.preventDefault();
    
    if (!email) {
      setError('Please enter your email address');
      return;
    }

    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    setError('');
    setMessage('');

    try {
      // First, generate OTP and save it to backend
      const response = await fetch(`${API_URL}/users/send-reset-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, skipEmail: true }), // Skip backend email sending
      });

      const data = await response.json();
      
      if (response.ok && data.otp) {
        // Send OTP via EmailJS
        console.log('📧 Sending OTP via EmailJS:', data.otp);
        const emailResult = await sendOTPEmail(email, data.otp, data.userName || 'User');
        
        if (emailResult.success) {
          setMessage('OTP sent to your email address. Please check your inbox and spam folder.');
          setStep('otp');
        } else {
          // Fallback: Show OTP in console for testing if EmailJS fails
          console.log('⚠️ EmailJS failed, using console fallback. OTP:', data.otp);
          setMessage(`OTP generation successful. For testing, check browser console or server logs. OTP: ${data.otp}`);
          setStep('otp');
        }
      } else {
        setError(data.message || 'Failed to generate OTP. Please try again.');
      }
    } catch (err) {
      console.error('Error sending OTP:', err);
      setError('Unable to send OTP. Please check your internet connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    
    if (!otp) {
      setError('Please enter the OTP');
      return;
    }

    if (otp.length !== 6) {
      setError('OTP must be 6 digits');
      return;
    }

    setIsLoading(true);
    setError('');
    setMessage('');

    try {
      const response = await fetch(`${API_URL}/users/verify-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, otp }),
      });

      const data = await response.json();
      
      if (response.ok) {
        setMessage('OTP verified successfully. Please enter your new password.');
        setStep('password');
      } else {
        setError(data.message || 'Invalid OTP. Please try again.');
      }
    } catch (err) {
      console.error('Error verifying OTP:', err);
      setError('Unable to verify OTP. Please check your internet connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    
    if (!newPassword || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);
    setError('');
    setMessage('');

    try {
      const response = await fetch(`${API_URL}/users/reset-password-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email, 
          otp, 
          newPassword 
        }),
      });

      const data = await response.json();
      
      if (response.ok) {
        setMessage('Password reset successful! Redirecting to login...');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        setError(data.message || 'Failed to reset password. Please try again.');
      }
    } catch (err) {
      console.error('Error resetting password:', err);
      setError('Unable to reset password. Please check your internet connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoBack = () => {
    if (step === 'otp') {
      setStep('email');
      setOtp('');
      setError('');
      setMessage('');
    } else if (step === 'password') {
      setStep('otp');
      setNewPassword('');
      setConfirmPassword('');
      setError('');
      setMessage('');
    } else {
      navigate(-1);
    }
  };

  const handleResendOTP = () => {
    setStep('email');
    setOtp('');
    setError('');
    setMessage('');
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <div className="auth-header">
          <Link to="/" className="auth-logo">
            <FiCheckCircle className="logo-icon" />
            <span className="logo-text">TaskFlow</span>
          </Link>

          {step === 'email' && (
            <>
              <h1>Reset Your Password</h1>
              <p>Enter your email address and we'll send you an OTP to reset your password</p>
            </>
          )}

          {step === 'otp' && (
            <>
              <h1>Enter OTP</h1>
              <p>We've sent a 6-digit code to <strong>{email}</strong></p>
            </>
          )}

          {step === 'password' && (
            <>
              <div className="success-icon">
                <FiCheck />
              </div>
              <h1>Set New Password</h1>
              <p>Please enter your new password</p>
            </>
          )}
        </div>

        {/* Step 1: Email Input */}
        {step === 'email' && (
          <form className="auth-form" onSubmit={handleSendOTP}>
            {error && (
              <div className="error-message">
                <FiAlertCircle />
                {error}
              </div>
            )}

            {message && (
              <div className="success-message">
                <FiCheck />
                {message}
              </div>
            )}
            
            <div className="form-group">
              <label htmlFor="email">Email address</label>
              <div className="input-wrapper">
                <FiMail className="input-icon" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError('');
                  }}
                  autoComplete="email"
                  disabled={isLoading}
                />
              </div>
            </div>

            <button 
              type="submit" 
              className="btn-submit"
              disabled={isLoading}
            >
              {isLoading ? 'Sending OTP...' : 'Send OTP'}
            </button>
          </form>
        )}

        {/* Step 2: OTP Input */}
        {step === 'otp' && (
          <form className="auth-form" onSubmit={handleVerifyOTP}>
            {error && (
              <div className="error-message">
                <FiAlertCircle />
                {error}
              </div>
            )}

            {message && (
              <div className="success-message">
                <FiCheck />
                {message}
              </div>
            )}
            
            <div className="form-group">
              <label htmlFor="otp">Enter 6-digit OTP</label>
              <div className="input-wrapper">
                <input
                  type="text"
                  id="otp"
                  name="otp"
                  placeholder="000000"
                  value={otp}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                    setOtp(value);
                    setError('');
                  }}
                  style={{
                    textAlign: 'center',
                    fontSize: '24px',
                    letterSpacing: '8px',
                    fontFamily: 'monospace'
                  }}
                  disabled={isLoading}
                  maxLength="6"
                />
              </div>
            </div>

            <button 
              type="submit" 
              className="btn-submit"
              disabled={isLoading || otp.length !== 6}
            >
              {isLoading ? 'Verifying...' : 'Verify OTP'}
            </button>

            <div className="auth-divider">
              <span>or</span>
            </div>

            <button 
              type="button" 
              className="btn-secondary"
              onClick={handleResendOTP}
              disabled={isLoading}
            >
              Resend OTP
            </button>
          </form>
        )}

        {/* Step 3: New Password */}
        {step === 'password' && (
          <form className="auth-form" onSubmit={handleResetPassword}>
            {error && (
              <div className="error-message">
                <FiAlertCircle />
                {error}
              </div>
            )}

            {message && (
              <div className="success-message">
                <FiCheck />
                {message}
              </div>
            )}
            
            <div className="form-group">
              <label htmlFor="newPassword">New Password</label>
              <div className="input-wrapper">
                <FiLock className="input-icon" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="newPassword"
                  name="newPassword"
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) => {
                    setNewPassword(e.target.value);
                    setError('');
                  }}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm New Password</label>
              <div className="input-wrapper">
                <FiLock className="input-icon" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  name="confirmPassword"
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    setError('');
                  }}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
            </div>

            <button 
              type="submit" 
              className="btn-submit"
              disabled={isLoading}
            >
              {isLoading ? 'Resetting Password...' : 'Reset Password'}
            </button>
          </form>
        )}

        <div className="auth-divider">
          <span>or</span>
        </div>

        <div className="auth-switch">
          <p>Remember your password? <Link to="/login">Sign in</Link></p>
          <p>Don't have an account? <Link to="/signup">Sign up</Link></p>
        </div>

        <div className="back-home">
          <button onClick={handleGoBack} className="back-link">
            <FiArrowLeft /> Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordOTP;