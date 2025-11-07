// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getAuth, sendPasswordResetEmail, fetchSignInMethodsForEmail } from "firebase/auth";
import { validateEmail, getFirebaseErrorMessage, firebaseAuthConfig } from './authHelpers';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDpOn7jgkvDfAaz8EDc2CUr_ESfCsFJLDk",
  authDomain: "forget-password-acd69.firebaseapp.com",
  projectId: "forget-password-acd69",
  storageBucket: "forget-password-acd69.firebasestorage.com",
  messagingSenderId: "148034982033",
  appId: "1:148034982033:web:9c38ee1f4a712167032f30",
  measurementId: "G-CSPTE9S4D9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Export analytics for use in other parts of the app
export { analytics };

// Export the password reset function with enhanced error handling and debugging
export const resetPassword = async (email) => {
  try {
    console.log('🔥 Starting password reset for email:', email);
    
    // Validate email format before making Firebase call
    if (!validateEmail(email)) {
      console.log('❌ Email validation failed');
      return {
        success: false,
        error: 'Please enter a valid email address.',
        code: 'auth/invalid-email'
      };
    }

    console.log('✅ Email validation passed');
    console.log('🌍 Firebase Auth Domain:', auth.app.options.authDomain);
    console.log('📧 Attempting to send password reset email...');

    // Try sending password reset email without custom action code settings first
    await sendPasswordResetEmail(auth, email);
    
    console.log('✅ Password reset email sent successfully!');
    return { 
      success: true,
      message: 'Password reset email sent successfully! Please check your inbox and spam folder.'
    };
  } catch (error) {
    console.error('❌ Firebase password reset error:', error);
    console.error('Error code:', error.code);
    console.error('Error message:', error.message);
    
    // Log additional debug information
    if (error.code === 'auth/user-not-found') {
      console.log('ℹ️ This email is not registered in Firebase Auth');
    } else if (error.code === 'auth/too-many-requests') {
      console.log('⚠️ Too many requests - user needs to wait before trying again');
    }
    
    return { 
      success: false, 
      error: getFirebaseErrorMessage(error.code),
      code: error.code,
      originalError: error.message
    };
  }
};

// Helper function to check if user is authenticated
export const getCurrentUser = () => {
  return auth.currentUser;
};

// Helper function to check if user exists
export const checkUserExists = async (email) => {
  try {
    console.log('🔍 Checking if user exists:', email);
    const signInMethods = await fetchSignInMethodsForEmail(auth, email);
    console.log('📋 Sign-in methods for user:', signInMethods);
    
    return {
      exists: signInMethods.length > 0,
      methods: signInMethods
    };
  } catch (error) {
    console.error('Error checking user existence:', error);
    return {
      exists: false,
      methods: [],
      error: error.code
    };
  }
};

// Enhanced password reset function with user existence check
export const resetPasswordWithCheck = async (email) => {
  try {
    console.log('🔥 Starting enhanced password reset for email:', email);
    
    // Validate email format
    if (!validateEmail(email)) {
      console.log('❌ Email validation failed');
      return {
        success: false,
        error: 'Please enter a valid email address.',
        code: 'auth/invalid-email'
      };
    }

    // Check if user exists first
    const userCheck = await checkUserExists(email);
    console.log('👤 User existence check result:', userCheck);
    
    if (!userCheck.exists && !userCheck.error) {
      console.log('❌ User does not exist in Firebase Auth');
      return {
        success: false,
        error: `No account found with email "${email}". Please check the email address or sign up for a new account.`,
        code: 'auth/user-not-found'
      };
    }

    console.log('✅ User exists, proceeding with password reset');
    return await resetPassword(email);
    
  } catch (error) {
    console.error('❌ Error in enhanced password reset:', error);
    return await resetPassword(email); // Fall back to regular reset
  }
};

// Helper function to sign out
export const signOut = async () => {
  try {
    await auth.signOut();
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: getFirebaseErrorMessage(error.code),
      code: error.code
    };
  }
};

export default app;