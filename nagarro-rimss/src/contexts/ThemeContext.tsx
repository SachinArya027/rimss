import React, { createContext, useState, useEffect, useContext } from 'react';
import { useColorMode } from '@chakra-ui/react';
import type { ReactNode } from 'react';

// Create the context
const ThemeContext = createContext<{
  isDarkMode: boolean;
  toggleTheme: () => void;
}>({
  isDarkMode: false,
  toggleTheme: () => {},
});

// Custom hook to use the theme context
export const useTheme = () => useContext(ThemeContext);

// Theme provider component
export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { colorMode, toggleColorMode } = useColorMode();
  const [isDarkMode, setIsDarkMode] = useState(colorMode === 'dark');

  // Update isDarkMode when colorMode changes
  useEffect(() => {
    setIsDarkMode(colorMode === 'dark');
  }, [colorMode]);

  // Toggle theme function
  const toggleTheme = () => {
    toggleColorMode();
  };

  // Provide the theme context
  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeContext;
