import { useEffect } from "react";
import useStore from "../store/useStore";

export const useAuth = () => {
  const { user, token, isAuthenticated, login, logout, loadUser } = useStore();

  useEffect(() => {
    // Load user from localStorage on mount
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    if (storedToken && storedUser) {
      loadUser(JSON.parse(storedUser));
    }
  }, []);

  return {
    user,
    token,
    isAuthenticated,
    login,
    logout,
    loadUser,
  };
};
