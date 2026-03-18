import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAdmin } from '../../context/AdminContext';
import API from '../../axios/axios';
import { 
  Users, 
  Home, 
  IndianRupee, 
  Clock, 
  TrendingUp, 
  AlertTriangle,
  ArrowRight,
  ChevronRight,
  Activity,
  Pencil,
  Settings,
  RefreshCw,
  Phone,
  Mail,
  Calendar,
  Menu,
  UserCheck,
  UserPlus2,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedOccupant, setSelectedOccupant] = useState(null);
  const { users, refreshUsers, grantAccess } = useAdmin();
  const [showRoomSelect, setShowRoomSelect] = useState(false);
  const [targetUser, setTargetUser] = useState(null);
  const [availableRooms, setAvailableRooms] = useState([]);
  const [selectedRoomId, setSelectedRoomId] = useState("");
  const [grantLoading, setGrantLoading] = useState(false);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const [{ data: statsData }, { data: roomsData }] = await Promise.all([
        API.get('/admin/stats'),
        API.get('/rooms')
      ]);
      setStats(statsData);
      setAvailableRooms(roomsData.filter(r => r.status === 'available'));
      setError(null);
      refreshUsers();
    } catch (err) {
      setError('Failed to load dashboard statistics');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-gray-200 dark:border-gray-700 border-t-blue-600 rounded-full animate-spin"></div>
        <p className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">
          Loading dashboard...
        </p>
      </div>
    </div>
  );

  if (error) return (
    <div className="p-4 sm:p-6 bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 rounded-xl sm:rounded-2xl text-rose-600 dark:text-rose-400 mx-4 sm:mx-6">
      <div className="flex items-center gap-3">
        <AlertTriangle size={20} />
        <p>{error}</p>
      </div>
    </div>
  );

  const statCards = [
    { title: 'Total Revenue', value: `₹${stats?.revenue?.toLocaleString() || 0}`, icon: IndianRupee, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-500/10' },
    { title: 'Total Rooms', value: stats?.rooms?.total || 0, icon: Home, color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-500/10' },
    { title: 'Currently Occupied', value: stats?.rooms?.occupied || 0, icon: Users, color: 'text-indigo-600 dark:text-indigo-400', bg: 'bg-indigo-50 dark:bg-indigo-500/10' },
    { title: 'Available Now', value: stats?.rooms?.available || 0, icon: Activity, color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-500/10' },
  ];

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const handleGrantAccess = async (e) => {
    e.preventDefault();
    if (!selectedRoomId) return alert("Please select a room");
    
    const selectedRoom = availableRooms.find(r => r._id === selectedRoomId);
    
    try {
      setGrantLoading(true);
      await grantAccess({
        name: targetUser.name,
        email: targetUser.email,
        phone: targetUser.phone,
        roomId: selectedRoomId,
        amount: selectedRoom.price
      });
      alert(`Access granted for ${targetUser.name} in Room ${selectedRoom.roomNumber}`);
      setShowRoomSelect(false);
      fetchStats();
    } catch (err) {
      alert("Failed to grant access");
    } finally {
      setGrantLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-8">


      {/* Desktop Header */}
      <div className="hidden lg:flex lg:justify-between lg:items-end lg:mb-8 lg:px-6 lg:pt-6">
        <div>
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white">
            Admin Overview
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Real-time statistics and property insights.</p>
        </div>
        <button 
          onClick={fetchStats}
          className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors flex items-center gap-1"
        >
          <RefreshCw size={14} /> Refresh Data
        </button>
      </div>

      {/* Main Content */}
      <div className="px-4 sm:px-6 lg:px-6">
        {/* Stats Grid - Mobile optimized */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mt-4 lg:mt-0">
          {statCards.map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all relative overflow-hidden group"
            >
              <div className={`absolute -right-4 -bottom-4 w-20 h-20 sm:w-24 sm:h-24 ${stat.bg} rounded-full blur-2xl group-hover:scale-150 transition-transform opacity-50`}></div>
              <div className={`w-10 h-10 sm:w-12 sm:h-12 ${stat.bg} rounded-xl flex items-center justify-center mb-3 sm:mb-4 relative z-10`}>
                <stat.icon className={`${stat.color} w-5 h-5 sm:w-6 sm:h-6`} />
              </div>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 font-medium relative z-10">{stat.title}</p>
              <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mt-1 relative z-10">{stat.value}</p>
            </motion.div>
          ))}
        </div>

        {/* Main Grid - Mobile optimized */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 mt-6 lg:mt-8">
          {/* Occupancy Details - Full width on mobile */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <Users size={18} className="text-blue-600 dark:text-blue-400" />
                  Current Occupancy
                </h3>
                <div className="flex items-center gap-3">
                  <span className="text-xs px-2 py-1 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-lg font-medium">
                    {stats?.occupancy?.length || 0} Active
                  </span>
                  <span className="text-xs px-2 py-1 bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400 rounded-lg font-medium">
                    Live
                  </span>
                </div>
              </div>

              {/* Mobile Card View for Occupancy */}
              <div className="block lg:hidden divide-y divide-gray-200 dark:divide-gray-700">
                {stats?.occupancy?.length > 0 ? (
                  stats.occupancy.map((occ, idx) => (
                    <div key={idx} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <Link 
                            to={`/admin/renter/${occ.tenantId}`} 
                            className="font-semibold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400"
                          >
                            {occ.tenantName}
                          </Link>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs px-2 py-0.5 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-full">
                              Active
                            </span>
                            {occ.paymentStatus === "pending" && (
                              <span className="text-xs px-2 py-0.5 bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 rounded-full">
                                Payment Pending
                              </span>
                            )}
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              Room {occ.roomNumber}
                            </span>
                          </div>
                        </div>
                        <Link 
                          to={`/admin/renter/${occ.tenantId}?edit=true`}
                          className="p-2 bg-gray-100 dark:bg-gray-700 hover:bg-blue-50 dark:hover:bg-blue-900/20 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 rounded-lg transition-colors"
                        >
                          <Pencil size={16} />
                        </Link>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3 mt-3 text-sm">
                        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                          <Phone size={14} className="text-gray-400" />
                          <span className="text-xs">{occ.phone || 'N/A'}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                          <Mail size={14} className="text-gray-400" />
                          <span className="text-xs truncate">{occ.email}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 col-span-2">
                          <Calendar size={14} className="text-gray-400" />
                          <span className="text-xs">Until {formatDate(occ.expiryDate)}</span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center">
                    <Users size={40} className="mx-auto text-gray-300 dark:text-gray-600 mb-3" />
                    <p className="text-gray-500 dark:text-gray-400 text-sm">No rooms currently occupied.</p>
                  </div>
                )}
              </div>

              {/* Desktop Table View */}
              <div className="hidden lg:block overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-gray-50 dark:bg-gray-900/50">
                    <tr className="text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider">
                      <th className="px-6 py-4 font-semibold">Tenant</th>
                      <th className="px-6 py-4 font-semibold">Room</th>
                      <th className="px-6 py-4 font-semibold">Phone</th>
                      <th className="px-6 py-4 font-semibold">Stays Until</th>
                      <th className="px-6 py-4 font-semibold">Status</th>
                      <th className="px-6 py-4 font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {stats?.occupancy?.map((occ, idx) => (
                      <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                        <td className="px-6 py-4">
                          <Link to={`/admin/renter/${occ.tenantId}`} className="font-medium text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400">
                            {occ.tenantName}
                          </Link>
                          <div className="text-xs text-gray-500 dark:text-gray-400">{occ.email}</div>
                        </td>
                        <td className="px-6 py-4 font-medium text-gray-700 dark:text-gray-300">Room {occ.roomNumber}</td>
                        <td className="px-6 py-4 text-gray-600 dark:text-gray-400">{occ.phone || 'N/A'}</td>
                        <td className="px-6 py-4 text-gray-600 dark:text-gray-400">{formatDate(occ.expiryDate)}</td>
                        <td className="px-6 py-4">
                          <span className="px-2 py-1 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs rounded-full font-medium">
                            Active
                          </span>
                          {occ.paymentStatus === "pending" && (
                            <span className="ml-2 px-2 py-1 bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 text-xs rounded-full font-medium">
                              Pending
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <Link 
                            to={`/admin/renter/${occ.tenantId}?edit=true`}
                            className="p-2 bg-gray-100 dark:bg-gray-700 hover:bg-blue-50 dark:hover:bg-blue-900/20 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 rounded-lg transition-all inline-flex items-center gap-2"
                          >
                            <Pencil size={14} />
                            <span className="text-xs font-medium">Edit</span>
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Registered Users List */}
            <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden mt-8">
              <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <UserCheck size={18} className="text-indigo-600 dark:text-indigo-400" />
                  Registered Users
                </h3>
                <span className="text-xs px-2 py-1 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-lg font-medium">
                  {users?.length || 0} Total
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-gray-50 dark:bg-gray-900/50">
                    <tr className="text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider">
                      <th className="px-6 py-4 font-semibold">User</th>
                      <th className="px-6 py-4 font-semibold">Contact</th>
                      <th className="px-6 py-4 font-semibold">Joined On</th>
                      <th className="px-6 py-4 font-semibold text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {users?.map((u, idx) => (
                      <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="font-medium text-gray-900 dark:text-white">{u.name}</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">{u.email}</div>
                        </td>
                        <td className="px-6 py-4 text-gray-600 dark:text-gray-400 text-sm">{u.phone || 'N/A'}</td>
                        <td className="px-6 py-4 text-gray-600 dark:text-gray-400 text-sm">{formatDate(u.createdAt)}</td>
                        <td className="px-6 py-4 text-right">
                          <button 
                            onClick={() => {
                              setTargetUser(u);
                              setShowRoomSelect(true);
                            }}
                            className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all inline-flex items-center gap-2 text-xs font-bold"
                          >
                            <UserPlus2 size={14} /> Grant Access
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Right Sidebar - Stack on mobile */}
          <div className="space-y-4 sm:space-y-6">
            {/* Expiry Alerts */}
            <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2 mb-4">
                <AlertTriangle size={18} className="text-amber-500" />
                Expiring Soon
              </h3>
              
              <div className="space-y-3">
                {stats?.expiringSoon?.length > 0 ? (
                  stats.expiringSoon.map((item, idx) => (
                    <motion.div 
                      key={idx}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="p-3 sm:p-4 bg-amber-50 dark:bg-amber-500/5 rounded-xl border border-amber-200 dark:border-amber-500/20 hover:border-amber-300 dark:hover:border-amber-500/30 transition-all cursor-default"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <span className="text-sm font-semibold text-gray-900 dark:text-white">Room {item.roomNumber}</span>
                          <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">{item.tenantName}</p>
                        </div>
                        <span className="text-[10px] text-amber-700 dark:text-amber-400 font-medium bg-amber-200/50 dark:bg-amber-500/20 px-2 py-1 rounded-full">
                          {Math.ceil((new Date(item.expiryDate) - new Date()) / (1000 * 60 * 60 * 24))} days
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                        <Clock size={12} />
                        <span>Ends {formatDate(item.expiryDate)}</span>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="text-center py-6 sm:py-8 text-gray-500 dark:text-gray-400">
                    <Clock size={32} className="mx-auto mb-2 text-gray-300 dark:text-gray-600" />
                    <p className="text-sm">No expiring stays</p>
                    <p className="text-xs mt-1">Next 7 days are clear</p>
                  </div>
                )}
              </div>
            </div>

            {/* Revenue Insight Card - Mobile optimized */}
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl sm:rounded-2xl p-5 sm:p-6 shadow-lg relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <TrendingUp size={48} />
              </div>
              <div className="relative z-10">
                <h4 className="text-blue-100 font-medium text-xs sm:text-sm">Revenue Insight</h4>
                <p className="text-lg sm:text-xl font-bold text-white mt-1">↑ 12% Growth</p>
                <p className="text-blue-100 text-xs mt-3 leading-relaxed opacity-90">
                  Your property revenue has grown consistently over the last quarter.
                </p>
                <button className="mt-4 w-full py-2.5 sm:py-3 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white rounded-xl font-medium flex items-center justify-center gap-2 transition-colors text-sm border border-white/20">
                  View Full Report <ArrowRight size={14} />
                </button>
              </div>
            </div>

            {/* Quick Actions - Mobile only */}
            <div className="lg:hidden grid grid-cols-2 gap-3">
              <Link 
                to="/admin/rooms"
                className="p-3 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 text-center"
              >
                <Home size={20} className="mx-auto mb-1 text-blue-600 dark:text-blue-400" />
                <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Manage Rooms</span>
              </Link>
              <Link 
                to="/admin/tenants"
                className="p-3 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 text-center"
              >
                <Users size={20} className="mx-auto mb-1 text-indigo-600 dark:text-indigo-400" />
                <span className="text-xs font-medium text-gray-700 dark:text-gray-300">View Tenants</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Mobile Quick Stats Footer */}
        <div className="mt-6 lg:hidden grid grid-cols-2 gap-3 text-center text-xs">
          <div className="bg-white dark:bg-gray-800 p-3 rounded-xl border border-gray-200 dark:border-gray-700">
            <p className="text-gray-500 dark:text-gray-400">Occupancy Rate</p>
            <p className="text-lg font-bold text-gray-900 dark:text-white">
              {stats?.rooms?.total ? Math.round((stats.rooms.occupied / stats.rooms.total) * 100) : 0}%
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-3 rounded-xl border border-gray-200 dark:border-gray-700">
            <p className="text-gray-500 dark:text-gray-400">Available Rooms</p>
            <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">{stats?.rooms?.available || 0}</p>
          </div>
        </div>
      </div>
      {/* Room Selection Modal */}
      <AnimatePresence>
        {showRoomSelect && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 w-full max-w-md rounded-2xl overflow-hidden shadow-2xl"
            >
              <div className="p-6 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">Select Room</h3>
                  <p className="text-gray-500 text-sm">Assigning room to {targetUser?.name}</p>
                </div>
                <button onClick={() => setShowRoomSelect(false)} className="text-gray-500 hover:text-gray-700 dark:hover:text-white transition-colors">
                  <X size={24} />
                </button>
              </div>
              <form onSubmit={handleGrantAccess} className="p-6 space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-gray-500 uppercase ml-1">Available Rooms</label>
                  <select 
                    required
                    value={selectedRoomId}
                    onChange={(e) => setSelectedRoomId(e.target.value)}
                    className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500/50 outline-none"
                  >
                    <option value="">Choose a room...</option>
                    {availableRooms.map(room => (
                      <option key={room._id} value={room._id}>
                        Room {room.roomNumber} - {room.type} (₹{room.price})
                      </option>
                    ))}
                  </select>
                  {availableRooms.length === 0 && (
                    <p className="text-rose-500 text-xs mt-1">No rooms available at the moment.</p>
                  )}
                </div>
                
                <div className="pt-4">
                  <button 
                    type="submit" 
                    disabled={grantLoading || availableRooms.length === 0}
                    className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-600/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {grantLoading ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <UserPlus2 size={20} />
                        Confirm Assignment
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminDashboard;