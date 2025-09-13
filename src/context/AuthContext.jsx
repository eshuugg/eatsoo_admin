import React, { createContext, useState, useEffect } from "react";
import Cookies from "js-cookie";
import { useDispatch } from "react-redux";
import { userLogout } from "../redux/Slicers/LoginSlicer";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const dispatch = useDispatch(); // Use Redux dispatch

  useEffect(() => {
    const storedToken = Cookies.get("token");
    const storedRole = Cookies.get("role");

    if (storedToken && storedRole) {
      setToken(storedToken);
      setUserRole(storedRole);
      setIsAuthenticated(true);
    }
  }, []);

  // Login function
  const login = (token, role) => {
    Cookies.set("token", token, { expires: 7, secure: true, sameSite: "Strict" });
    Cookies.set("role", role, { expires: 7, secure: true, sameSite: "Strict" });
    setToken(token);
    setUserRole(role);
    setIsAuthenticated(true);
  };

  // Logout function
  const logout = () => {
    Cookies.remove("token");
    Cookies.remove("role");
    setToken(null);
    setUserRole(null);
    setIsAuthenticated(false);
    dispatch(userLogout()); // Dispatch Redux logout action to reset state
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, token, userRole, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
