// Using local IP address for development
// Make sure your backend is running on this machine at port 5000
// Replace with your computer's local IP if different
export const API_URL = 'http://10.0.0.161:5000/api';

export const API_ENDPOINTS = {
  // Auth
  LOGIN: '/users/login',
  SIGNUP: '/users/register',
  FORGOT_PASSWORD: '/users/forgot-password',
  RESET_PASSWORD: '/users/reset-password',
  GET_PROFILE: '/users/profile/me',
  UPDATE_PROFILE: '/users/profile',
  
  // Tasks
  TASKS: '/tasks',
  URGENT_TASKS: '/tasks/urgent',
  
  // Projects
  PROJECTS: '/projects',
  
  // Messages
  MESSAGES: '/messages',
  DIRECT_MESSAGES: '/direct-messages',
  
  // Notifications
  NOTIFICATIONS: '/notifications',
  
  // Comments
  COMMENTS: '/comments',
  
  // Activity
  ACTIVITY: '/activity',
};
