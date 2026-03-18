import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import api from "../axios/axios";

const RoomContext = createContext();

export const RoomProvider = ({ children }) => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRooms = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/rooms");
      setRooms(data);
    } catch (error) {
      console.error("Error fetching rooms:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRooms();
  }, [fetchRooms]);

  const addRoom = async (roomData) => {
    try {
      const response = await api.post("/rooms", roomData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      await fetchRooms();
      return response.data;
    } catch (error) {
      console.error("Error adding room:", error);
      throw error;
    }
  };

  const updateRoom = async (id, roomData) => {
    try {
      await api.patch(`/rooms/${id}`, roomData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      await fetchRooms();
    } catch (error) {
      console.error("Error updating room:", error);
      throw error;
    }
  };

  const deleteRoom = async (id) => {
    try {
      await api.delete(`/rooms/${id}`);
      await fetchRooms();
    } catch (error) {
      console.error("Error deleting room:", error);
      throw error;
    }
  };

  return (
    <RoomContext.Provider
      value={{
        rooms,
        loading,
        refreshRooms: fetchRooms,
        addRoom,
        updateRoom,
        deleteRoom,
        getRoomById: (id) => api.get(`/rooms/${id}`).then(res => res.data),
      }}
    >
      {children}
    </RoomContext.Provider>
  );
};

export const useRoom = () => {
  const context = useContext(RoomContext);
  if (!context) {
    throw new Error("useRoom must be used within a RoomProvider");
  }
  return context;
};
