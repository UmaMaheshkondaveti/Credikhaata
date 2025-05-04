
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';

const AuthContext = createContext(null);

// Use a prefix for localStorage keys to avoid conflicts
const STORAGE_PREFIX = 'credikhaata_';
const USERS_STORAGE_KEY = `${STORAGE_PREFIX}users`;
const LOGGED_IN_USER_KEY = `${STORAGE_PREFIX}loggedInUser`;

// Helper function to get users from localStorage
const getUsersFromStorage = () => {
    const users = localStorage.getItem(USERS_STORAGE_KEY);
    return users ? JSON.parse(users) : [];
};

// Helper function to save users to localStorage
const saveUsersToStorage = (users) => {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
};

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Start loading true to check localStorage
  const navigate = useNavigate();
  const { toast } = useToast();

  // Check for logged-in user on initial load
  useEffect(() => {
    const loggedInUserData = localStorage.getItem(LOGGED_IN_USER_KEY);
    if (loggedInUserData) {
        try {
          setUser(JSON.parse(loggedInUserData));
        } catch (e) {
           console.error("Failed to parse loggedInUser", e);
           localStorage.removeItem(LOGGED_IN_USER_KEY);
        }
    }
    setLoading(false); // Done checking localStorage
  }, []);

  // Use email as username for simplicity as per requirement
  const login = useCallback((email, password) => {
    setLoading(true);
    const users = getUsersFromStorage();
    // Find user by email and check password (insecure for demo)
    const foundUser = users.find(u => u.email === email && u.password === password);

    if (foundUser) {
      const userData = {
        id: foundUser.id,
        email: foundUser.email,
        name: foundUser.name || foundUser.email.split('@')[0], // Use name or derive from email
      };
      localStorage.setItem(LOGGED_IN_USER_KEY, JSON.stringify(userData));
      setUser(userData);
      toast({
        title: "Login Successful",
        description: `Welcome back, ${userData.name}!`,
      });
      navigate('/dashboard', { replace: true }); // Navigate to dashboard
      setLoading(false);
      return true;
    } else {
      toast({
        variant: "destructive",
        title: "Login Failed",
        description: "Invalid email or password.",
      });
      setLoading(false);
      return false;
    }
  }, [navigate, toast]);


  const signup = useCallback((name, email, password) => {
    setLoading(true);
    const users = getUsersFromStorage();
    const userExists = users.some(u => u.email === email);

    if (userExists) {
      toast({
        variant: "destructive",
        title: "Signup Failed",
        description: "An account with this email already exists.",
      });
      setLoading(false);
      return false;
    } else {
      const newUser = {
        id: `user_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`, // More robust unique ID
        name,
        email,
        password, // Storing plain password - highly insecure, for demo only!
      };
      const updatedUsers = [...users, newUser];
      saveUsersToStorage(updatedUsers);

      toast({
        title: "Signup Successful",
        description: "Your account has been created. Please login.",
      });
      navigate('/login'); // Redirect to login after successful signup
      setLoading(false);
      return true;
    }
  }, [navigate, toast]);

  const logout = useCallback(() => {
     const loggedOutUserName = user?.name || 'User'; // Get name before logging out
    localStorage.removeItem(LOGGED_IN_USER_KEY);
    setUser(null);
    // Note: Data associated with the user in DataContext's localStorage remains.
    // A real backend would handle session termination properly.
    navigate('/login', { replace: true });
    toast({
      title: "Logged Out",
      description: `Goodbye, ${loggedOutUserName}!`,
    });
  }, [navigate, toast, user]); // Added user dependency


  const value = {
    user,
    loading,
    login,
    signup,
    logout,
    isAuthenticated: !!user && !loading, // Ensure not authenticated during loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
  