import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import api from "../axios/axios";

const TenantContext = createContext();

export const TenantProvider = ({ children }) => {
  const [tenants, setTenants] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTenants = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/tenants");
      setTenants(data);
    } catch (error) {
      console.error("Error fetching tenants:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTenants();
  }, [fetchTenants]);

  const addTenant = async (tenantData) => {
    try {
      await api.post("/tenants", tenantData);
      await fetchTenants();
    } catch (error) {
      console.error("Error adding tenant:", error);
      throw error;
    }
  };

  const updateTenant = async (id, tenantData) => {
    try {
      await api.patch(`/tenants/${id}`, tenantData);
      await fetchTenants();
    } catch (error) {
      console.error("Error updating tenant:", error);
      throw error;
    }
  };

  return (
    <TenantContext.Provider
      value={{
        tenants,
        loading,
        refreshTenants: fetchTenants,
        addTenant,
        updateTenant,
      }}
    >
      {children}
    </TenantContext.Provider>
  );
};

export const useTenant = () => {
  const context = useContext(TenantContext);
  if (!context) {
    throw new Error("useTenant must be used within a TenantProvider");
  }
  return context;
};
