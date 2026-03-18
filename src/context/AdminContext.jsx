import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import api from "../axios/axios";
import { useAuth } from "./AuthContext";

const AdminContext = createContext();

export const AdminProvider = ({ children }) => {
  const [stats, setStats] = useState({
    totalRooms: 0,
    occupiedRooms: 0,
    availableRooms: 0,
    totalTenants: 0,
    totalBookings: 0,
    totalRevenue: 0,
    monthlyIncome: 0,
    netProfit: 0,
  });
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);

  const { user } = useAuth();

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/admin/stats");
      setStats(data);
    } catch (error) {
      console.error("Error fetching admin stats:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchUsers = useCallback(async () => {
    try {
      const { data } = await api.get("/admin/users");
      if (data.success) {
        setUsers(data.users);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  }, []);

  useEffect(() => {
    if (user && user.email === "chemistryhero1@gmail.com") {
      fetchStats();
      fetchUsers();
    } else {
      setLoading(false);
    }
  }, [fetchStats, fetchUsers, user]);

  const statsData = stats;

  const grantAccess = async (userData) => {
    try {
      const { data } = await api.post("/admin/grant-access", userData);
      await fetchStats();
      return data;
    } catch (error) {
      console.error("Error granting access:", error);
      throw error;
    }
  };

  return (
    <AdminContext.Provider
      value={{
        stats: statsData,
        users,
        loading,
        refreshStats: fetchStats,
        refreshUsers: fetchUsers,
        grantAccess,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error("useAdmin must be used within an AdminProvider");
  }
  return context;
};
