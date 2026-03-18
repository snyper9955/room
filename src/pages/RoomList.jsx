import React, { useState } from "react";
import { useRoom } from "../context/RoomContext";
import { 
  Bed, 
  Plus, 
  Search, 
  MoreVertical, 
  Edit2, 
  Trash2, 
  IndianRupee,
  Filter,
  Grid3x3,
  List,
  Users,
  Wifi,
  Droplets,
  Zap
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";

const RoomList = () => {
  const { rooms, loading, deleteRoom } = useRoom();
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [viewMode, setViewMode] = useState("grid"); // 'grid' or 'list'
  const [selectedRoom, setSelectedRoom] = useState(null);

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-gray-200 dark:border-gray-700 border-t-blue-600 rounded-full animate-spin"></div>
          <p className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">
            Loading rooms...
          </p>
        </div>
      </div>
    );
  }

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'available':
        return {
          bg: 'bg-emerald-50 dark:bg-emerald-500/10',
          text: 'text-emerald-700 dark:text-emerald-400',
          border: 'border-emerald-200 dark:border-emerald-500/20',
          dot: 'bg-emerald-500'
        };
      case 'occupied':
        return {
          bg: 'bg-blue-50 dark:bg-blue-500/10',
          text: 'text-blue-700 dark:text-blue-400',
          border: 'border-blue-200 dark:border-blue-500/20',
          dot: 'bg-blue-500'
        };
      case 'maintenance':
        return {
          bg: 'bg-amber-50 dark:bg-amber-500/10',
          text: 'text-amber-700 dark:text-amber-400',
          border: 'border-amber-200 dark:border-amber-500/20',
          dot: 'bg-amber-500'
        };
      default:
        return {
          bg: 'bg-gray-50 dark:bg-gray-500/10',
          text: 'text-gray-700 dark:text-gray-400',
          border: 'border-gray-200 dark:border-gray-500/20',
          dot: 'bg-gray-500'
        };
    }
  };

  const filteredRooms = rooms.filter(room => {
    const matchesSearch = room.roomNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         room.type?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "All" || room.status?.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const amenities = [
    { icon: Wifi, label: "WiFi" },
    { icon: Droplets, label: "AC" },
    { icon: Zap, label: "Power Backup" }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Room Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your inventory and track room availability
          </p>
        </div>
        
        {isAdmin && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
          >
            <Plus size={20} />
            Add New Room
          </motion.button>
        )}
      </div>

      {/* Filters & Search Bar */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 mb-8">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search by room number or type..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
          </div>

          {/* Filter Dropdown */}
          <div className="flex gap-3">
            <div className="relative min-w-[160px]">
              <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all appearance-none cursor-pointer"
              >
                <option value="All">All Status</option>
                <option value="Available">Available</option>
                <option value="Occupied">Occupied</option>
                <option value="Maintenance">Maintenance</option>
              </select>
            </div>

            {/* View Toggle */}
            <div className="flex bg-gray-100 dark:bg-gray-900 rounded-xl p-1">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-lg transition-all ${
                  viewMode === "grid"
                    ? "bg-white dark:bg-gray-800 shadow-sm text-blue-600"
                    : "text-gray-500 hover:text-gray-700 dark:text-gray-400"
                }`}
              >
                <Grid3x3 size={20} />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-lg transition-all ${
                  viewMode === "list"
                    ? "bg-white dark:bg-gray-800 shadow-sm text-blue-600"
                    : "text-gray-500 hover:text-gray-700 dark:text-gray-400"
                }`}
              >
                <List size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Active Filters */}
        {(searchTerm || statusFilter !== "All") && (
          <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
            <span className="text-sm text-gray-500 dark:text-gray-400">Active filters:</span>
            {searchTerm && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 rounded-full text-sm">
                Search: {searchTerm}
                <button onClick={() => setSearchTerm("")} className="hover:text-blue-900 dark:hover:text-blue-300">×</button>
              </span>
            )}
            {statusFilter !== "All" && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 rounded-full text-sm">
                Status: {statusFilter}
                <button onClick={() => setStatusFilter("All")} className="hover:text-blue-900 dark:hover:text-blue-300">×</button>
              </span>
            )}
          </div>
        )}
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total Rooms", value: rooms.length, color: "blue" },
          { label: "Available", value: rooms.filter(r => r.status?.toLowerCase() === 'available').length, color: "emerald" },
          { label: "Occupied", value: rooms.filter(r => r.status?.toLowerCase() === 'occupied').length, color: "purple" },
          { label: "Maintenance", value: rooms.filter(r => r.status?.toLowerCase() === 'maintenance').length, color: "amber" }
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700"
          >
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{stat.label}</p>
            <p className={`text-2xl font-bold text-${stat.color}-600 dark:text-${stat.color}-400`}>
              {stat.value}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Room Grid/List View */}
      <AnimatePresence mode="wait">
        {filteredRooms.length > 0 ? (
          <motion.div
            key={viewMode}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={viewMode === "grid" 
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              : "space-y-4"
            }
          >
            {filteredRooms.map((room, index) => {
              const statusStyle = getStatusColor(room.status);
              
              if (viewMode === "list") {
                return (
                  <motion.div
                    key={room._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300"
                  >
                    <div className="p-4 flex items-center gap-6">
                      <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 border border-gray-200 dark:border-gray-700">
                        <img 
                          src={room.images?.[0] || "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?ixlib=rb-4.0.3&auto=format&fit=crop&w=1171&q=80"} 
                          alt={room.roomNumber}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      
                      <div className="flex-1 grid grid-cols-5 gap-4 items-center">
                        <div>
                          <h3 className="font-semibold text-gray-900 dark:text-white">
                            Room {room.roomNumber}
                          </h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{room.type || "Standard"}</p>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Users size={16} className="text-gray-400" />
                          <span className="text-sm text-gray-600 dark:text-gray-300">{room.bedCount} Bed(s)</span>
                        </div>
                        
                        <div>
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${statusStyle.bg} ${statusStyle.text}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${statusStyle.dot}`}></span>
                            {room.status}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-1">
                          <IndianRupee size={16} className="text-gray-400" />
                          <span className="font-bold text-gray-900 dark:text-white">{room.price}</span>
                          <span className="text-xs text-gray-500">/mo</span>
                        </div>
                        
                        <div className="flex items-center justify-end gap-2">
                          {isAdmin && (
                            <>
                              <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-gray-500 hover:text-blue-600 transition-colors">
                                <Edit2 size={18} />
                              </button>
                              <button 
                                onClick={() => deleteRoom(room._id)}
                                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-gray-500 hover:text-rose-600 transition-colors"
                              >
                                <Trash2 size={18} />
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              }

              // Grid View
              return (
                <motion.div
                  key={room._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ y: -4 }}
                  className="group bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 hover:shadow-xl transition-all duration-300 overflow-hidden"
                >
                  {/* Room Image/Header */}
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={room.images?.[0] || "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?ixlib=rb-4.0.3&auto=format&fit=crop&w=1171&q=80"}
                      alt={`Room ${room.roomNumber}`}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute top-3 right-3">
                      <button className="p-2 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-lg shadow-lg hover:bg-white dark:hover:bg-gray-800 transition-colors text-gray-600 dark:text-gray-300">
                        <MoreVertical size={16} />
                      </button>
                    </div>
                    <div className="absolute bottom-3 left-3">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm ${statusStyle.bg} ${statusStyle.text} border ${statusStyle.border}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${statusStyle.dot}`}></span>
                        {room.status}
                      </span>
                    </div>
                  </div>

                  {/* Room Details */}
                  <div className="p-5">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          Room {room.roomNumber}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{room.type || "Standard Room"}</p>
                      </div>
                    </div>

                    {/* Amenities Preview */}
                    <div className="flex gap-3 mb-4">
                      {amenities.map((amenity, i) => (
                        <div key={i} className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                          <amenity.icon size={14} />
                          <span>{amenity.label}</span>
                        </div>
                      ))}
                    </div>

                    {/* Room Specs */}
                    <div className="flex items-center gap-4 mb-4 text-sm">
                      <div className="flex items-center gap-1 text-gray-600 dark:text-gray-300">
                        <Users size={16} className="text-gray-400" />
                        <span>{room.bedCount} {room.bedCount === 1 ? 'Bed' : 'Beds'}</span>
                      </div>
                      <div className="flex items-center gap-1 text-gray-600 dark:text-gray-300">
                        <span className="w-1.5 h-1.5 rounded-full bg-gray-300"></span>
                        <span>{room.area || "250 sq.ft"}</span>
                      </div>
                    </div>

                    {/* Price and Actions */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                      <div className="flex items-baseline gap-1">
                        <IndianRupee size={18} className="text-gray-400" />
                        <span className="text-2xl font-bold text-gray-900 dark:text-white">
                          {room.price}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">/month</span>
                      </div>
                      
                      {isAdmin && (
                        <div className="flex gap-2">
                          <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-gray-500 hover:text-blue-600 transition-colors">
                            <Edit2 size={18} />
                          </button>
                          <button 
                            onClick={() => deleteRoom(room._id)}
                            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-gray-500 hover:text-rose-600 transition-colors"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-16 px-4"
          >
            <div className="relative mb-8">
              <div className="absolute inset-0 bg-blue-500/20 blur-3xl rounded-full"></div>
              <div className="relative w-28 h-28 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl flex items-center justify-center shadow-2xl">
                <Bed size={48} className="text-white" />
              </div>
            </div>
            
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
              {searchTerm || statusFilter !== "All" ? "No Matching Rooms" : "No Rooms Found"}
            </h3>
            
            <p className="text-gray-600 dark:text-gray-400 text-center max-w-md mb-8">
              {searchTerm || statusFilter !== "All" 
                ? "Try adjusting your search filters to find what you're looking for."
                : "Your room inventory is empty. Start by adding your first room."}
            </p>

            {(searchTerm || statusFilter !== "All") ? (
              <button
                onClick={() => {
                  setSearchTerm("");
                  setStatusFilter("All");
                }}
                className="px-6 py-3 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-medium transition-colors"
              >
                Clear Filters
              </button>
            ) : isAdmin ? (
              <button className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200">
                <Plus size={20} />
                Add Your First Room
              </button>
            ) : null}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Results Count */}
      {filteredRooms.length > 0 && (
        <div className="mt-6 text-sm text-gray-500 dark:text-gray-400 text-center">
          Showing {filteredRooms.length} of {rooms.length} rooms
        </div>
      )}
    </div>
  );
};

export default RoomList;