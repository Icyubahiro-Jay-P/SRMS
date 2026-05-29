import React, { createContext, useState, useCallback } from "react";
import { authService } from "../services/api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const register = useCallback(async (username, email, password) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authService.register(username, email, password);
      setUser(response.data.user);
      localStorage.setItem("token", response.data.token);
      return response.data;
    } catch (err) {
      const message = err.response?.data?.message || "Registration failed";
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  const login = useCallback(async (username, password) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authService.login(username, password);
      setUser(response.data.user);
      localStorage.setItem("token", response.data.token);
      return response.data;
    } catch (err) {
      const message = err.response?.data?.message || "Login failed";
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await authService.logout();
      setUser(null);
      localStorage.removeItem("token");
    } catch (err) {
      console.error("Logout error:", err);
    }
  }, []);

  const getMe = useCallback(async () => {
    try {
      const response = await authService.getMe();
      setUser(response.data.user);
      return response.data.user;
    } catch (err) {
      console.error("Get user error:", err);
      setUser(null);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        register,
        login,
        logout,
        getMe,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
