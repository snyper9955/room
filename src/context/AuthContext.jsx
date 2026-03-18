import React, { createContext, useState, useEffect, useContext } from "react";
import api from "../axios/axios";

// Create Context
const AuthContext = createContext();

// Create Provider
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user from local storage on first render
  useEffect(() => {
    const fetchUser = async () => {
      const storedUser = localStorage.getItem("user");
      const token = localStorage.getItem("token");

      if (storedUser && token) {
        // Technically we could verify the token with the backend here,
        // but for now relying on local storage.
        const userData = JSON.parse(storedUser);
        console.log("[DEBUG] AuthProvider: Loaded user", userData.email);
        setUser(userData);
      }
      setLoading(false);
    };

    fetchUser();
  }, []);

  // Login Function
  const login = async (email, password) => {
    try {
      const { data } = await api.post("/auth/login", { email, password });

      const userData = {
        _id: data._id,
        name: data.name,
        email: data.email,
        role: data.role,
      };

      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("token", data.token);

      return { success: true };
    } catch (error) {
      console.error(
        "Login Error:",
        error.response?.data?.message || error.message,
      );
      return {
        success: false,
        message:
          error.response?.data?.message || "An error occurred during login.",
      };
    }
  };

  // Register Function
  const register = async (userDataToSubmit) => {
    try {
      const { data } = await api.post("/auth/register", userDataToSubmit);

      const userData = {
        _id: data._id,
        name: data.name,
        email: data.email,
        role: data.role,
      };

      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("token", data.token);

      return { success: true };
    } catch (error) {
      console.error(
        "Registration Error:",
        error.response?.data?.message || error.message,
      );
      return {
        success: false,
        message:
          error.response?.data?.message ||
          "An error occurred during registration.",
      };
    }
  };

  // Logout Function
  const logout = async () => {
    try {
      await api.post("/auth/logout"); // Inform backend if necessary
    } catch (err) {
      console.error("Backend logout error", err);
    }

    // Clear State & Storage regardless of backend success
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  // Forgot Password
  const forgotPassword = async (email) => {
    try {
      await api.post("/auth/forgot-password", { email });
      return { success: true, message: "OTP sent to email." };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to send OTP.",
      };
    }
  };

  // Reset Password
  const resetPassword = async (email, otp, newPassword) => {
    try {
      await api.put("/auth/reset-password", { email, otp, newPassword });
      return {
        success: true,
        message: "Password updated safely. You can now login.",
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to reset password.",
      };
    }
  };

  // Update Profile Function
  const updateProfile = async (profileData) => {
    try {
      const { data } = await api.put("/auth/profile", profileData);

      const userData = {
        _id: data._id,
        name: data.name,
        email: data.email,
        role: data.role,
        phone: data.phone,
        gender: data.gender,
        address: data.address,
        dateOfBirth: data.dateOfBirth,
      };

      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
      if (data.token) {
        localStorage.setItem("token", data.token);
      }

      return { success: true };
    } catch (error) {
      console.error(
        "Update Profile Error:",
        error.response?.data?.message || error.message,
      );
      return {
        success: false,
        message:
          error.response?.data?.message || "An error occurred while updating profile.",
      };
    }
  };

  // Utility to update user role dynamically without relogin
  const updateUserRole = (newRole) => {
    if (user) {
      const updatedUser = { ...user, role: newRole };
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        forgotPassword,
        resetPassword,
        updateUserRole,
        updateProfile,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

// Custom Hook to Easily Access Context
export const useAuth = () => {
  return useContext(AuthContext);
};
