import React from "react";
    import { useRoom } from "../context/RoomContext";
    import { 
    Search, 
    Download, 
    Bell, 
    CheckCircle2, 
    Clock, 
    AlertCircle,
    MessageCircle
    } from "lucide-react";

    const PaymentTracker = () => {
    const { payments, loading, updatePayment } = useRoom();

    if (loading) return <div className="text-slate-400">Loading payments...</div>;

    const sendWhatsAppReminder = (phone, name) => {
        const message = `Hi ${name}, this is a reminder regarding your rent payment for this month. Please ignore if already paid.`;
        window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank');
    };

    const handleMarkAsPaid = async (id) => {
        try {
            await updatePayment(id, { status: "Paid" });
        } catch (error) {
            alert("Failed to update payment");
        }
    };

    return (
        <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
            <h2 className="text-2xl font-bold">Payment Tracking 💰</h2>
            <p className="text-slate-400">Track rent status and send auto-reminders.</p>
            </div>
            <div className="flex gap-3">
            <button className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 px-4 py-2 rounded-xl transition-all border border-slate-700/50">
                <Download size={18} />
                Export CSV
            </button>
            <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-xl transition-all font-medium">
                <Bell size={18} />
                Reminder All
            </button>
            </div>
        </div>

        {/* Filters */}
        <div className="glass-card p-4 flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
                type="text" 
                placeholder="Search tenant or room..." 
                className="w-full bg-[#161e2e] border border-slate-700/50 rounded-xl py-2.5 pl-10 pr-4 focus:ring-2 focus:ring-blue-500/20 outline-none"
            />
            </div>
            <div className="flex gap-2 w-full md:w-auto">
            <select className="bg-[#161e2e] border border-slate-700/50 rounded-xl py-2.5 px-4 outline-none">
                <option>All Status</option>
                <option>Paid</option>
                <option>Unpaid</option>
            </select>
            </div>
        </div>

        {/* Payments Table */}
        <div className="glass-card overflow-hidden">
            <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
                <thead>
                <tr className="border-b border-slate-700/50 bg-slate-800/30">
                    <th className="px-6 py-4 text-xs uppercase text-slate-400 font-bold">Tenant & Room</th>
                    <th className="px-6 py-4 text-xs uppercase text-slate-400 font-bold">Amount</th>
                    <th className="px-6 py-4 text-xs uppercase text-slate-400 font-bold">Due Date</th>
                    <th className="px-6 py-4 text-xs uppercase text-slate-400 font-bold">Status</th>
                    <th className="px-6 py-4 text-xs uppercase text-slate-400 font-bold">Actions</th>
                </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/30">
                {payments.map((payment) => (
                    <tr 
                    key={payment._id} 
                    className={`hover:bg-slate-800/20 transition-colors ${payment.status === 'Unpaid' ? 'bg-rose-500/5' : ''}`}
                    >
                    <td className="px-6 py-4">
                        <div>
                        <p className="font-semibold text-slate-200">{payment.tenant?.user?.name || 'Tenant'}</p>
                        <p className="text-xs text-slate-400">Room {payment.tenant?.room?.roomNumber || 'N/A'}</p>
                        </div>
                    </td>
                    <td className="px-6 py-4 font-bold text-slate-100">
                        ₹{payment.amount}
                    </td>
                    <td className="px-6 py-4 text-slate-300">
                        {new Date(payment.dueDate).toLocaleDateString(undefined, { day: 'numeric', month: 'short' })}
                    </td>
                    <td className="px-6 py-4">
                        <span 
                            onClick={() => payment.status === 'Unpaid' && handleMarkAsPaid(payment._id)}
                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border cursor-pointer transition-all hover:opacity-80 ${
                        payment.status === 'Paid' 
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                            : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                        }`}>
                        {payment.status === 'Paid' ? <CheckCircle2 size={12} /> : <Clock size={12} />}
                        {payment.status}
                        </span>
                    </td>
                    <td className="px-6 py-4">
                        <div className="flex gap-2">
                        {payment.status === 'Unpaid' && (
                            <button 
                            onClick={() => sendWhatsAppReminder(payment.tenant?.phone, payment.tenant?.user?.name)}
                            className="flex items-center gap-2 bg-emerald-600/10 text-emerald-400 border border-emerald-500/20 px-3 py-1.5 rounded-lg hover:bg-emerald-600 hover:text-white transition-all text-xs font-semibold"
                            >
                            <MessageCircle size={14} />
                            WhatsApp
                            </button>
                        )}
                        <button className="p-1.5 hover:bg-slate-700 rounded-lg text-slate-400 transition-colors">
                            <AlertCircle size={18} />
                        </button>
                        </div>
                    </td>
                    </tr>
                ))}
                </tbody>
            </table>
            </div>
            
            {payments.length === 0 && !loading && (
            <div className="p-12 text-center text-slate-500">
                No payment history available yet.
            </div>
            )}
        </div>
        </div>
    );
    };

    export default PaymentTracker;
    
