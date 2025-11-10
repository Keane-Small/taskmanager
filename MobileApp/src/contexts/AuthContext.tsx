import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import * as SecureStore from 'expo-secure-store';
import { User, AuthContextType } from '../types';
import apiService from '../services/api';
import { API_ENDPOINTS } from '../constants/api';

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadStoredAuth();
  }, []);

  const loadStoredAuth = async () => {
    try {
      const storedToken = await SecureStore.getItemAsync('token');
      if (storedToken) {
        setToken(storedToken);
        await fetchUserProfile();
      }
    } catch (error) {
      console.error('Error loading auth:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUserProfile = async () => {
    try {
      const userData = await apiService.get<User>(API_ENDPOINTS.GET_PROFILE);
      setUser(userData);
    } catch (error) {
      console.error('Error fetching profile:', error);
      await logout();
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await apiService.post<{ token: string; user: User }>(
        API_ENDPOINTS.LOGIN,
        { email, password }
      );
      
      await SecureStore.setItemAsync('token', response.token);
      setToken(response.token);
      setUser(response.user);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  };

  const signup = async (
    firstName: string,
    lastName: string,
    email: string,
    password: string
  ) => {
    try {
      const name = `${firstName} ${lastName}`;
      const response = await apiService.post<{ token: string; user: User }>(
        API_ENDPOINTS.SIGNUP,
        { name, email, password }
      );
      
      await SecureStore.setItemAsync('token', response.token);
      setToken(response.token);
      setUser(response.user);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Signup failed');
    }
  };

  const logout = async () => {
    try {
      await SecureStore.deleteItemAsync('token');
      setToken(null);
      setUser(null);
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const updateProfile = async (data: Partial<User>) => {
    try {
      const updatedUser = await apiService.put<User>(API_ENDPOINTS.UPDATE_PROFILE, data);
      setUser(updatedUser);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Update failed');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        login,
        signup,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
