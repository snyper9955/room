import React, { useEffect, useState } from "react";
import { 
  Bed, 
  ShieldCheck, 
  Zap, 
  Calendar, 
  Clock, 
  ChevronRight, 
  ExternalLink,
  CreditCard
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { usePayment } from "../../context/PaymentContext";
import { useAuth } from "../../context/AuthContext";

const RenterView = ({ activeBookings, calculateRemainingDays }) => {
  const { createOrder, verifyPayment } = usePayment();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [paymentLoading, setPaymentLoading] = useState(null); // stores booking id being paid

  // Load Razorpay Script
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handlePayment = async (booking) => {
    if (!user) return alert("Please login to continue");
    
    setPaymentLoading(booking._id);
    try {
      // 1. Create Order
      const order = await createOrder({
        amount: booking.rentAmount || booking.room?.price,
        roomId: booking.room?._id,
        name: user.name,
        email: user.email,
        phone: user.phone || "9999999999"
      });

      // AUTO PAYMENT TEST MODE (Bypassing Razorpay for this demo/test env)
      const verificationData = {
        razorpay_order_id: order.orderId,
        razorpay_payment_id: "pay_test_" + Date.now(),
        razorpay_signature: "test_signature",
        roomId: booking.room?._id,
        name: user.name,
        email: user.email,
        phone: user.phone || "9999999999",
        amount: booking.rentAmount || booking.room?.price
      };
      
      const result = await verifyPayment(verificationData);
      if (result.success) {
        alert("Payment Successful! Your stay is now confirmed.");
        window.location.reload(); // Refresh to update status
      }
    } catch (error) {
      console.error("Payment Error:", error);
      alert("Payment failed. Please try again.");
    } finally {
      setPaymentLoading(null);
    }
  };
  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      <div>
        <h2 className="text-4xl font-extrabold text-white tracking-tighter">Your Living Dashboard</h2>
        <p className="text-slate-400 mt-2 text-lg">Manage your stays and view occupancy details for all your assigned rooms.</p>
      </div>

      {activeBookings.length === 0 ? (
        <div className="glass-card p-12 text-center flex flex-col items-center gap-6 border border-white/5">
          <div className="w-20 h-20 bg-blue-500/10 rounded-3xl flex items-center justify-center border border-blue-500/20">
            <Bed size={40} className="text-blue-400" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-white mb-2">No Active Bookings</h3>
            <p className="text-slate-400 max-w-sm mx-auto">You don't have an active stay yet. Explore our premium rooms and book your next space.</p>
          </div>
          <div className="flex gap-4">
            <Link to="/rooms" className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-bold hover:scale-105 transition-all shadow-xl shadow-blue-600/20">
              Browse Premium Rooms
            </Link>
            <button 
              onClick={() => window.location.reload()}
              className="bg-white/5 border border-white/10 text-white px-8 py-4 rounded-2xl font-bold hover:bg-white/10 transition-all"
            >
              Refresh Data
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-10">
          {activeBookings.map((booking) => (
            <div key={booking._id} className="grid lg:grid-cols-3 gap-8">
              {/* Main Status Column */}
              <div className="lg:col-span-2 space-y-8">
                <div className="p-8 rounded-[2.5rem] bg-linear-to-br from-indigo-600 to-blue-700 shadow-2xl relative overflow-hidden group">
                  <div className="relative z-10 flex flex-col md:flex-row items-center gap-8 text-white">
                    <div className="flex-1 text-center md:text-left space-y-2">
                       <div className="flex flex-wrap gap-2">
                          <span className="bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest border border-white/10">
                              {booking.status} Stay
                          </span>
                          {booking.paymentStatus === "pending" && (
                            <div className="flex flex-col sm:flex-row items-center gap-4">
                              <span className="bg-rose-500/20 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest border border-rose-500/30 text-rose-200">
                                  Payment Pending
                              </span>
                              <button 
                                onClick={() => handlePayment(booking)}
                                disabled={paymentLoading === booking._id}
                                className="bg-white text-blue-600 px-6 py-2 rounded-xl font-black text-sm hover:scale-105 transition-all shadow-lg flex items-center gap-2 disabled:opacity-50"
                              >
                                {paymentLoading === booking._id ? (
                                  <div className="w-4 h-4 border-2 border-blue-600/30 border-t-blue-600 rounded-full animate-spin" />
                                ) : (
                                  <>
                                    <CreditCard size={14} />
                                    Pay Now
                                  </>
                                )}
                              </button>
                            </div>
                          )}
                       </div>
                       <h4 className="text-4xl font-black">Room {booking.room?.roomNumber}</h4>
                       <p className="text-blue-100/80 font-medium">{booking.room?.type} Luxury Unit</p>
                    </div>
                  </div>
                   
                  {/* Background Decorative */}
                  <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-32 -mt-32" />
                  <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-400/10 rounded-full blur-2xl -ml-24 -mb-24" />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="glass-card p-8 border border-white/5 space-y-6 hover:bg-white/5 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-emerald-500/10 rounded-2xl text-emerald-400">
                        <ShieldCheck size={24} />
                      </div>
                      <h5 className="text-white font-bold text-lg">Occupancy Status</h5>
                    </div>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-slate-400">Official Joining Date</span>
                        <span className="text-white font-semibold">
                          {new Date(booking.joiningDate || booking.moveInDate).toDateString()}
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-slate-400">Days Remaining</span>
                        <span className="text-white font-semibold">
                           {calculateRemainingDays(booking)} Days
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-sm pt-4 border-t border-white/5">
                        <span className="text-slate-400">Monthly Rent</span>
                        <span className="text-emerald-400 font-bold">₹{booking.rentAmount || 'TBD'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="glass-card p-8 border border-white/5 space-y-6 hover:bg-white/5 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-blue-500/10 rounded-2xl text-blue-400">
                        <Zap size={24} />
                      </div>
                      <h5 className="text-white font-bold text-lg">Smart Controls</h5>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-3 py-1 bg-white/5 border border-white/5 rounded-lg text-xs font-bold text-slate-400">Digital Key: Active</span>
                      <span className="px-3 py-1 bg-white/5 border border-white/5 rounded-lg text-xs font-bold text-slate-400">AC Control: Online</span>
                      <span className="px-3 py-1 bg-white/5 border border-white/5 rounded-lg text-xs font-bold text-slate-400">WiFi Status: Ultra</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sidebar Area for current room */}
              <div className="space-y-8">
                 <div className="glass-card p-8 border border-white/5 text-center">
                    <Calendar className="mx-auto text-blue-400 mb-6" size={48} />
                    <h5 className="text-white font-black text-xl mb-3">Room History</h5>
                    <p className="text-slate-400 text-sm mb-6 leading-relaxed">View all your previous payments and documents for Room {booking.room?.roomNumber}.</p>
                    <Link 
                      to={`/dashboard/archive/${booking.room?._id}`}
                      className="w-full flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 text-white rounded-2xl py-4 font-bold transition-all group"
                    >
                       Open Archive
                       <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                 </div>

                 <div className="glass-card p-8 border border-white/5 bg-linear-to-b from-transparent to-rose-500/5">
                    <Clock className="text-rose-400 mb-6" size={32} />
                    <h5 className="text-white font-bold mb-2">Room Service</h5>
                    <p className="text-slate-400 text-sm leading-relaxed mb-6">Need maintenance for Room {booking.room?.roomNumber}? Concierge is available 24/7.</p>
                    <button className="flex items-center gap-2 text-rose-400 font-black text-sm uppercase tracking-tighter hover:text-white transition-colors">
                       <ExternalLink size={16} />
                       Contact Support
                    </button>
                 </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RenterView;
