import React, { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext();

export const useUser = () => useContext(UserContext);

// Predefined users
const PREDEFINED_USERS = {
  'nithinrajulapati@gmail.com': {
    name: 'Nithin',
    email: 'nithinrajulapati@gmail.com',
    password: 'Nani@2002',
    isPro: true,
    profilePhoto: null
  },
  'vlalitha0925@gmail.com': {
    name: 'Lalitha',
    email: 'vlalitha0925@gmail.com',
    password: 'Nani@2001',
    isPro: false,
    profilePhoto: null
  },
  'nithinrajulapati567@gmail.com': {
    name: 'Nithin567',
    email: 'nithinrajulapati567@gmail.com',
    password: 'Nani@2002',
    isPro: true,
    profilePhoto: null
  }
};

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [mood, setMood] = useState(null);

  useEffect(() => {
    // Load user from localStorage on mount
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
      const parsedUser = JSON.parse(userData);
      const moodData = localStorage.getItem(`mood_${parsedUser.email}`);
      if (moodData) {
        setMood(moodData);
      }
    }
  }, []);

  const login = (userData) => {
    // Check if user exists in predefined users
    const predefinedUser = PREDEFINED_USERS[userData.email];
    if (predefinedUser && predefinedUser.password === userData.password) {
      const userToLogin = {
        ...predefinedUser,
        isOnline: true
      };
      setUser(userToLogin);
      localStorage.setItem('user', JSON.stringify(userToLogin));
      // Load mood for this user
      const moodData = localStorage.getItem(`mood_${userToLogin.email}`);
      if (moodData) {
        setMood(moodData);
      } else {
        setMood(null);
      }
    } else {
      throw new Error('Invalid credentials');
    }
  };

  const setMoodForUser = (m) => {
    if (user && user.email) {
      setMood(m);
      localStorage.setItem(`mood_${user.email}`, m);
    }
  };

  const logout = () => {
    setUser(null);
    setMood(null);
    localStorage.removeItem('user');
    // Don't remove all moods, just clear current
  };

  const updateProfilePhoto = (photoUrl) => {
    if (user && user.email) {
      const updatedUser = { ...user, profilePhoto: photoUrl };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
  };

  return (
    <UserContext.Provider value={{ user, login, logout, mood, setMood: setMoodForUser, updateProfilePhoto }}>
      {children}
    </UserContext.Provider>
  );
}; 