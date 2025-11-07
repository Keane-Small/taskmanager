import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { resetPassword, resetPasswordWithCheck, checkUserExists } from '../config/firebase';
import { validateEmail } from '../config/authHelpers';
import './Auth.css';
import { FiCheckCircle, FiMail, FiArrowLeft, FiCheck, FiAlertCircle, FiInfo } from 'react-icons/fi';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [emailSent, setEmailSent] = useState(false);
  const [debugInfo, setDebugInfo] = useState('');

  const handleCheckUser = async () => {
    if (!validateEmail(email)) {
      setError('Please enter a valid email address first');
      return;
    }

    setIsLoading(true);
    setError('');
    setDebugInfo('');

    try {
      const userCheck = await checkUserExists(email);
      if (userCheck.exists) {
        setDebugInfo(`✅ User exists with sign-in methods: ${userCheck.methods.join(', ')}`);
      } else {
        setDebugInfo(`❌ No account found with email: ${email}`);
      }
    } catch (err) {
      setDebugInfo(`⚠️ Error checking user: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!email) {
      setError('Please enter your email address');
      return;
    }

    // Email validation using helper function
    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    setError('');
    setMessage('');

    try {
      console.log('🚀 Initiating password reset for:', email);
      const result = await resetPassword(email);
      
      console.log('📋 Password reset result:', result);
      
      if (result.success) {
        setEmailSent(true);
        setMessage(result.message || 'Password reset email sent! Please check your inbox and spam folder.');
        console.log('✅ Success: Email sent successfully');
      } else {
        console.log('❌ Error occurred:', result.error, 'Code:', result.code);
        
        // Show more specific error messages
        let errorMessage = result.error || 'Failed to send reset email. Please try again.';
        
        if (result.code === 'auth/user-not-found') {
          errorMessage = `No account found with email "${email}". Please check the email address or sign up for a new account.`;
        } else if (result.code === 'auth/too-many-requests') {
          errorMessage = 'Too many password reset attempts. Please wait a few minutes before trying again.';
        }
        
        setError(errorMessage);
      }
    } catch (err) {
      console.error('❌ Unexpected error during password reset:', err);
      setError('Unable to send reset email. Please check your internet connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleResendEmail = () => {
    setEmailSent(false);
    setMessage('');
    setError('');
  };

  if (emailSent) {
    return (
      <div className="auth-container">
        <div className="auth-box">
          <div className="auth-header">
            <Link to="/" className="auth-logo">
              <FiCheckCircle className="logo-icon" />
              <span className="logo-text">TaskFlow</span>
            </Link>
            <div className="success-icon">
              <FiCheck />
            </div>
            <h1>Check Your Email</h1>
            <p>We've sent a password reset link to <strong>{email}</strong></p>
          </div>

          <div className="success-message">
            <FiCheck className="success-icon-small" />
            {message}
          </div>

          <div className="reset-instructions">
            <h3>What's next?</h3>
            <ol>
              <li>Check your email inbox for our message</li>
              <li>If you don't see it, check your spam or junk folder</li>
              <li>Click the reset link in the email</li>
              <li>Create a new password for your account</li>
            </ol>
          </div>

          <div className="auth-actions">
            <button 
              className="btn-secondary" 
              onClick={handleResendEmail}
              type="button"
            >
              Send Another Email
            </button>
            
            <Link to="/login" className="btn-primary">
              Back to Sign In
            </Link>
          </div>

          <div className="back-home">
            <Link to="/">← Back to home</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <div className="auth-box">
        <div className="auth-header">
          <Link to="/" className="auth-logo">
            <FiCheckCircle className="logo-icon" />
            <span className="logo-text">TaskFlow</span>
          </Link>
          <h1>Reset Your Password</h1>
          <p>Enter your email address and we'll send you a link to reset your password</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          {error && (
            <div className="error-message">
              <FiAlertCircle />
              {error}
            </div>
          )}

          {debugInfo && (
            <div style={{
              padding: '12px',
              margin: '10px 0',
              backgroundColor: '#f8f9fa',
              border: '1px solid #ddd',
              borderRadius: '8px',
              fontSize: '14px',
              fontFamily: 'monospace',
              color: '#333'
            }}>
              <FiInfo style={{ marginRight: '6px' }} />
              {debugInfo}
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
                  setDebugInfo('');
                }}
                autoComplete="email"
                disabled={isLoading}
              />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <button 
              type="button" 
              onClick={handleCheckUser}
              className="btn-secondary"
              disabled={isLoading}
              style={{
                backgroundColor: '#6c757d',
                color: 'white',
                border: 'none',
                padding: '12px 20px',
                borderRadius: '8px',
                fontSize: '14px',
                cursor: 'pointer'
              }}
            >
              {isLoading ? 'Checking...' : '🔍 Check if Account Exists'}
            </button>

            <button 
              type="submit" 
              className="btn-submit"
              disabled={isLoading}
            >
              {isLoading ? 'Sending...' : 'Send Reset Link'}
            </button>
          </div>
        </form>

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

export default ForgotPassword;