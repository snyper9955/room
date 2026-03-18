import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { FiUser, FiMail, FiPhone, FiMapPin, FiCalendar, FiEdit2, FiSave, FiX, FiShield } from 'react-icons/fi';

const UserProfile = () => {
    const { user, updateProfile } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        gender: '',
        address: '',
        dateOfBirth: ''
    });

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                email: user.email || '',
                phone: user.phone || '',
                gender: user.gender || '',
                address: user.address || '',
                dateOfBirth: user.dateOfBirth ? new Date(user.dateOfBirth).toISOString().split('T')[0] : ''
            });
        }
    }, [user]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ type: '', text: '' });

        const result = await updateProfile(formData);
        
        if (result.success) {
            setMessage({ type: 'success', text: 'Profile updated successfully!' });
            setIsEditing(false);
        } else {
            setMessage({ type: 'error', text: result.message || 'Failed to update profile.' });
        }
        setLoading(false);

        // Clear message after 3 seconds
        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    };

    const containerVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { 
            opacity: 1, 
            y: 0,
            transition: { duration: 0.6, ease: "easeOut" }
        }
    };

    const inputStyles = "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-300";
    const labelStyles = "block text-sm font-medium text-gray-400 mb-2 ml-1";

    return (
        <div className="min-h-screen bg-[#0f172a] py-12 px-4 sm:px-6 lg:px-8">
            <motion.div 
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="max-w-4xl mx-auto"
            >
                {/* Header Section */}
                <div className="relative mb-8 p-8 rounded-3xl bg-linear-to-br from-blue-600/20 to-purple-600/20 border border-white/10 backdrop-blur-xl overflow-hidden">
                    <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"></div>
                    <div className="relative flex flex-col md:flex-row items-center gap-6">
                        <div className="w-24 h-24 rounded-2xl bg-linear-to-tr from-blue-500 to-purple-600 flex items-center justify-center text-4xl text-white shadow-2xl shadow-blue-500/20">
                            {user?.name?.charAt(0) || <FiUser />}
                        </div>
                        <div className="text-center md:text-left grow">
                            <h1 className="text-3xl font-bold text-white mb-2">{user?.name}</h1>
                            <div className="flex flex-wrap justify-center md:justify-start gap-4">
                                {(user?.role === 'admin' || user?.email === 'chemistryhero1@gmail.com') && (
                                    <button 
                                        onClick={() => window.location.href='/admin'}
                                        className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/20 text-blue-400 text-sm border border-blue-500/30 hover:bg-blue-500/30 transition-all font-medium"
                                    >
                                        <FiShield className="text-blue-400" /> Admin Dashboard
                                    </button>
                                )}
                                <span className="flex items-center gap-2 text-gray-400 text-sm bg-white/5 px-3 py-1 rounded-full border border-white/5">
                                    <FiMail className="text-blue-400" /> {user?.email}
                                </span>
                                <span className="flex items-center gap-2 text-gray-400 text-sm bg-white/5 px-3 py-1 rounded-full border border-white/5 capitalize">
                                    <FiShield className="text-purple-400" /> {user?.role}
                                </span>
                            </div>
                        </div>
                        <button 
                            onClick={() => setIsEditing(!isEditing)}
                            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-medium transition-all duration-300 ${
                                isEditing 
                                ? "bg-white/10 text-white hover:bg-white/20" 
                                : "bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-600/20"
                            }`}
                        >
                            {isEditing ? <><FiX /> Cancel</> : <><FiEdit2 /> Edit Profile</>}
                        </button>
                    </div>
                </div>

                <AnimatePresence mode="wait">
                    {message.text && (
                        <motion.div 
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className={`mb-6 p-4 rounded-xl text-center font-medium border ${
                                message.type === 'success' 
                                ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
                                : 'bg-rose-500/10 border-rose-500/20 text-rose-400'
                            }`}
                        >
                            {message.text}
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Main Form/Display */}
                    <div className="md:col-span-2 space-y-6">
                        <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-md">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <div>
                                        <label className={labelStyles}>Full Name</label>
                                        <div className="relative">
                                            <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                                            <input 
                                                type="text" 
                                                name="name"
                                                disabled={!isEditing}
                                                value={formData.name}
                                                onChange={handleChange}
                                                className={`${inputStyles} pl-11 ${!isEditing && 'opacity-70 cursor-not-allowed border-transparent'}`}
                                                placeholder="John Doe"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className={labelStyles}>Email Address</label>
                                        <div className="relative">
                                            <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                                            <input 
                                                type="email" 
                                                name="email"
                                                disabled={!isEditing}
                                                value={formData.email}
                                                onChange={handleChange}
                                                className={`${inputStyles} pl-11 ${!isEditing && 'opacity-70 cursor-not-allowed border-transparent'}`}
                                                placeholder="john@example.com"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className={labelStyles}>Phone Number</label>
                                        <div className="relative">
                                            <FiPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                                            <input 
                                                type="text" 
                                                name="phone"
                                                disabled={!isEditing}
                                                value={formData.phone}
                                                onChange={handleChange}
                                                className={`${inputStyles} pl-11 ${!isEditing && 'opacity-70 cursor-not-allowed border-transparent'}`}
                                                placeholder="+1 234 567 890"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className={labelStyles}>Gender</label>
                                        <select 
                                            name="gender"
                                            disabled={!isEditing}
                                            value={formData.gender}
                                            onChange={handleChange}
                                            className={`${inputStyles} ${!isEditing && 'opacity-70 cursor-not-allowed border-transparent appearance-none'}`}
                                        >
                                            <option value="" className="bg-[#1e293b]">Select Gender</option>
                                            <option value="male" className="bg-[#1e293b]">Male</option>
                                            <option value="female" className="bg-[#1e293b]">Female</option>
                                            <option value="other" className="bg-[#1e293b]">Other</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className={labelStyles}>Date of Birth</label>
                                        <div className="relative">
                                            <FiCalendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                                            <input 
                                                type="date" 
                                                name="dateOfBirth"
                                                disabled={!isEditing}
                                                value={formData.dateOfBirth}
                                                onChange={handleChange}
                                                className={`${inputStyles} pl-11 ${!isEditing && 'opacity-70 cursor-not-allowed border-transparent'}`}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className={labelStyles}>Full Address</label>
                                    <div className="relative">
                                        <FiMapPin className="absolute left-4 top-4 text-gray-500" />
                                        <textarea 
                                            name="address"
                                            disabled={!isEditing}
                                            value={formData.address}
                                            onChange={handleChange}
                                            rows="3"
                                            className={`${inputStyles} pl-11 pt-3 resize-none ${!isEditing && 'opacity-70 cursor-not-allowed border-transparent'}`}
                                            placeholder="123 Luxury St, Gotham City"
                                        ></textarea>
                                    </div>
                                </div>

                                {isEditing && (
                                    <motion.button 
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        type="submit"
                                        disabled={loading}
                                        className="w-full bg-linear-to-r from-blue-600 to-purple-600 text-white font-bold py-4 rounded-xl shadow-xl shadow-blue-600/20 hover:shadow-blue-600/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-70"
                                    >
                                        {loading ? (
                                            <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                        ) : (
                                            <><FiSave className="text-xl" /> Save Changes</>
                                        )}
                                    </motion.button>
                                )}
                            </form>
                        </div>
                    </div>

                    {/* Sidebar Stats/Info */}
                    <div className="space-y-6">
                        <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-md">
                            <h3 className="text-lg font-semibold text-white mb-4">Account Overview</h3>
                            <div className="space-y-4">
                                <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Role</p>
                                    <p className="text-white font-medium capitalize">{user?.role}</p>
                                </div>
                                <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Account Status</p>
                                    <p className="text-emerald-400 font-medium">Active</p>
                                </div>
                                <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Member Since</p>
                                    <p className="text-white font-medium">{user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}</p>
                                </div>
                            </div>
                        </div>

                        <div className="p-6 rounded-3xl bg-linear-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/20">
                            <h4 className="text-amber-400 font-semibold mb-2">Need Help?</h4>
                            <p className="text-sm text-gray-400 mb-4">If you cannot update certain information, please contact administrator.</p>
                            <button className="text-sm font-medium text-amber-500 hover:text-amber-400 underline underline-offset-4">
                                Contact Support
                            </button>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default UserProfile;
