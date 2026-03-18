import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import API from '../../axios/axios';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiUser, 
  FiMail, 
  FiPhone, 
  FiMapPin, 
  FiCalendar, 
  FiArrowLeft, 
  FiShield, 
  FiHome, 
  FiX, 
  FiEdit2, 
  FiSave, 
  FiCheck,
  FiClock,
  FiActivity,
  FiMoreVertical,
  FiChevronDown,
  FiChevronUp
} from 'react-icons/fi';

const RenterDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    
    const [data, setData] = useState({
        booking: null,
        user: null
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [actionLoading, setActionLoading] = useState(false);
    const [actionMessage, setActionMessage] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [expandedSections, setExpandedSections] = useState({
        profile: true,
        room: true,
        actions: true
    });
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        address: ''
    });
    const [showMobileMenu, setShowMobileMenu] = useState(false);

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        if (params.get('edit') === 'true') {
            setIsEditing(true);
        }
    }, [location.search]);

    useEffect(() => {
        const fetchRenterDetails = async () => {
            try {
                setLoading(true);
                const { data } = await API.get(`/admin/renter/${id}`);
                if (data.success) {
                    setData({
                        booking: data.booking,
                        user: data.user
                    });
                    setFormData({
                        name: data.booking.name || data.user?.name || '',
                        email: data.booking.email || data.user?.email || '',
                        phone: data.booking.phone || data.user?.phone || '',
                        address: data.user?.address || ''
                    });
                }
            } catch (err) {
                setError("Failed to fetch renter details.");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchRenterDetails();
    }, [id]);

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            setActionLoading(true);
            const res = await API.put(`/admin/renter/${id}`, formData);
            if (res.data.success) {
                setActionMessage({ type: 'success', text: 'Renter updated successfully!' });
                setData(prev => ({
                    ...prev,
                    booking: { ...prev.booking, ...formData },
                    user: prev.user ? { ...prev.user, ...formData } : null
                }));
                setIsEditing(false);
            }
        } catch (err) {
            setActionMessage({ type: 'error', text: 'Failed to update renter.' });
            console.error(err);
        } finally {
            setActionLoading(false);
            setTimeout(() => setActionMessage(null), 3000);
        }
    };

    const handleRenew = async () => {
        try {
            setActionLoading(true);
            const { data: resData } = await API.post(`/admin/renew/${id}`);
            if (resData.success) {
                setActionMessage({ type: 'success', text: 'Stay renewed successfully!' });
                setData(prev => ({
                    ...prev,
                    booking: { ...prev.booking, expiryDate: resData.newExpiry }
                }));
            }
        } catch (err) {
            setActionMessage({ type: 'error', text: 'Failed to renew stay.' });
            console.error(err);
        } finally {
            setActionLoading(false);
            setTimeout(() => setActionMessage(null), 3000);
        }
    };

    const handleVacate = async () => {
        if (!window.confirm("Are you sure you want to vacate this room?")) return;
        try {
            setActionLoading(true);
            const { data: resData } = await API.post(`/admin/vacate/${id}`);
            if (resData.success) {
                setActionMessage({ type: 'success', text: 'Room vacated successfully!' });
                setTimeout(() => navigate('/admin'), 1500);
            }
        } catch (err) {
            setActionMessage({ type: 'error', text: 'Failed to vacate room.' });
            console.error(err);
        } finally {
            setActionLoading(false);
        }
    };

    const toggleSection = (section) => {
        setExpandedSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
    };

    if (loading) return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
            <div className="relative">
                <div className="w-12 h-12 border-4 border-gray-200 dark:border-gray-700 border-t-blue-600 rounded-full animate-spin"></div>
                <p className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">
                    Loading details...
                </p>
            </div>
        </div>
    );

    if (error || !data.booking) return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col items-center justify-center p-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 text-center max-w-md w-full border border-gray-200 dark:border-gray-700 shadow-lg">
                <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FiX className="w-8 h-8 text-red-600 dark:text-red-400" />
                </div>
                <p className="text-gray-900 dark:text-white font-semibold mb-2">{error || "Renter not found"}</p>
                <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">The renter you're looking for doesn't exist or has been removed.</p>
                <button 
                    onClick={() => navigate('/admin')}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors"
                >
                    <FiArrowLeft size={18} />
                    Back to Dashboard
                </button>
            </div>
        </div>
    );

    const { booking, user } = data;

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric',
            year: 'numeric'
        });
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-8">
            {/* Mobile Header */}
            <div className="sticky top-0 z-30 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3 lg:hidden">
                <div className="flex items-center justify-between">
                    <button 
                        onClick={() => navigate('/admin')}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                        aria-label="Go back"
                    >
                        <FiArrowLeft size={20} className="text-gray-600 dark:text-gray-400" />
                    </button>
                    <h1 className="text-lg font-semibold text-gray-900 dark:text-white">Renter Details</h1>
                    <button 
                        onClick={() => setShowMobileMenu(!showMobileMenu)}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                        aria-label="Menu"
                    >
                        <FiMoreVertical size={20} className="text-gray-600 dark:text-gray-400" />
                    </button>
                </div>

                {/* Mobile Menu Dropdown */}
                <AnimatePresence>
                    {showMobileMenu && (
                        <motion.div 
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="absolute top-full left-0 right-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-lg p-2"
                        >
                            <button 
                                onClick={() => {
                                    setIsEditing(!isEditing);
                                    setShowMobileMenu(false);
                                }}
                                className="w-full text-left px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-gray-700 dark:text-gray-300 flex items-center gap-3"
                            >
                                {isEditing ? <FiX size={18} /> : <FiEdit2 size={18} />}
                                <span>{isEditing ? 'Cancel Edit' : 'Edit Details'}</span>
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Desktop Header */}
            <div className="hidden lg:block max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-6">
                <div className="flex items-center gap-4">
                    <button 
                        onClick={() => navigate('/admin')}
                        className="p-3 rounded-xl bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-all"
                    >
                        <FiArrowLeft size={20} />
                    </button>
                    <div>
                        <p className="text-sm font-medium text-blue-600 dark:text-blue-400 uppercase tracking-wider">Renter Management</p>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Renter Details</h1>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
                    {/* Left Column - Mobile Optimized */}
                    <div className="space-y-4 sm:space-y-6">
                        {/* Profile Summary Card - Collapsible on mobile */}
                        <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                            <button 
                                onClick={() => toggleSection('profile')}
                                className="w-full lg:hidden flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700"
                            >
                                <span className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                                    <FiUser className="text-blue-600 dark:text-blue-400" />
                                    Profile Summary
                                </span>
                                {expandedSections.profile ? <FiChevronUp size={18} /> : <FiChevronDown size={18} />}
                            </button>
                            
                            <AnimatePresence>
                                {(expandedSections.profile || window.innerWidth >= 1024) && (
                                    <motion.div 
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="p-4 sm:p-6"
                                    >
                                        <div className="flex flex-col items-center">
                                            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-2xl sm:text-3xl font-bold text-white shadow-lg mb-4">
                                                {booking.name?.charAt(0).toUpperCase()}
                                            </div>
                                            <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-1">{booking.name}</h3>
                                            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-4">{booking.email}</p>
                                            
                                            <div className="w-full space-y-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-xs text-gray-500 dark:text-gray-400">Status</span>
                                                    <div className="flex gap-2">
                                                        <span className="px-2 py-1 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-xs font-medium rounded-full">
                                                            Active
                                                        </span>
                                                        {booking.paymentStatus === "pending" && (
                                                            <span className="px-2 py-1 bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 text-xs font-medium rounded-full">
                                                                Payment Due
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <span className="text-xs text-gray-500 dark:text-gray-400">Room</span>
                                                    <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                                                        Room #{booking.room?.roomNumber}
                                                    </span>
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <span className="text-xs text-gray-500 dark:text-gray-400">Stay Until</span>
                                                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                                                        {formatDate(booking.expiryDate)}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Admin Actions - Mobile Optimized */}
                        <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                            <button 
                                onClick={() => toggleSection('actions')}
                                className="w-full lg:hidden flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700"
                            >
                                <span className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                                    <FiShield className="text-amber-600 dark:text-amber-400" />
                                    Admin Controls
                                </span>
                                {expandedSections.actions ? <FiChevronUp size={18} /> : <FiChevronDown size={18} />}
                            </button>
                            
                            <AnimatePresence>
                                {(expandedSections.actions || window.innerWidth >= 1024) && (
                                    <motion.div 
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="p-4 sm:p-6 space-y-3"
                                    >
                                        <button 
                                            onClick={handleRenew}
                                            disabled={actionLoading}
                                            className="w-full py-3 sm:py-4 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-medium hover:shadow-lg hover:shadow-amber-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50 text-sm sm:text-base"
                                        >
                                            {actionLoading ? (
                                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                            ) : (
                                                <>
                                                    <FiClock size={18} />
                                                    Renew (30 Days)
                                                </>
                                            )}
                                        </button>
                                        <button 
                                            onClick={handleVacate}
                                            disabled={actionLoading}
                                            className="w-full py-3 sm:py-4 rounded-xl bg-gray-100 dark:bg-gray-700 text-rose-600 dark:text-rose-400 border border-gray-200 dark:border-gray-600 font-medium hover:bg-rose-500 hover:text-white hover:border-rose-500 transition-all flex items-center justify-center gap-2 disabled:opacity-50 text-sm sm:text-base"
                                        >
                                            {actionLoading ? (
                                                <div className="w-5 h-5 border-2 border-rose-500/30 border-t-rose-500 rounded-full animate-spin"></div>
                                            ) : (
                                                <>
                                                    <FiX size={18} />
                                                    Vacate Room
                                                </>
                                            )}
                                        </button>
                                        
                                        {actionMessage && (
                                            <motion.div 
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className={`mt-3 p-3 rounded-xl text-center text-xs font-medium ${
                                                    actionMessage.type === 'success' 
                                                        ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20' 
                                                        : 'bg-rose-50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-500/20'
                                                }`}
                                            >
                                                {actionMessage.text}
                                            </motion.div>
                                        )}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>

                    {/* Right Column - Mobile Optimized */}
                    <div className="lg:col-span-2 space-y-4 sm:space-y-6">
                        {/* User Profile Information */}
                        <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                            <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700">
                                <div className="flex items-center justify-between">
                                    <h4 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                                        <FiUser className="text-blue-600 dark:text-blue-400" />
                                        Profile Information
                                    </h4>
                                    <button 
                                        onClick={() => setIsEditing(!isEditing)}
                                        className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                                            isEditing 
                                                ? 'bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-500/20' 
                                                : 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-500/20'
                                        }`}
                                    >
                                        {isEditing ? <FiX size={16} /> : <FiEdit2 size={16} />}
                                        <span className="hidden sm:inline">{isEditing ? 'Cancel' : 'Edit'}</span>
                                    </button>
                                </div>
                            </div>

                            <div className="p-4 sm:p-6">
                                <form onSubmit={handleUpdate}>
                                    <div className="space-y-4">
                                        {/* Mobile-optimized form fields */}
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            {isEditing ? (
                                                <>
                                                    <div>
                                                        <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Full Name</label>
                                                        <input 
                                                            type="text" 
                                                            value={formData.name}
                                                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                                                            className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
                                                            required
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Email</label>
                                                        <input 
                                                            type="email" 
                                                            value={formData.email}
                                                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                                                            className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
                                                            required
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Phone</label>
                                                        <input 
                                                            type="text" 
                                                            value={formData.phone}
                                                            onChange={(e) => setFormData({...formData, phone: e.target.value})}
                                                            className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
                                                            required
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Gender</label>
                                                        <div className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-600 dark:text-gray-400 text-sm">
                                                            {user?.gender || 'Not specified'}
                                                        </div>
                                                    </div>
                                                </>
                                            ) : (
                                                <>
                                                    <div className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-900/50 rounded-xl">
                                                        <FiUser className="text-blue-500 mt-1 flex-shrink-0" size={18} />
                                                        <div className="min-w-0 flex-1">
                                                            <p className="text-xs text-gray-500 dark:text-gray-400">Name</p>
                                                            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{booking.name}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-900/50 rounded-xl">
                                                        <FiMail className="text-blue-500 mt-1 flex-shrink-0" size={18} />
                                                        <div className="min-w-0 flex-1">
                                                            <p className="text-xs text-gray-500 dark:text-gray-400">Email</p>
                                                            <p className="text-sm text-gray-900 dark:text-white break-all">{booking.email}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-900/50 rounded-xl">
                                                        <FiPhone className="text-blue-500 mt-1 flex-shrink-0" size={18} />
                                                        <div className="min-w-0 flex-1">
                                                            <p className="text-xs text-gray-500 dark:text-gray-400">Phone</p>
                                                            <p className="text-sm font-medium text-gray-900 dark:text-white">{booking.phone}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-900/50 rounded-xl">
                                                        <FiShield className="text-purple-500 mt-1 flex-shrink-0" size={18} />
                                                        <div className="min-w-0 flex-1">
                                                            <p className="text-xs text-gray-500 dark:text-gray-400">Gender</p>
                                                            <p className="text-sm text-gray-900 dark:text-white capitalize">{user?.gender || 'Not specified'}</p>
                                                        </div>
                                                    </div>
                                                </>
                                            )}
                                        </div>

                                        {/* Address Field */}
                                        <div>
                                            <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Address</label>
                                            {isEditing ? (
                                                <textarea 
                                                    value={formData.address}
                                                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                                                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm h-24 resize-none"
                                                    placeholder="Enter full address..."
                                                />
                                            ) : (
                                                <div className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-900/50 rounded-xl">
                                                    <FiMapPin className="text-indigo-500 mt-1 flex-shrink-0" size={18} />
                                                    <div className="min-w-0 flex-1">
                                                        <p className="text-sm text-gray-900 dark:text-white break-words">{user?.address || 'Not provided'}</p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        {isEditing && (
                                            <button 
                                                type="submit"
                                                disabled={actionLoading}
                                                className="w-full py-3 sm:py-4 bg-linear-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-medium hover:from-blue-500 hover:to-indigo-500 transition-all flex items-center justify-center gap-2 disabled:opacity-50 text-sm sm:text-base"
                                            >
                                                {actionLoading ? (
                                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                                ) : (
                                                    <>
                                                        <FiSave size={18} />
                                                        Save Changes
                                                    </>
                                                )}
                                            </button>
                                        )}
                                    </div>
                                </form>
                            </div>
                        </div>

                        {/* Room Details */}
                        <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                            <button 
                                onClick={() => toggleSection('room')}
                                className="w-full lg:hidden flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700"
                            >
                                <span className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                                    <FiHome className="text-indigo-600 dark:text-indigo-400" />
                                    Room Details
                                </span>
                                {expandedSections.room ? <FiChevronUp size={18} /> : <FiChevronDown size={18} />}
                            </button>
                            
                            <AnimatePresence>
                                {(expandedSections.room || window.innerWidth >= 1024) && (
                                    <motion.div 
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                    >
                                        <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700 hidden lg:block">
                                            <h4 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                                                <FiHome className="text-indigo-600 dark:text-indigo-400" />
                                                Room Details
                                            </h4>
                                        </div>
                                        
                                        <div className="p-4 sm:p-6">
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                                                <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-xl">
                                                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Room Number</p>
                                                    <div className="flex items-center justify-between">
                                                        <p className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">#{booking.room?.roomNumber}</p>
                                                        <span className="px-2 py-1 bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 text-xs font-medium rounded-full">
                                                            Occupied
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-xl">
                                                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Room Type</p>
                                                    <p className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white capitalize">
                                                        {booking.room?.type || 'Standard'}
                                                    </p>
                                                </div>
                                                <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-xl">
                                                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Registration Date</p>
                                                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                                                        {formatDate(booking.createdAt)}
                                                    </p>
                                                </div>
                                                <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-xl">
                                                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Last Renewed</p>
                                                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                                                        {formatDate(booking.updatedAt)}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RenterDetails;