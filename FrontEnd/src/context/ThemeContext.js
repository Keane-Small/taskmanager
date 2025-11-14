import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

// Light mode colors (current palette)
export const lightTheme = {
  name: 'light',
  colors: {
    // Backgrounds
    primary: '#DAF1DE',
    secondary: '#FFFFFF',
    tertiary: '#F5F5F5',
    
    // Main colors
    mainBg: '#235347',
    cardBg: '#DAF1DE',
    topBarBg: '#DAF1DE',
    
    // Text colors
    textPrimary: '#0B2B26',
    textSecondary: '#163832',
    textTertiary: '#8EB69B',
    textLight: '#FFFFFF',
    
    // Accent colors
    accent: '#8EB69B',
    accentDark: '#235347',
    accentDarker: '#163832',
    
    // Navigation
    navBg: '#DAF1DE',
    navActive: 'linear-gradient(135deg, #235347 0%, #163832 100%)',
    navInactive: '#163832',
    navHover: 'rgba(142, 182, 155, 0.2)',
    
    // Status colors
    success: '#8EB69B',
    warning: '#ffc107',
    error: '#dc3545',
    
    // Borders and shadows
    border: 'rgba(0, 0, 0, 0.1)',
    shadow: 'rgba(0, 0, 0, 0.08)',
    
    // Message colors
    messageSent: '#235347',
    messageReceived: '#DAF1DE',
  }
};

// Dark mode colors
export const darkTheme = {
  name: 'dark',
  colors: {
    // Backgrounds
    primary: '#0B2B26',
    secondary: '#163832',
    tertiary: '#235347',
    
    // Main colors
    mainBg: '#051F20',
    cardBg: '#163832',
    topBarBg: '#0B2B26',
    
    // Text colors
    textPrimary: '#DAF1DE',
    textSecondary: '#8EB69B',
    textTertiary: '#FFFFFF',
    textLight: '#FFFFFF',
    
    // Accent colors
    accent: '#8EB69B',
    accentDark: '#DAF1DE',
    accentDarker: '#FFFFFF',
    
    // Navigation
    navBg: '#0B2B26',
    navActive: 'linear-gradient(135deg, #8EB69B 0%, #DAF1DE 100%)',
    navInactive: '#8EB69B',
    navHover: 'rgba(142, 182, 155, 0.15)',
    
    // Status colors
    success: '#8EB69B',
    warning: '#ffa726',
    error: '#ef5350',
    
    // Borders and shadows
    border: 'rgba(255, 255, 255, 0.1)',
    shadow: 'rgba(0, 0, 0, 0.3)',
    
    // Message colors
    messageSent: '#8EB69B',
    messageReceived: '#235347',
  }
};

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Load theme preference from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('taskmanager_theme');
    if (savedTheme === 'dark') {
      setIsDarkMode(true);
    }
    setIsLoading(false);
  }, []);

  // Save theme preference to localStorage when it changes
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem('taskmanager_theme', isDarkMode ? 'dark' : 'light');
      // Add transition class to body for smooth theme changes
      document.body.style.transition = 'background-color 0.3s ease';
    }
  }, [isDarkMode, isLoading]);

  const toggleTheme = () => {
    setIsDarkMode(prev => !prev);
  };

  const theme = isDarkMode ? darkTheme : lightTheme;

  const value = {
    theme,
    isDarkMode,
    toggleTheme,
    isLoading
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};
