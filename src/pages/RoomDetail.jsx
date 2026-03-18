import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useRoom } from "../context/RoomContext";
import { usePayment } from "../context/PaymentContext";
import { useAuth } from "../context/AuthContext";
import { ChevronLeft, Check, Shield, Wifi, Home as HomeIcon, CreditCard, Sparkles } from "lucide-react";

const RoomDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getRoomById } = useRoom();
  const { createOrder, verifyPayment } = usePayment();
  const { user } = useAuth();
  
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const data = await getRoomById(id);
        setRoom(data);
      } catch (error) {
        console.error("Failed to fetch room:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchRoom();
  }, [id, getRoomById]);

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

  const handleBooking = async () => {
    if (!user) {
      alert("Please login to book a room");
      return;
    }

    setBookingLoading(true);
    try {
      // 1. Create Order on Backend
      const order = await createOrder({
        amount: room.price,
        roomId: room._id,
        name: user.name,
        email: user.email,
        phone: user.phone || "9999999999" // Fallback phone
      });

      // AUTO PAYMENT TEST MODE: Bypass Razorpay Modal
      console.log("AUTO PAYMENT TEST MODE ACTIVE");
      const verificationData = {
        razorpay_order_id: order.orderId,
        razorpay_payment_id: "pay_test_" + Date.now(),
        razorpay_signature: "test_signature",
        roomId: room._id,
        name: user.name,
        email: user.email,
        phone: user.phone || "9999999999",
        amount: room.price
      };
      
      const result = await verifyPayment(verificationData);
      if (result.success) {
        alert("TEST MODE: Payment Successful! Your room is booked for 1 month.");
        navigate("/dashboard");
      }

    } catch (error) {
      console.error("Booking Error:", error);
      alert("Failed to initiate booking. Please try again.");
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!room) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-white mb-4">Room Not Found</h2>
        <Link to="/rooms" className="text-blue-400 hover:text-blue-300">Back to Rooms</Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-700">
      {/* Navigation & Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <Link to="/rooms" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors group">
          <ChevronLeft className="group-hover:-translate-x-1 transition-transform" />
          Back to Listings
        </Link>
        <div className="flex items-center gap-3">
           <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest border ${
             room.status === "available" ? "bg-green-500/10 text-green-400 border-green-500/20" : "bg-orange-500/10 text-orange-400 border-orange-500/20"
           }`}>
             {room.status}
           </span>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-12">
        {/* Gallery Section */}
        <div className="space-y-4">
          <div className="aspect-video rounded-4xl overflow-hidden bg-slate-800 border border-white/5 relative shadow-2xl">
            <img 
              src={room.images?.[activeImage] || "https://placehold.co/1200x800?text=Premium+Space"} 
              alt="Room" 
              className="w-full h-full object-cover"
            />
            <div className="absolute top-6 left-6">
               <span className="bg-slate-900/80 backdrop-blur-md text-blue-400 text-xs font-black px-4 py-2 rounded-xl uppercase border border-white/10">
                 Room {room.roomNumber}
               </span>
            </div>
            {room.status !== "available" && (
               <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center">
                  <div className="text-center p-6 bg-slate-900/80 rounded-3xl border border-white/10">
                    <Shield className="mx-auto text-orange-400 mb-2" size={32} />
                    <p className="text-white font-bold text-lg uppercase tracking-tighter">Currently Occupied</p>
                  </div>
               </div>
            )}
          </div>
          
          {room.images?.length > 1 && (
            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
              {room.images.map((img, idx) => (
                <button 
                  key={idx}
                  onClick={() => setActiveImage(idx)}
                  className={`relative shrink-0 w-24 h-24 rounded-2xl overflow-hidden border-2 transition-all ${
                    activeImage === idx ? "border-blue-500 scale-105 shadow-lg" : "border-transparent opacity-50 hover:opacity-100"
                  }`}
                >
                  <img src={img} className="w-full h-full object-cover" alt={`Preview ${idx}`} />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="space-y-10">
          <div>
             <div className="flex items-center gap-2 text-blue-400 mb-2">
                <Sparkles size={16} />
                <span className="text-xs font-bold uppercase tracking-widest">Featured Listing</span>
             </div>
             <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 tracking-tight">
               {room.type} Exclusive Suite
             </h1>
             <p className="text-slate-400 text-lg leading-relaxed max-w-xl">
               {room.description || "Indulge in a space designed for modern living. This premium unit offers unmatched tranquility and high-end finishes in a prime location."}
             </p>
          </div>

          <div className="grid grid-cols-2 gap-6 bg-[#1e293b]/50 backdrop-blur-xl border border-white/5 p-8 rounded-[2.5rem]">
             <div>
                <p className="text-slate-500 text-xs uppercase font-bold tracking-widest mb-1">Monthly Investment</p>
                <div className="flex items-baseline gap-1">
                  <p className="text-3xl font-black text-white">₹{room.price}</p>
                  <p className="text-slate-500 text-xs font-medium">/ 30 Days</p>
                </div>
             </div>
             <div className="text-right">
                <p className="text-slate-500 text-xs uppercase font-bold tracking-widest mb-1">Type</p>
                <p className="text-2xl font-bold text-blue-400">{room.type}</p>
             </div>
          </div>

          <div className="space-y-6">
             <h3 className="text-xl font-bold text-white flex items-center gap-3">
               <Shield className="text-blue-500" size={24} />
               Included Amenities
             </h3>
             <div className="grid grid-cols-2 md:grid-cols-3 gap-y-6 gap-x-4">
               {room.amenities?.length > 0 ? room.amenities.map((amenity, idx) => (
                 <div key={idx} className="flex items-center gap-3 text-slate-300 group">
                    <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center group-hover:bg-blue-500 group-hover:text-white transition-all">
                       <Check size={16} />
                    </div>
                    <span className="font-medium">{amenity}</span>
                 </div>
               )) : (
                 <p className="text-slate-500 italic">Basic amenities included</p>
               )}
             </div>
          </div>

          {/* Razorpay Booking Card */}
          <div className="p-8 rounded-[2.5rem] bg-linear-to-br from-blue-600 to-indigo-700 shadow-2xl relative overflow-hidden group">
             <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
                <div className="flex-1 text-center md:text-left">
                   <h4 className="text-2xl font-bold text-white mb-2">Instant Reservations</h4>
                   <p className="text-blue-100 opacity-90">Secure this room for 1 month via Razorpay.</p>
                </div>
                {room.status === "available" ? (
                  <button 
                    onClick={handleBooking}
                    disabled={bookingLoading}
                    className="flex items-center gap-2 bg-white text-blue-600 px-10 py-5 rounded-2xl font-black shadow-xl hover:scale-105 transition-transform active:scale-95 disabled:opacity-50 disabled:scale-100"
                  >
                    {bookingLoading ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-blue-600"></div>
                    ) : (
                      <>
                        <CreditCard size={20} />
                        Pay & Book Now
                      </>
                    )}
                  </button>
                ) : (
                  <button className="bg-white/20 text-white/50 px-10 py-5 rounded-2xl font-black cursor-not-allowed">
                    Sold Out
                  </button>
                )}
             </div>
             
             {/* Background shapes */}
             <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl group-hover:scale-150 transition-transform duration-700" />
             <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full -ml-16 -mb-16 blur-2xl" />
          </div>
        </div>
      </div>
      
      {/* Infrastructure Details */}
      <section className="pt-16 pb-24">
         <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-[#1e293b]/30 p-8 rounded-3xl border border-white/5 hover:bg-[#1e293b]/50 transition-colors">
               <Wifi className="text-blue-500 mb-6" size={32} />
               <h5 className="text-white font-bold mb-3">Gigabit Connectivity</h5>
               <p className="text-slate-500 text-sm leading-relaxed">Experience zero-latency browsing with dedicated fiber backbone infrastructure.</p>
            </div>
            
            <div className="bg-[#1e293b]/30 p-8 rounded-3xl border border-white/5 hover:bg-[#1e293b]/50 transition-colors">
               <Shield className="text-blue-500 mb-6" size={32} />
               <h5 className="text-white font-bold mb-3">24/7 Premium Security</h5>
               <p className="text-slate-500 text-sm leading-relaxed">Integrated surveillance and smart lock systems ensure your peace of mind.</p>
            </div>

            <div className="bg-[#1e293b]/30 p-8 rounded-3xl border border-white/5 hover:bg-[#1e293b]/50 transition-colors">
               <HomeIcon className="text-blue-500 mb-6" size={32} />
               <h5 className="text-white font-bold mb-3">Concierge Services</h5>
               <p className="text-slate-500 text-sm leading-relaxed">Weekly maintenance and on-call support for all your living needs.</p>
            </div>
         </div>
      </section>
    </div>
  );
};

export default RoomDetail;
