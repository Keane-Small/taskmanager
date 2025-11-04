import React, { createContext, useContext, useState } from 'react';

const NavContext = createContext();

export const useNav = () => {
  const context = useContext(NavContext);
  if (!context) {
    throw new Error('useNav must be used within NavProvider');
  }
  return context;
};

export const NavProvider = ({ children }) => {
  const [activeNavItemId, setActiveNavItemId] = useState('home');

  return (
    <NavContext.Provider value={{ activeNavItemId, setActiveNavItemId }}>
      {children}
    </NavContext.Provider>
  );
};
