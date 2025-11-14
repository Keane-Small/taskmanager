// Firebase password reset email configuration
// This file contains helper functions for customizing the password reset flow

/**
 * Validates email format
 * @param {string} email 
 * @returns {boolean}
 */
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Gets user-friendly error message from Firebase error code
 * @param {string} errorCode 
 * @returns {string}
 */
export const getFirebaseErrorMessage = (errorCode) => {
  const errorMessages = {
    'auth/user-not-found': 'No account found with this email address.',
    'auth/invalid-email': 'Invalid email address format.',
    'auth/too-many-requests': 'Too many password reset attempts. Please try again later.',
    'auth/network-request-failed': 'Network error. Please check your internet connection.',
    'auth/internal-error': 'Internal error occurred. Please try again.',
    'auth/missing-email': 'Email address is required.',
    'auth/invalid-action-code': 'The password reset link is invalid or has expired.',
    'auth/expired-action-code': 'The password reset link has expired. Please request a new one.',
    'auth/weak-password': 'Password is too weak. Please choose a stronger password.'
  };

  return errorMessages[errorCode] || 'An unexpected error occurred. Please try again.';
};

/**
 * Configuration for Firebase Auth settings
 */
export const firebaseAuthConfig = {
  // Set to true to enable email verification
  sendEmailVerification: false,
  
  // Custom action code settings (for password reset emails)
  actionCodeSettings: {
    // URL to redirect to after password reset
    url: process.env.REACT_APP_AUTH_REDIRECT_URL || window.location.origin + '/login',
    
    // This must be true for email link sign-in
    handleCodeInApp: true,
  }
};

export default {
  validateEmail,
  getFirebaseErrorMessage,
  firebaseAuthConfig
};