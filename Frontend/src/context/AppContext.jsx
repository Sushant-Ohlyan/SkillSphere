import { createContext, useEffect, useState } from "react";
import axios from "axios";

export const AppContent = createContext();

export const AppContextProvider = ({ children }) => {
  // ✅ Always send cookies with requests
  axios.defaults.withCredentials = true;

  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ Check user authentication state
  const getAuthState = async () => {
    try {
      const { data } = await axios.post(`${backendUrl}/api/auth/isauth`);
      if (data.success) {
        setIsLoggedIn(true);
        await getUserData();
      } else {
        setIsLoggedIn(false);
        setUserData(null);
      }
    } catch (error) {
      console.error("Auth check failed:", error.message);
      setIsLoggedIn(false);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Fetch user data from backend
  const getUserData = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/user/data`);
      if (data.success) {
        setUserData(data.userData);
      } else {
        console.warn("Failed to fetch user data");
      }
    } catch (error) {
      console.error("User data fetch error:", error.message);
    }
  };

  // ✅ Check auth on mount
  useEffect(() => {
    getAuthState();
  }, []);

  const value = {
    backendUrl,
    isLoggedIn,
    setIsLoggedIn,
    userData,
    setUserData,
    getUserData,
    loading
  };

  return (
    <AppContent.Provider value={value}>
      {children}
    </AppContent.Provider>
  );
};
