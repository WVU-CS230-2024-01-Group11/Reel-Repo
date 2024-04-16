import { createContext, useContext, useState, useEffect } from 'react';

const UsernameContext = createContext({});

export const UsernameProvider = ({ children }) => {
  const [username, setUsername] = useState(() => {
    // Retrieve stored username from local storage
    const savedUsername = localStorage.getItem('username');
    return savedUsername || '';
  });

  useEffect(() => {
    // Save username to local storage whenever it changes
    localStorage.setItem('username', username);
  }, [username]);

  return (
    <UsernameContext.Provider value={{ username, setUsername }}>
      {children}
    </UsernameContext.Provider>
  );
};

export const useUsername = () => useContext(UsernameContext);
