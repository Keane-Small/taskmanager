// Using LocalTunnel to expose backend
// Update this URL when you restart localtunnel (it generates a new URL each time)
export const API_URL = 'https://wet-sides-repair.loca.lt/api';

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
