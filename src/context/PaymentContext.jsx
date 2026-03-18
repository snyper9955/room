import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import api from "../axios/axios";

const PaymentContext = createContext();

export const PaymentProvider = ({ children }) => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPayments = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/payments");
      setPayments(data);
    } catch (error) {
      console.error("Error fetching payments:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

  const createOrder = async (orderData) => {
    try {
      const response = await api.post("/payments/order", orderData);
      return response.data;
    } catch (error) {
      console.error("Error creating order:", error);
      throw error;
    }
  };

  const verifyPayment = async (verificationData) => {
    try {
      const response = await api.post("/payments/verify", verificationData);
      await fetchPayments();
      return response.data;
    } catch (error) {
      console.error("Error verifying payment:", error);
      throw error;
    }
  };

  return (
    <PaymentContext.Provider
      value={{
        payments,
        loading,
        refreshPayments: fetchPayments,
        createOrder,
        verifyPayment,
      }}
    >
      {children}
    </PaymentContext.Provider>
  );
};

export const usePayment = () => {
  const context = useContext(PaymentContext);
  if (!context) {
    throw new Error("usePayment must be used within a PaymentProvider");
  }
  return context;
};
