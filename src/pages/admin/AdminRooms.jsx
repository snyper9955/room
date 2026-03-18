import React, { useState } from "react";
import { useRoom } from "../../context/RoomContext";
import { useAdmin } from "../../context/AdminContext";
import RoomForm from "../../components/RoomForm";
import { 
  Plus, 
  Edit2, 
  Trash2, 
  Bed, 
  Search, 
  Filter, 
  UserPlus, 
  X,
  MoreVertical,
  ChevronDown,
  ChevronUp,
  Grid3x3,
  List,
  IndianRupee,
  Home,
  Users
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const AdminRooms = () => {
  const { rooms, loading, addRoom, updateRoom, deleteRoom } = useRoom();
  const { grantAccess } = useAdmin();
  const [showForm, setShowForm] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showGrantModal, setShowGrantModal] = useState(false);
  const [grantData, setGrantData] = useState({ roomId: "", roomNumber: "", name: "", email: "", phone: "", amount: "" });
  const [grantLoading, setGrantLoading] = useState(false);
  const [viewMode, setViewMode] = useState("grid"); // 'grid' or 'list'
  const [statusFilter, setStatusFilter] = useState("all");
  const [expandedRoom, setExpandedRoom] = useState(null);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const handleAdd = async (formData) => {
    try {
      await addRoom(formData);
      setShowForm(false);
    } catch (error) {
      alert("Failed to add room");
    }
  };

  const handleEdit = async (formData) => {
    try {
      await updateRoom(editingRoom._id, formData);
      setEditingRoom(null);
      setShowForm(false);
    } catch (error) {
      alert("Failed to update room");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this room?")) {
      try {
        await deleteRoom(id);
      } catch (error) {
        alert("Failed to delete room");
      }
    }
  };

  const handleGrantAccess = async (e) => {
    e.preventDefault();
    try {
      setGrantLoading(true);
      await grantAccess(grantData);
      alert("Access granted successfully!");
      setShowGrantModal(false);
      setGrantData({ roomId: "", roomNumber: "", name: "", email: "", phone: "", amount: "" });
    } catch (error) {
      alert(error.response?.data?.message || "Failed to grant access");
    } finally {
      setGrantLoading(false);
    }
  };

  const filteredRooms = rooms.filter((room) => {
    const matchesSearch = room.roomNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         room.type?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || room.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: rooms.length,
    available: rooms.filter(r => r.status === "available").length,
    occupied: rooms.filter(r => r.status === "occupied").length
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-8">
      {/* Mobile Header */}
      <div className="lg:hidden sticky top-0 z-30 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">Room Management</h1>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{rooms.length} Total Rooms</p>
          </div>
          <button
            onClick={() => {
              setEditingRoom(null);
              setShowForm(true);
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 text-sm shadow-lg"
          >
            <Plus size={18} />
            Add
          </button>
        </div>
      </div>

      {/* Desktop Header */}
      <div className="hidden lg:block max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Room Management</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">Add, edit, or remove rooms from your lodge</p>
          </div>
          <button
            onClick={() => {
              setEditingRoom(null);
              setShowForm(true);
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2 transition-all shadow-lg"
          >
            <Plus size={20} />
            Add New Room
          </button>
        </div>
      </div>

      {/* Stats Cards - Mobile */}
      <div className="lg:hidden grid grid-cols-3 gap-2 px-4 mt-4">
        <div className="bg-white dark:bg-gray-800 p-3 rounded-xl border border-gray-200 dark:border-gray-700">
          <p className="text-xs text-gray-500 dark:text-gray-400">Total</p>
          <p className="text-lg font-bold text-gray-900 dark:text-white">{stats.total}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-3 rounded-xl border border-gray-200 dark:border-gray-700">
          <p className="text-xs text-gray-500 dark:text-gray-400">Available</p>
          <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">{stats.available}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-3 rounded-xl border border-gray-200 dark:border-gray-700">
          <p className="text-xs text-gray-500 dark:text-gray-400">Occupied</p>
          <p className="text-lg font-bold text-blue-600 dark:text-blue-400">{stats.occupied}</p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4 lg:mt-0">
        <div className="bg-white dark:bg-gray-800 rounded-xl lg:rounded-2xl border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex flex-col lg:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search by room number or type..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
              />
            </div>
            
            <div className="flex gap-2">
              {/* Mobile Filter Toggle */}
              <button 
                onClick={() => setShowMobileFilters(!showMobileFilters)}
                className="lg:hidden flex-1 px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-600 dark:text-gray-400 flex items-center justify-center gap-2"
              >
                <Filter size={18} />
                Filters
                {showMobileFilters ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>

              {/* Desktop Filters */}
              <div className="hidden lg:flex gap-2">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
                >
                  <option value="all">All Status</option>
                  <option value="available">Available</option>
                  <option value="occupied">Occupied</option>
                </select>

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
          </div>

          {/* Mobile Filters Dropdown */}
          <AnimatePresence>
            {showMobileFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="lg:hidden mt-3 pt-3 border-t border-gray-200 dark:border-gray-700"
              >
                <div className="space-y-3">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
                  >
                    <option value="all">All Status</option>
                    <option value="available">Available</option>
                    <option value="occupied">Occupied</option>
                  </select>

                  <div className="flex gap-2">
                    <button
                      onClick={() => setViewMode("grid")}
                      className={`flex-1 py-3 rounded-xl border ${
                        viewMode === "grid"
                          ? "bg-blue-600 text-white border-blue-600"
                          : "bg-gray-50 dark:bg-gray-900 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700"
                      }`}
                    >
                      Grid View
                    </button>
                    <button
                      onClick={() => setViewMode("list")}
                      className={`flex-1 py-3 rounded-xl border ${
                        viewMode === "list"
                          ? "bg-blue-600 text-white border-blue-600"
                          : "bg-gray-50 dark:bg-gray-900 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700"
                      }`}
                    >
                      List View
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Room Grid/List */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="relative">
              <div className="w-12 h-12 border-4 border-gray-200 dark:border-gray-700 border-t-blue-600 rounded-full animate-spin"></div>
              <p className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">
                Loading rooms...
              </p>
            </div>
          </div>
        ) : filteredRooms.length > 0 ? (
          <AnimatePresence mode="wait">
            <motion.div
              key={viewMode}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={viewMode === "grid" 
                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6"
                : "space-y-3"
              }
            >
              {filteredRooms.map((room) => {
                if (viewMode === "list") {
                  return (
                    <motion.div
                      key={room._id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden"
                    >
                      <div className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg ${
                              room.status === "available" 
                                ? "bg-emerald-50 dark:bg-emerald-500/10" 
                                : "bg-blue-50 dark:bg-blue-500/10"
                            }`}>
                              <Bed className={`w-5 h-5 ${
                                room.status === "available"
                                  ? "text-emerald-600 dark:text-emerald-400"
                                  : "text-blue-600 dark:text-blue-400"
                              }`} />
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-900 dark:text-white">
                                Room {room.roomNumber}
                              </h3>
                              <p className="text-xs text-gray-500 dark:text-gray-400">{room.type}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              room.status === "available"
                                ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400"
                                : "bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400"
                            }`}>
                              {room.status}
                            </span>
                            <button
                              onClick={() => setExpandedRoom(expandedRoom === room._id ? null : room._id)}
                              className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg lg:hidden"
                            >
                              <ChevronDown size={18} className={`transform transition-transform ${expandedRoom === room._id ? 'rotate-180' : ''}`} />
                            </button>
                          </div>
                        </div>

                        {/* Mobile Expandable Details */}
                        <AnimatePresence>
                          {expandedRoom === room._id && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700"
                            >
                              <div className="space-y-3">
                                <div className="flex items-center justify-between text-sm">
                                  <span className="text-gray-500 dark:text-gray-400">Price</span>
                                  <span className="font-semibold text-gray-900 dark:text-white">₹{room.price}/mo</span>
                                </div>
                                {room.amenities && room.amenities.length > 0 && (
                                  <div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Amenities</p>
                                    <div className="flex flex-wrap gap-2">
                                      {room.amenities.map((amenity, idx) => (
                                        <span key={idx} className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-lg text-xs">
                                          {amenity}
                                        </span>
                                      ))}
                                    </div>
                                  </div>
                                )}
                                <div className="flex gap-2 pt-2">
                                  <button
                                    onClick={() => {
                                      setEditingRoom(room);
                                      setShowForm(true);
                                    }}
                                    className="flex-1 py-2.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-medium flex items-center justify-center gap-2 text-sm"
                                  >
                                    <Edit2 size={16} />
                                    Edit
                                  </button>
                                  {room.status === "available" && (
                                    <button
                                      onClick={() => {
                                        setGrantData({ ...grantData, roomId: room._id, roomNumber: room.roomNumber, amount: room.price });
                                        setShowGrantModal(true);
                                      }}
                                      className="flex-1 py-2.5 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg font-medium flex items-center justify-center gap-2 text-sm"
                                    >
                                      <UserPlus size={16} />
                                      Grant
                                    </button>
                                  )}
                                  <button
                                    onClick={() => handleDelete(room._id)}
                                    className="p-2.5 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 hover:text-rose-600 dark:hover:text-rose-400 rounded-lg"
                                  >
                                    <Trash2 size={16} />
                                  </button>
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>

                        {/* Desktop List View Actions */}
                        <div className="hidden lg:flex items-center justify-between mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                          <div className="flex items-center gap-4">
                            <span className="text-sm font-semibold text-gray-900 dark:text-white">₹{room.price}/mo</span>
                            {room.amenities && room.amenities.slice(0, 2).map((amenity, idx) => (
                              <span key={idx} className="text-xs text-gray-500 dark:text-gray-400">{amenity}</span>
                            ))}
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => {
                                setEditingRoom(room);
                                setShowForm(true);
                              }}
                              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-gray-600 dark:text-gray-400 hover:text-blue-600 transition-colors"
                            >
                              <Edit2 size={18} />
                            </button>
                            {room.status === "available" && (
                              <button
                                onClick={() => {
                                  setGrantData({ ...grantData, roomId: room._id, roomNumber: room.roomNumber, amount: room.price });
                                  setShowGrantModal(true);
                                }}
                                className="p-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg text-blue-600 dark:text-blue-400"
                              >
                                <UserPlus size={18} />
                              </button>
                            )}
                            <button
                              onClick={() => handleDelete(room._id)}
                              className="p-2 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-lg text-rose-600 dark:text-rose-400"
                            >
                              <Trash2 size={18} />
                            </button>
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
                    whileHover={{ y: -4 }}
                    className="group bg-white dark:bg-gray-800 rounded-xl lg:rounded-2xl border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 hover:shadow-lg transition-all overflow-hidden"
                  >
                    <div className="relative h-40 sm:h-44 lg:h-48 overflow-hidden">
                      <img
                        src={room.images?.[0] || "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?ixlib=rb-4.0.3&auto=format&fit=crop&w=1171&q=80"}
                        alt={`Room ${room.roomNumber}`}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute top-3 right-3 flex gap-2">
                        <button
                          onClick={() => {
                            setEditingRoom(room);
                            setShowForm(true);
                          }}
                          className="p-2 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-lg shadow-lg hover:bg-white dark:hover:bg-gray-800 transition-colors"
                        >
                          <Edit2 size={16} className="text-gray-700 dark:text-gray-300" />
                        </button>
                        <button
                          onClick={() => handleDelete(room._id)}
                          className="p-2 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-lg shadow-lg hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-colors"
                        >
                          <Trash2 size={16} className="text-rose-600 dark:text-rose-400" />
                        </button>
                      </div>
                      <div className="absolute bottom-3 left-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium backdrop-blur-sm ${
                          room.status === "available"
                            ? "bg-emerald-500/90 text-white"
                            : "bg-blue-500/90 text-white"
                        }`}>
                          {room.status}
                        </span>
                      </div>
                    </div>

                    <div className="p-4 sm:p-5">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
                            Room {room.roomNumber}
                          </h3>
                          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">{room.type}</p>
                        </div>
                        <p className="text-lg sm:text-xl font-bold text-blue-600 dark:text-blue-400">
                          ₹{room.price}
                          <span className="text-xs text-gray-500 dark:text-gray-400">/mo</span>
                        </p>
                      </div>

                      {room.amenities && room.amenities.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {room.amenities.slice(0, 3).map((amenity, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-lg text-xs"
                            >
                              {amenity}
                            </span>
                          ))}
                        </div>
                      )}

                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setEditingRoom(room);
                            setShowForm(true);
                          }}
                          className="flex-1 py-2.5 sm:py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-medium flex items-center justify-center gap-2 text-sm hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                        >
                          <Edit2 size={16} />
                          Edit
                        </button>
                        {room.status === "available" && (
                          <button
                            onClick={() => {
                              setGrantData({ ...grantData, roomId: room._id, roomNumber: room.roomNumber, amount: room.price });
                              setShowGrantModal(true);
                            }}
                            className="flex-1 py-2.5 sm:py-3 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg font-medium flex items-center justify-center gap-2 text-sm hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
                          >
                            <UserPlus size={16} />
                            Grant
                          </button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </AnimatePresence>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-16 px-4 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700"
          >
            <div className="w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-2xl flex items-center justify-center mb-6">
              <Bed size={40} className="text-gray-400" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              {searchTerm ? "No results found" : "No rooms added yet"}
            </h2>
            <p className="text-gray-500 dark:text-gray-400 text-center max-w-sm mb-6">
              {searchTerm
                ? `We couldn't find any rooms matching "${searchTerm}"`
                : "Start by adding your first room to manage your lodge effectively."}
            </p>
            {!searchTerm && (
              <button
                onClick={() => {
                  setEditingRoom(null);
                  setShowForm(true);
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium flex items-center gap-2 transition-all"
              >
                <Plus size={20} />
                Add Your First Room
              </button>
            )}
          </motion.div>
        )}
      </div>

      {/* Room Form Modal */}
      <AnimatePresence>
        {showForm && (
          <RoomForm
            onSubmit={editingRoom ? handleEdit : handleAdd}
            initialData={editingRoom}
            onClose={() => {
              setShowForm(false);
              setEditingRoom(null);
            }}
          />
        )}
      </AnimatePresence>

      {/* Grant Access Modal - Mobile Optimized */}
      <AnimatePresence>
        {showGrantModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end lg:items-center justify-center bg-black/60 backdrop-blur-sm"
            onClick={() => setShowGrantModal(false)}
          >
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="w-full lg:max-w-md bg-white dark:bg-gray-800 rounded-t-2xl lg:rounded-2xl overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-4 lg:p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                <div>
                  <h3 className="text-lg lg:text-xl font-bold text-gray-900 dark:text-white">Grant Room Access</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Room #{grantData.roomNumber}</p>
                </div>
                <button 
                  onClick={() => setShowGrantModal(false)} 
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <X size={20} className="text-gray-500 dark:text-gray-400" />
                </button>
              </div>
              
              <form onSubmit={handleGrantAccess} className="p-4 lg:p-6 space-y-4">
                <div>
                  <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Full Name</label>
                  <input 
                    type="text" 
                    required 
                    value={grantData.name}
                    onChange={(e) => setGrantData({ ...grantData, name: e.target.value })}
                    placeholder="Enter tenant name"
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Email Address</label>
                  <input 
                    type="email" 
                    required 
                    value={grantData.email}
                    onChange={(e) => setGrantData({ ...grantData, email: e.target.value })}
                    placeholder="tenant@example.com"
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Phone Number</label>
                  <input 
                    type="tel" 
                    required 
                    value={grantData.phone}
                    onChange={(e) => setGrantData({ ...grantData, phone: e.target.value })}
                    placeholder="Enter phone number"
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
                  />
                </div>

                <div className="pt-4">
                  <button 
                    type="submit" 
                    disabled={grantLoading}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 text-sm lg:text-base"
                  >
                    {grantLoading ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <UserPlus size={18} />
                        Grant Access
                      </>
                    )}
                  </button>
                  <p className="text-center text-gray-500 dark:text-gray-400 text-xs mt-4">
                    * This will mark the room as occupied for 30 days
                  </p>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminRooms;