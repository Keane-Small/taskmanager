import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiLock, FiEye, FiEyeOff, FiCheckCircle } from 'react-icons/fi';
import styled from 'styled-components';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [tokenValid, setTokenValid] = useState(false);
  const [userEmail, setUserEmail] = useState('');

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    verifyToken();
  }, [token]);

  const verifyToken = async () => {
    try {
      const response = await fetch(`${API_URL}/users/verify-reset-token/${token}`);
      const data = await response.json();

      if (response.ok) {
        setTokenValid(true);
        setUserEmail(data.email);
      } else {
        setError(data.message || 'Invalid or expired reset token');
      }
    } catch (err) {
      setError('Unable to verify reset token. Please try again.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_URL}/users/reset-password/${token}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
        setTimeout(() => {
          navigate('/');
        }, 3000);
      } else {
        setError(data.message || 'Failed to reset password');
      }
    } catch (err) {
      setError('Unable to reset password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!tokenValid && !error) {
    return (
      <Container>
        <Card>
          <div className="loading">Verifying reset token...</div>
        </Card>
      </Container>
    );
  }

  if (error && !tokenValid) {
    return (
      <Container>
        <Card>
          <div className="error-state">
            <h2>Invalid Reset Link</h2>
            <p>{error}</p>
            <button onClick={() => navigate('/')} className="btn-primary">
              Back to Home
            </button>
          </div>
        </Card>
      </Container>
    );
  }

  if (success) {
    return (
      <Container>
        <Card>
          <div className="success-state">
            <FiCheckCircle className="success-icon" />
            <h2>Password Reset Successful!</h2>
            <p>Your password has been successfully reset.</p>
            <p>Redirecting to login page in 3 seconds...</p>
            <button onClick={() => navigate('/')} className="btn-primary">
              Go to Login
            </button>
          </div>
        </Card>
      </Container>
    );
  }

  return (
    <Container>
      <Card>
        <div className="header">
          <div className="logo">
            <FiCheckCircle className="logo-icon" />
            <span>TaskFlow</span>
          </div>
          <h1>Reset Your Password</h1>
          <p>Enter your new password for {userEmail}</p>
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>New Password</label>
            <div className="input-wrapper">
              <FiLock className="input-icon" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter new password"
                required
                minLength={6}
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
          </div>

          <div className="form-group">
            <label>Confirm New Password</label>
            <div className="input-wrapper">
              <FiLock className="input-icon" />
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                required
                minLength={6}
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
          </div>

          <button type="submit" className="btn-submit" disabled={loading}>
            {loading ? 'Resetting Password...' : 'Reset Password'}
          </button>
        </form>

        <div className="footer">
          <button onClick={() => navigate('/')} className="back-link">
            Back to Login
          </button>
        </div>
      </Card>
    </Container>
  );
};

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 1rem;
`;

const Card = styled.div`
  background: white;
  padding: 2.5rem;
  border-radius: 16px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  width: 100%;
  max-width: 440px;
  min-width: 320px;

  .header {
    text-align: center;
    margin-bottom: 2rem;

    .logo {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      margin-bottom: 1rem;
      color: #2D5A3D;
      font-weight: 600;
      font-size: 1.125rem;

      .logo-icon {
        font-size: 1.5rem;
      }
    }

    h1 {
      margin: 0 0 0.5rem 0;
      font-size: 1.875rem;
      font-weight: 700;
      color: #111827;
    }

    p {
      margin: 0;
      color: #6b7280;
      font-size: 0.875rem;
    }
  }

  .form-group {
    margin-bottom: 1.5rem;

    label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 500;
      color: #374151;
      font-size: 0.875rem;
    }

    .input-wrapper {
      position: relative;
      display: flex;
      align-items: center;

      .input-icon {
        position: absolute;
        left: 1rem;
        color: #9ca3af;
        z-index: 1;
      }

      input {
        width: 100%;
        padding: 0.75rem 1rem 0.75rem 2.5rem;
        border: 2px solid #e5e7eb;
        border-radius: 8px;
        font-size: 1rem;
        transition: all 0.2s ease;
        box-sizing: border-box;

        &:focus {
          outline: none;
          border-color: #2D5A3D;
          box-shadow: 0 0 0 3px rgba(45, 90, 61, 0.1);
        }

        &::placeholder {
          color: #9ca3af;
        }
      }

      .toggle-password {
        position: absolute;
        right: 1rem;
        background: none;
        border: none;
        color: #9ca3af;
        cursor: pointer;
        padding: 0.25rem;
        z-index: 1;

        &:hover {
          color: #6b7280;
        }
      }
    }
  }

  .btn-submit {
    width: 100%;
    padding: 0.875rem;
    background: #2D5A3D;
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
    margin-bottom: 1.5rem;

    &:hover:not(:disabled) {
      background: #1F3E2A;
      transform: translateY(-1px);
    }

    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
  }

  .btn-primary {
    background: #2D5A3D;
    color: white;
    border: none;
    padding: 0.75rem 1.5rem;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
      background: #1F3E2A;
    }
  }

  .footer {
    text-align: center;
  }

  .back-link {
    background: none;
    border: none;
    color: #2D5A3D;
    cursor: pointer;
    font-size: 0.875rem;

    &:hover {
      text-decoration: underline;
    }
  }

  .error-message {
    background: #fee2e2;
    border: 1px solid #ef4444;
    color: #991b1b;
    padding: 0.75rem;
    border-radius: 8px;
    margin-bottom: 1rem;
    font-size: 0.875rem;
  }

  .loading {
    text-align: center;
    padding: 2rem;
    color: #6b7280;
  }

  .error-state {
    text-align: center;
    padding: 1rem 0;

    h2 {
      color: #dc2626;
      margin-bottom: 1rem;
    }

    p {
      color: #6b7280;
      margin-bottom: 1.5rem;
    }
  }

  .success-state {
    text-align: center;
    padding: 1rem 0;

    .success-icon {
      font-size: 3rem;
      color: #10b981;
      margin-bottom: 1rem;
    }

    h2 {
      color: #065f46;
      margin-bottom: 1rem;
    }

    p {
      color: #6b7280;
      margin-bottom: 0.5rem;
    }
  }
`;

export default ResetPassword;