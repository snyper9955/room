import React from "react";
    import { useRoom } from "../context/RoomContext";
    import { useLocation, Link } from "react-router-dom";
    import { 
    Users, 
    UserPlus, 
    Search, 
    Phone, 
    Calendar, 
    Image as ImageIcon,
    MoreHorizontal
    } from "lucide-react";

    import { useTenant } from "../context/TenantContext";

    const TenantList = () => {
    const { tenants, loading } = useTenant();
    const location = useLocation();
    const [searchTerm, setSearchTerm] = React.useState("");

    React.useEffect(() => {
        const params = new URLSearchParams(location.search);
        const search = params.get("search");
        if (search) {
            setSearchTerm(search);
        }
    }, [location.search]);

    const filteredTenants = tenants.filter(t => 
        t.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.phone?.includes(searchTerm) ||
        t.room?.roomNumber?.toString().includes(searchTerm)
    );

    if (loading) return <div className="text-slate-400">Loading tenants...</div>;

    return (
        <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
            <h2 className="text-2xl font-bold">Tenant Management</h2>
            <p className="text-slate-400">Total active tenants in your property.</p>
            </div>
            <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-xl transition-all font-medium">
            <UserPlus size={18} />
            Add New Tenant
            </button>
        </div>

        {/* Search Bar */}
        <div className="glass-card p-4">
            <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
                type="text" 
                placeholder="Search by name, phone or room..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-[#161e2e] border border-slate-700/50 rounded-xl py-2.5 pl-10 pr-4 focus:ring-2 focus:ring-blue-500/20 outline-none"
            />
            </div>
        </div>

        {/* Tenants Table */}
        <div className="glass-card overflow-hidden">
            <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
                <thead>
                <tr className="border-b border-slate-700/50 bg-slate-800/30">
                    <th className="px-6 py-4 text-xs uppercase text-slate-400 font-bold">Tenant</th>
                    <th className="px-6 py-4 text-xs uppercase text-slate-400 font-bold">Room</th>
                    <th className="px-6 py-4 text-xs uppercase text-slate-400 font-bold">Phone</th>
                    <th className="px-6 py-4 text-xs uppercase text-slate-400 font-bold">Joining Date</th>
                    <th className="px-6 py-4 text-xs uppercase text-slate-400 font-bold">ID Proof</th>
                    <th className="px-6 py-4 text-xs uppercase text-slate-400 font-bold">Actions</th>
                </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/30">
                {filteredTenants.map((tenant) => (
                    <tr key={tenant._id} className="hover:bg-slate-800/20 transition-colors">
                    <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold">
                            {tenant.user?.name?.charAt(0) || 'T'}
                        </div>
                        <Link to={`/tenants/${tenant._id}`} className="block">
                            <p className="font-semibold text-slate-200 hover:text-blue-400 transition-colors">{tenant.user?.name || 'Guest User'}</p>
                            <p className="text-xs text-slate-400">{tenant.user?.email}</p>
                        </Link>
                        </div>
                    </td>
                    <td className="px-6 py-4">
                        <span className="bg-slate-700 text-slate-200 px-2 py-1 rounded text-sm font-medium">
                        Room {tenant.room?.roomNumber || 'N/A'}
                        </span>
                    </td>
                    <td className="px-6 py-4 text-slate-300">
                        <div className="flex items-center gap-2">
                        <Phone size={14} className="text-slate-500" />
                        {tenant.phone}
                        </div>
                    </td>
                    <td className="px-6 py-4 text-slate-300">
                        <div className="flex items-center gap-2">
                        <Calendar size={14} className="text-slate-500" />
                        {new Date(tenant.joiningDate).toLocaleDateString()}
                        </div>
                    </td>
                    <td className="px-6 py-4">
                        <button className="flex items-center gap-2 text-blue-400 hover:text-blue-300 text-sm font-medium">
                        <ImageIcon size={16} />
                        View ID
                        </button>
                    </td>
                    <td className="px-6 py-4">
                        <button className="p-1.5 hover:bg-slate-700 rounded-lg text-slate-400 transition-colors">
                        <MoreHorizontal size={20} />
                        </button>
                    </td>
                    </tr>
                ))}
                </tbody>
            </table>
            </div>
            
            {tenants.length === 0 && !loading && (
            <div className="p-12 text-center">
                <div className="w-16 h-16 bg-slate-800/50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-500">
                <Users size={32} />
                </div>
                <h3 className="text-lg font-semibold text-slate-300">No tenants found</h3>
                <p className="text-slate-500">Start by adding your first tenant to the system.</p>
            </div>
            )}
        </div>
        </div>
    );
    };

    export default TenantList;
    
