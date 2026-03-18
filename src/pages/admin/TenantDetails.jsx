import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import API from '../../axios/axios';
import { motion, AnimatePresence } from 'framer-motion';
import { FiUser, FiMail, FiPhone, FiMapPin, FiCalendar, FiArrowLeft, FiShield, FiHome, FiX, FiEdit2, FiSave, FiCheck } from 'react-icons/fi';

const TenantDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const [tenant, setTenant] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [actionLoading, setActionLoading] = useState(false);
    const [actionMessage, setActionMessage] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        address: ''
    });

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        if (params.get('edit') === 'true') {
            setIsEditing(true);
        }
    }, [location.search]);

    useEffect(() => {
        const fetchTenantDetails = async () => {
            try {
                setLoading(true);
                // We'll search for the tenant in the tenant list or a specific endpoint
                // For now, let's try to get all tenants and find the one with this ID
                const { data } = await API.get('/tenants');
                const foundTenant = data.find(t => t._id === id);
                
                if (foundTenant) {
                    setTenant(foundTenant);
                    setFormData({
                        name: foundTenant.user?.name || '',
                        email: foundTenant.email || '',
                        phone: foundTenant.phone || '',
                        address: foundTenant.user?.address || ''
                    });
                } else {
                    setError("Tenant not found.");
                }
            } catch (err) {
                setError("Failed to fetch tenant details.");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchTenantDetails();
    }, [id]);

    const handleRenew = async () => {
        try {
            setActionLoading(true);
            setActionMessage(null);
            const { data } = await API.post(`/admin/renew/${tenant?._id}`);
            if (data.success) {
                setActionMessage({ type: 'success', text: 'Stay renewed successfully!' });
                // Update local state
                setTenant(prev => ({
                    ...prev,
                    expiryDate: data.newExpiry
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
        if (!window.confirm("Are you sure you want to vacate this room? This action cannot be undone.")) return;
        
        try {
            setActionLoading(true);
            setActionMessage(null);
            const { data } = await API.post(`/admin/vacate/${tenant?._id}`);
            if (data.success) {
                setActionMessage({ type: 'success', text: 'Room vacated successfully!' });
                setTimeout(() => navigate('/admin'), 2000);
            }
        } catch (err) {
            setActionMessage({ type: 'error', text: 'Failed to vacate room.' });
            console.error(err);
        } finally {
            setActionLoading(false);
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            setActionLoading(true);
            const { data } = await API.put(`/admin/tenant/${tenant?._id}`, formData);
            if (data.success) {
                setActionMessage({ type: 'success', text: 'Details updated successfully!' });
                setTenant(prev => ({
                    ...prev,
                    ...data.tenant,
                    user: {
                        ...prev.user,
                        name: formData.name,
                        address: formData.address
                    }
                }));
                setIsEditing(false);
            }
        } catch (err) {
            setActionMessage({ type: 'error', text: 'Failed to update details.' });
            console.error(err);
        } finally {
            setActionLoading(false);
            setTimeout(() => setActionMessage(null), 3000);
        }
    };

    if (loading) return (
        <div className="flex items-center justify-center min-h-screen bg-[#0f172a]">
            <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
        </div>
    );

    if (error || !tenant) return (
        <div className="min-h-screen bg-[#0f172a] flex flex-col items-center justify-center p-4">
            <p className="text-rose-400 mb-4">{error || "Tenant not found"}</p>
            <button 
                onClick={() => navigate('/tenants')}
                className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors"
            >
                <FiArrowLeft /> Back to Tenants
            </button>
        </div>
    );

    const user = tenant.user || {};

    const containerVariants = {
        hidden: { opacity: 0, scale: 0.95 },
        visible: { 
            opacity: 1, 
            scale: 1,
            transition: { duration: 0.5 }
        }
    };

    const infoItemStyles = "flex items-start gap-4 p-4 rounded-2xl bg-white/5 border border-white/5";
    const labelStyles = "text-xs text-slate-500 uppercase tracking-wider mb-1";
    const valueStyles = "text-slate-200 font-medium";

    return (
        <div className="min-h-screen bg-[#0f172a] py-12 px-4 sm:px-6 lg:px-8">
            <motion.div 
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="max-w-4xl mx-auto"
            >
                {/* Back Button & Breadcrumbs */}
                <div className="flex items-center gap-4 mb-8">
                    <button 
                        onClick={() => navigate(-1)}
                        className="p-2 rounded-xl bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 transition-all border border-white/5"
                    >
                        <FiArrowLeft size={20} />
                    </button>
                    <div>
                        <h2 className="text-sm font-medium text-slate-500">Tenant Management</h2>
                        <h1 className="text-2xl font-bold text-white">Profile Details</h1>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Profile Summary Card */}
                    <div className="md:col-span-1 space-y-6">
                        <div className="glass-card p-8 text-center flex flex-col items-center">
                            <div className="w-24 h-24 rounded-3xl bg-linear-to-tr from-blue-500 to-indigo-600 flex items-center justify-center text-3xl font-bold text-white shadow-2xl shadow-blue-500/20 mb-6">
                                {user.name?.charAt(0) || <FiUser />}
                            </div>
                            <h3 className="text-xl font-bold text-white mb-1">{user.name || 'Guest'}</h3>
                            <p className="text-sm text-slate-400 mb-6">{user.email}</p>
                            
                            <div className="w-full pt-6 border-t border-white/5 space-y-4">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-slate-500">Status</span>
                                    <span className="px-2 py-1 rounded-md bg-emerald-500/10 text-emerald-400 font-bold text-[10px] uppercase">Active</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-slate-500">Room</span>
                                    <span className="text-slate-200 font-bold">#{tenant.room?.roomNumber || 'N/A'}</span>
                                </div>
                            </div>
                        </div>

                        <div className="p-6 rounded-3xl bg-linear-to-br from-blue-600/10 to-indigo-600/10 border border-blue-500/20">
                            <div className="flex items-center gap-3 text-blue-400 mb-3">
                                <FiHome />
                                <span className="font-semibold">Current Stay</span>
                            </div>
                            <p className="text-sm text-slate-400 leading-relaxed mb-4">
                                {user.name} is currently staying in Room {tenant.room?.roomNumber}. Their stay is approved and active.
                            </p>
                            <button className="w-full py-2.5 rounded-xl bg-blue-600 text-white text-sm font-bold hover:bg-blue-500 transition-all">
                                View History
                            </button>
                        </div>

                        {/* Administrative Actions */}
                        <div className="p-6 rounded-3xl bg-linear-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/20">
                            <h4 className="text-amber-400 font-semibold mb-4 flex items-center gap-2">
                                <FiShield /> Admin Actions
                            </h4>
                            <div className="space-y-3">
                                <button 
                                    onClick={handleRenew}
                                    disabled={actionLoading}
                                    className="w-full py-2.5 rounded-xl bg-amber-500 text-white text-sm font-bold hover:bg-amber-600 transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-lg shadow-amber-500/20"
                                >
                                    {actionLoading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : <><FiCalendar /> Renew (30 Days)</>}
                                </button>
                                <button 
                                    onClick={handleVacate}
                                    disabled={actionLoading}
                                    className="w-full py-2.5 rounded-xl bg-orange-600/10 text-orange-500 border border-orange-500/20 text-sm font-bold hover:bg-orange-600 hover:text-white transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                                >
                                    {actionLoading ? <div className="w-4 h-4 border-2 border-orange-500/30 border-t-orange-500 rounded-full animate-spin"></div> : <><FiX /> Vacate Room</>}
                                </button>
                            </div>
                            {actionMessage && (
                                <motion.p 
                                    initial={{ opacity: 0, y: 5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`mt-4 text-center text-xs font-semibold px-3 py-2 rounded-lg ${actionMessage.type === 'success' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}
                                >
                                    {actionMessage.text}
                                </motion.p>
                            )}
                        </div>
                    </div>

                    {/* Personal Details & Documents */}
                    <div className="md:col-span-2 space-y-6">
                        <div className="glass-card p-8">
                            <div className="flex justify-between items-center mb-6">
                                <h4 className="text-lg font-bold text-white flex items-center gap-2">
                                    <FiUser className="text-blue-500" /> Personal Information
                                </h4>
                                <button 
                                    onClick={() => setIsEditing(!isEditing)}
                                    className={`px-4 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${isEditing ? 'bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white' : 'bg-blue-500/10 text-blue-500 hover:bg-blue-500 hover:text-white'}`}
                                >
                                    {isEditing ? <><FiX /> Cancel</> : <><FiEdit2 /> Edit Details</>}
                                </button>
                            </div>

                            <form onSubmit={handleUpdate} className="space-y-6">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {isEditing ? (
                                        <>
                                            <div className="space-y-2">
                                                <label className={labelStyles}>Full Name</label>
                                                <input 
                                                    type="text" 
                                                    value={formData.name}
                                                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                                                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:ring-2 focus:ring-blue-500/50 outline-none"
                                                    required
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className={labelStyles}>Email Address</label>
                                                <input 
                                                    type="email" 
                                                    value={formData.email}
                                                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                                                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:ring-2 focus:ring-blue-500/50 outline-none"
                                                    required
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className={labelStyles}>Phone Number</label>
                                                <input 
                                                    type="text" 
                                                    value={formData.phone}
                                                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                                                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:ring-2 focus:ring-blue-500/50 outline-none"
                                                    required
                                                />
                                            </div>
                                            <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 opacity-50">
                                                <FiShield className="text-slate-500 mt-1" />
                                                <div>
                                                    <p className={labelStyles}>Gender (Read-only)</p>
                                                    <p className={valueStyles + " capitalize"}>{user.gender || 'Not specified'}</p>
                                                </div>
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <div className={infoItemStyles}>
                                                <FiUser className="text-slate-500 mt-1" />
                                                <div>
                                                    <p className={labelStyles}>Full Name</p>
                                                    <p className={valueStyles}>{user.name}</p>
                                                </div>
                                            </div>
                                            <div className={infoItemStyles}>
                                                <FiMail className="text-slate-500 mt-1" />
                                                <div>
                                                    <p className={labelStyles}>Email Address</p>
                                                    <p className={valueStyles}>{user.email}</p>
                                                </div>
                                            </div>
                                            <div className={infoItemStyles}>
                                                <FiPhone className="text-slate-500 mt-1" />
                                                <div>
                                                    <p className={labelStyles}>Phone Number</p>
                                                    <p className={valueStyles}>{tenant.phone || user.phone || 'Not provided'}</p>
                                                </div>
                                            </div>
                                            <div className={infoItemStyles}>
                                                <FiShield className="text-slate-500 mt-1" />
                                                <div>
                                                    <p className={labelStyles}>Gender</p>
                                                    <p className={valueStyles + " capitalize"}>{user.gender || 'Not specified'}</p>
                                                </div>
                                            </div>
                                        </>
                                    )}
                                    <div className={infoItemStyles}>
                                        <FiCalendar className="text-slate-500 mt-1" />
                                        <div>
                                            <p className={labelStyles}>Date of Birth</p>
                                            <p className={valueStyles}>{user.dateOfBirth ? new Date(user.dateOfBirth).toLocaleDateString() : 'Not provided'}</p>
                                        </div>
                                    </div>
                                    <div className={infoItemStyles}>
                                        <FiCalendar className="text-slate-500 mt-1" />
                                        <div>
                                            <p className={labelStyles}>Joining Date</p>
                                            <p className={valueStyles}>{new Date(tenant.joiningDate).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className={labelStyles}>Permanent Address</label>
                                    {isEditing ? (
                                        <textarea 
                                            value={formData.address}
                                            onChange={(e) => setFormData({...formData, address: e.target.value})}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:ring-2 focus:ring-blue-500/50 outline-none h-24"
                                        />
                                    ) : (
                                        <div className={infoItemStyles}>
                                            <FiMapPin className="text-slate-500 mt-1" />
                                            <div>
                                                <p className={valueStyles}>{user.address || 'Not provided'}</p>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {isEditing && (
                                    <button 
                                        type="submit"
                                        disabled={actionLoading}
                                        className="w-full py-4 bg-linear-to-r from-blue-600 to-indigo-600 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:from-blue-500 hover:to-indigo-500 transition-all shadow-xl shadow-blue-500/20 disabled:opacity-50"
                                    >
                                        {actionLoading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : <><FiSave /> Save Changes</>}
                                    </button>
                                )}
                            </form>
                        </div>

                        {/* ID Proof Section */}
                        <div className="glass-card p-8">
                            <h4 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                                <FiShield className="text-amber-500" /> Identity Verification
                            </h4>
                            {tenant.idProof ? (
                                <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex flex-col items-center">
                                    <img 
                                        src={tenant.idProof} 
                                        alt="ID Proof" 
                                        className="max-h-64 rounded-xl shadow-lg mb-4"
                                    />
                                    <a 
                                        href={tenant.idProof} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="text-sm font-medium text-blue-400 hover:text-blue-300 underline"
                                    >
                                        View Full Resolution
                                    </a>
                                </div>
                            ) : (
                                <div className="p-12 text-center bg-slate-800/20 rounded-2xl border border-dashed border-slate-700">
                                    <p className="text-slate-500">No ID proof uploaded for this tenant.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default TenantDetails;
