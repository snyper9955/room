import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import api from "../axios/axios";

const BookingContext = createContext();

export const BookingProvider = ({ children }) => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/bookings");
      setBookings(data);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const createBooking = async (bookingData) => {
    try {
      await api.post("/bookings", bookingData);
      await fetchBookings();
    } catch (error) {
      console.error("Error creating booking:", error);
      throw error;
    }
  };

  const updateBooking = async (id, status) => {
    try {
      await api.patch(`/bookings/${id}`, { status });
      await fetchBookings();
    } catch (error) {
      console.error("Error updating booking status:", error);
      throw error;
    }
  };

  const getMyBookings = useCallback(async () => {
    try {
      const response = await api.get("/bookings/my");
      return response.data;
    } catch (error) {
      console.error("Error fetching my bookings:", error);
      throw error;
    }
  }, []);

  return (
    <BookingContext.Provider
      value={{
        bookings,
        loading,
        refreshBookings: fetchBookings,
        createBooking,
        updateBooking,
        getMyBookings,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
};

export const useBooking = () => {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error("useBooking must be used within a BookingProvider");
  }
  return context;
};
