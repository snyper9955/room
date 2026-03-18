import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { 
  ArrowLeft, 
  History, 
  Calendar, 
  IndianRupee, 
  FileText,
  ChevronRight,
  ShieldCheck,
  Clock
} from "lucide-react";
import { motion } from "framer-motion";
import { useBooking } from "../../context/BookingContext";

const RoomArchive = () => {
  const { roomId } = useParams();
  const { getMyBookings } = useBooking();
  const [roomData, setRoomData] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const allBookings = await getMyBookings();
        // Filter bookings for this specific room ID
        const roomBookings = allBookings.filter(b => b.room?._id === roomId);
        
        if (roomBookings.length > 0) {
          // Sort by date descending
          const sorted = roomBookings.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          setRoomData(sorted[0].room);
          setHistory(sorted);
        }
      } catch (error) {
        console.error("RoomArchive: Fetch fail", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [roomId, getMyBookings]);

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-slate-400 text-center animate-pulse">
        <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin mx-auto mb-4" />
        Opening Archive...
      </div>
    </div>
  );

  if (!roomData) return (
    <div className="max-w-4xl mx-auto px-4 py-20 text-center">
      <History size={64} className="mx-auto text-slate-600 mb-6" />
      <h2 className="text-2xl font-bold text-white mb-2">No History Found</h2>
      <p className="text-slate-400 mb-8">We couldn't find any historical records for this room.</p>
      <Link to="/dashboard" className="text-blue-400 font-bold hover:underline inline-flex items-center gap-2">
        <ArrowLeft size={16} /> Back to Dashboard
      </Link>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto px-4 py-12 space-y-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <Link to="/dashboard" className="text-blue-400 font-bold hover:underline inline-flex items-center gap-2 text-sm mb-4">
            <ArrowLeft size={16} /> Dashboard
          </Link>
          <h2 className="text-4xl font-black text-white tracking-tighter">Room {roomData.roomNumber} Archive</h2>
          <p className="text-slate-400">Complete historical record of your stays and transactions.</p>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-3xl p-6 flex items-center gap-4">
          <div className="p-3 bg-blue-500/10 rounded-2xl text-blue-400">
            <ShieldCheck size={24} />
          </div>
          <div>
            <p className="text-xs font-black uppercase tracking-widest text-slate-500">Current Status</p>
            <p className="text-white font-bold">{roomData.status}</p>
          </div>
        </div>
      </div>

      <div className="grid gap-8">
        <h3 className="text-xl font-bold text-white flex items-center gap-3">
          <History className="text-blue-400" size={24} />
          Booking History
        </h3>
        
        <div className="space-y-4">
          {history.map((booking, index) => (
            <motion.div 
              key={booking._id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="glass-card p-8 border border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-8 group hover:bg-white/5 transition-all"
            >
              <div className="flex items-center gap-6">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${
                  booking.status === 'approved' ? 'bg-emerald-500/10 text-emerald-400' :
                  booking.status === 'pending' ? 'bg-amber-500/10 text-amber-400' :
                  'bg-rose-500/10 text-rose-400'
                }`}>
                  <Calendar size={28} />
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <span className="text-white font-bold text-lg">Stay Period</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest ${
                      booking.status === 'approved' ? 'bg-emerald-500/20 text-emerald-400' :
                      booking.status === 'pending' ? 'bg-amber-500/20 text-amber-400' :
                      'bg-rose-500/20 text-rose-400'
                    }`}>
                      {booking.status}
                    </span>
                  </div>
                  <p className="text-slate-400 text-sm">
                    {new Date(booking.moveInDate).toDateString()} — {new Date(booking.expiryDate || booking.createdAt).toDateString()}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-8">
                <div className="text-right">
                  <p className="text-xs font-black uppercase tracking-widest text-slate-500 mb-1">Monthly Rent</p>
                  <p className="text-emerald-400 font-black text-xl">₹{booking.rentAmount || 'N/A'}</p>
                </div>
                <button className="flex items-center gap-2 bg-white/5 hover:bg-white/10 text-white px-6 py-3 rounded-xl font-bold transition-all border border-white/5">
                  <FileText size={18} className="text-blue-400" />
                  Receipt
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="p-8 rounded-[2.5rem] bg-linear-to-r from-blue-600/10 to-transparent border border-blue-500/20 flex flex-col md:flex-row items-center gap-8">
        <div className="p-4 bg-blue-500/10 rounded-3xl text-blue-400">
           <Clock size={40} />
        </div>
        <div className="flex-1 text-center md:text-left">
          <h4 className="text-xl font-bold text-white mb-2">Detailed Transaction Logs</h4>
          <p className="text-slate-400">Need a full breakdown of all electricity, maintenance, and rent payments? Contact the property manager for a certified statement.</p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-2xl font-black transition-all">
          Request Statement
        </button>
      </div>
    </div>
  );
};

export default RoomArchive;
