import { createContext, useState, useEffect } from "react";
import { toast } from "react-toastify";
import axios from "axios"; // Ensure axios is imported

export const AppContent = createContext();

export const AppContextProvider = (props) => {

  axios.defaults.withCredentials = true; // This ensures cookies are sent with the request
  
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [isLoggedin, setIsLoggedin] = useState(false);
  const [userData, setUserData] = useState(null); // Correct initial state

  const getAuthState = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/auth/isAuth`, {
      });
  
      if (data.success) {
        setIsLoggedin(true);
        getUserData();
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const getUserData = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/user/data`);
      if (data.success) {
        setUserData(data.userData);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "An error occurred");
    }
  };

  useEffect(() => {
    getAuthState();
  }, []);

  const value = {
    backendUrl,
    isLoggedin,
    setIsLoggedin,
    userData,
    setUserData,
    getUserData,
  };

  return (
    <AppContent.Provider value={value}>
      {props.children}
    </AppContent.Provider>
  );
};
