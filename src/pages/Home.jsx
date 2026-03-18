import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAdmin } from "../context/AdminContext";
import { useRoom } from "../context/RoomContext";
import { motion, AnimatePresence } from "framer-motion";
import { 
  MapPin, 
  ArrowRight, 
  Shield, 
  Zap, 
  Star, 
  Search,
  Home as HomeIcon,
  Users,
  CheckCircle,
  TrendingUp,
  Menu,
  X,
  ChevronDown,
  ChevronUp,
  Filter,
  IndianRupee,
  Wifi,
  Droplets,
  Zap as ZapIcon
} from "lucide-react";

const Home = () => {
  const { stats, loading: statsLoading } = useAdmin();
  const { rooms, loading: roomsLoading } = useRoom();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredRooms = (rooms || []).filter((room) => {
    const term = searchTerm.toLowerCase();
    return !searchTerm || 
      room.location?.toLowerCase().includes(term) || 
      room.roomNumber?.toString().toLowerCase().includes(term) ||
      room.type?.toLowerCase().includes(term);
  });

  const availableRooms = filteredRooms
    .filter((room) => room.status === "available")
    .slice(0, 6); // Show up to 6 rooms on larger screens

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  };

  const statsData = [
    { 
      label: "Total Rooms", 
      value: roomsLoading ? "..." : (rooms?.length || 0),
      icon: HomeIcon,
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-500/10",
      textColor: "text-blue-600 dark:text-blue-400"
    },
    { 
      label: "Available Now", 
      value: roomsLoading ? "..." : (filteredRooms.filter(r => r.status === "available").length),
      icon: CheckCircle,
      color: "from-emerald-500 to-emerald-600",
      bgColor: "bg-emerald-500/10",
      textColor: "text-emerald-600 dark:text-emerald-400"
    },
    { 
      label: "Happy Tenants", 
      value: statsLoading ? "..." : stats?.totalTenants || "50+",
      icon: Users,
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-500/10",
      textColor: "text-purple-600 dark:text-purple-400"
    },
    { 
      label: "Verified", 
      value: "100%",
      icon: Shield,
      color: "from-amber-500 to-amber-600",
      bgColor: "bg-amber-500/10",
      textColor: "text-amber-600 dark:text-amber-400"
    }
  ];

  const features = [
    {
      icon: Shield,
      title: "Secure Living",
      description: "24/7 security with smart locks and CCTV surveillance"
    },
    {
      icon: Zap,
      title: "Smart Features",
      description: "High-speed WiFi, smart meters, and digital payments"
    },
    {
      icon: Star,
      title: "Premium Comfort",
      description: "Fully furnished rooms with modern amenities"
    }
  ];

  const roomAmenities = [
    { icon: Wifi, label: "WiFi" },
    { icon: Droplets, label: "AC" },
    { icon: ZapIcon, label: "Power Backup" }
  ];

  const handleSearchChange = (value) => {
    setSearchTerm(value);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      


      {/* Hero Section - Mobile Optimized */}
      <section className="relative overflow-hidden pt-8 lg:pt-0">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-28">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 lg:px-4 lg:py-2 rounded-full bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 mb-6 lg:mb-8"
            >
              <TrendingUp className="w-3 h-3 lg:w-4 lg:h-4 text-blue-600 dark:text-blue-400" />
              <span className="text-xs lg:text-sm font-medium text-blue-600 dark:text-blue-400">
                Trusted by 500+ Tenants
              </span>
            </motion.div>

            <h1 className="text-3xl sm:text-4xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-4 lg:mb-6 leading-tight">
              Find Your Perfect
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                Smart Room
              </span>
            </h1>
            
            <p className="text-base sm:text-lg lg:text-xl text-gray-600 dark:text-gray-300 mb-8 lg:mb-10 max-w-2xl mx-auto px-4 lg:px-0">
              Discover smart, secure, and affordable rooms in Darbhanga. 
              Experience modern living with cutting-edge technology.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 lg:gap-4 px-4 lg:px-0">
              <Link
                to="/rooms"
                className="w-full sm:w-auto group inline-flex items-center justify-center gap-2 px-6 lg:px-8 py-3 lg:py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl text-sm lg:text-base"
              >
                Browse Available Rooms
                <ArrowRight className="w-4 h-4 lg:w-5 lg:h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              
             <button
             onClick={() => window.location.href = "tel:+919835958271"}
             className="w-full sm:w-auto group inline-flex items-center justify-center gap-2 px-6 lg:px-8 py-3 lg:py-4 rounded-xl font-semibold border border-gray-200  transition-all duration-200 text-sm lg:text-base"
             >
               Call Now
             </button>
            </div>
          </motion.div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-700 to-transparent"></div>
      </section>

      {/* Stats Section - Mobile Optimized */}
      <section className="py-12 lg:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-6">
          {statsData.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative group"
            >
              <div className={`absolute inset-0 bg-gradient-to-r ${stat.color} rounded-xl lg:rounded-2xl opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
              <div className="relative bg-white dark:bg-gray-800 rounded-xl lg:rounded-2xl p-4 lg:p-6 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-300">
                <div className={`inline-flex p-2 lg:p-3 rounded-lg lg:rounded-xl ${stat.bgColor} mb-2 lg:mb-4`}>
                  <stat.icon className={`w-4 h-4 lg:w-6 lg:h-6 ${stat.textColor}`} />
                </div>
                <p className="text-xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-1">
                  {stat.value}
                </p>
                <p className="text-xs lg:text-sm text-gray-500 dark:text-gray-400">
                  {stat.label}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Search Bar - Mobile Optimized */}
      <section className="px-4 sm:px-6 lg:px-8 pb-12 lg:pb-16 max-w-5xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-white dark:bg-gray-800 rounded-xl lg:rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-4 lg:p-6"
        >
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-blue-600" />
            <input
              type="text"
              placeholder="Search by room number, type, or location..."
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all text-lg shadow-inner"
            />
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-1"
              >
                <X size={20} />
              </button>
            )}
          </div>

        </motion.div>
      </section>

      {/* Features - Mobile Optimized */}
     

      {/* Available Rooms - Mobile Optimized */}
      <section className="py-12 lg:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 lg:mb-10">
          <div>
            <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-1 lg:mb-2">
              Available Rooms
            </h2>
            <p className="text-sm lg:text-base text-gray-600 dark:text-gray-400">
              Hand-picked rooms ready for you to move in
            </p>
          </div>
          <Link 
            to="/rooms" 
            className="hidden sm:flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium group text-sm lg:text-base"
          >
            View All
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {roomsLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
            {[1, 2, 3].map((n) => (
              <div key={n} className="bg-white dark:bg-gray-800 rounded-xl lg:rounded-2xl border border-gray-200 dark:border-gray-700 p-4 animate-pulse">
                <div className="h-40 sm:h-44 lg:h-48 bg-gray-200 dark:bg-gray-700 rounded-lg lg:rounded-xl mb-4"></div>
                <div className="h-5 lg:h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-3"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-4"></div>
                <div className="flex justify-between">
                  <div className="h-6 lg:h-8 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
                  <div className="h-6 lg:h-8 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
                </div>
              </div>
            ))}
          </div>
        ) : availableRooms.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
            {availableRooms.slice(0, 3).map((room, index) => (
              <motion.div
                key={room._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group"
              >
                <div className="bg-white dark:bg-gray-800 rounded-xl lg:rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-xl transition-all duration-300">
                  <div className="relative overflow-hidden h-40 sm:h-44 lg:h-48">
                    <img
                      src={room.images?.[0] || "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?ixlib=rb-4.0.3&auto=format&fit=crop&w=1171&q=80"}
                      alt={room.roomNumber}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute top-2 right-2 lg:top-3 lg:right-3 px-2 py-0.5 lg:px-3 lg:py-1 bg-emerald-500 text-white text-xs font-semibold rounded-full">
                      Available
                    </div>
                  </div>

                  <div className="p-4 lg:p-6">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-base lg:text-lg font-semibold text-gray-900 dark:text-white">
                        Room {room.roomNumber}
                      </h3>
                      <span className="px-2 py-0.5 lg:px-3 lg:py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-xs font-medium rounded-full">
                        {room.type}
                      </span>
                    </div>

                    <p className="text-xs lg:text-sm text-gray-600 dark:text-gray-400 mb-3 lg:mb-4 line-clamp-2">
                      {room.description || "Modern room with all amenities included."}
                    </p>

                    <div className="flex flex-wrap items-center gap-3 lg:gap-4 mb-3 lg:mb-4">
                      <div className="flex items-center gap-1 text-xs lg:text-sm text-gray-500 dark:text-gray-400">
                        <MapPin className="w-3 h-3 lg:w-4 lg:h-4" />
                        <span>Darbhanga</span>
                      </div>
                      <div className="flex items-center gap-1 text-xs lg:text-sm text-gray-500 dark:text-gray-400">
                        <Users className="w-3 h-3 lg:w-4 lg:h-4" />
                        <span>1-2 Persons</span>
                      </div>
                    </div>

                    {/* Mobile Amenities Preview */}
                    <div className="flex gap-2 mb-3 lg:hidden">
                      {roomAmenities.map((amenity, i) => (
                        <div key={i} className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                          <amenity.icon size={12} />
                          <span>{amenity.label}</span>
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center justify-between pt-3 lg:pt-4 border-t border-gray-200 dark:border-gray-700">
                      <div>
                        <span className="text-lg lg:text-2xl font-bold text-gray-900 dark:text-white">
                          ₹{room.price}
                        </span>
                        <span className="text-xs lg:text-sm text-gray-500 dark:text-gray-400">/mo</span>
                      </div>

                      <Link
                        to={`/rooms/${room._id}`}
                        className="inline-flex items-center gap-1 lg:gap-2 px-3 lg:px-4 py-1.5 lg:py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg lg:rounded-xl hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors group text-sm"
                      >
                        <span className="font-medium">View</span>
                        <ArrowRight className="w-3 h-3 lg:w-4 lg:h-4 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 lg:py-16 bg-white dark:bg-gray-800 rounded-xl lg:rounded-2xl border border-gray-200 dark:border-gray-700">
            <HomeIcon className="w-12 h-12 lg:w-16 lg:h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-base lg:text-lg text-gray-600 dark:text-gray-400">
              No rooms available at the moment
            </p>
            <p className="text-xs lg:text-sm text-gray-500 dark:text-gray-500 mt-2">
              Check back soon for new listings
            </p>
          </div>
        )}
         <section className="py-12 lg:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center mb-8 lg:mb-12"
        >
          <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-2 lg:mb-4">
            Why Choose SmartRoom?
          </h2>
          <p className="text-sm lg:text-base text-gray-600 dark:text-gray-400 max-w-2xl mx-auto px-4">
            Experience the perfect blend of comfort, security, and technology
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group"
            >
              <div className="bg-white dark:bg-gray-800 rounded-xl lg:rounded-2xl p-6 lg:p-8 border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 transition-all duration-300 shadow-sm hover:shadow-lg">
                <div className="inline-flex p-2 lg:p-3 rounded-lg lg:rounded-xl bg-blue-50 dark:bg-blue-900/20 mb-4 lg:mb-5 group-hover:scale-110 transition-transform">
                  <feature.icon className="w-5 h-5 lg:w-6 lg:h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-lg lg:text-xl font-semibold text-gray-900 dark:text-white mb-2 lg:mb-3">
                  {feature.title}
                </h3>
                <p className="text-sm lg:text-base text-gray-600 dark:text-gray-400">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

        {/* Mobile View All Link */}
        <div className="sm:hidden text-center mt-6">
          <Link 
            to="/rooms" 
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium text-sm"
          >
            View All Rooms
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* CTA Section - Mobile Optimized */}
      <section className="py-12 lg:py-20 px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl lg:rounded-3xl p-6 lg:p-12 text-center relative overflow-hidden"
        >
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
          
          <div className="relative">
            <h2 className="text-xl lg:text-4xl font-bold text-white mb-2 lg:mb-4">
              Ready to Find Your New Home?
            </h2>
            <p className="text-sm lg:text-base text-blue-100 mb-6 lg:mb-8 max-w-2xl mx-auto px-4">
              Join hundreds of happy tenants who found their perfect room with SmartRoom
            </p>
            <Link
              to="/register"
              className="inline-flex items-center gap-2 px-6 lg:px-8 py-3 lg:py-4 bg-white text-blue-600 rounded-xl lg:rounded-xl font-semibold hover:bg-gray-100 transition-all duration-200 shadow-lg hover:shadow-xl text-sm lg:text-base"
            >
              Get Started Now
              <ArrowRight className="w-4 h-4 lg:w-5 lg:h-5" />
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Floating Back to Top Button - Mobile Only */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-6 right-6 lg:hidden w-12 h-12 bg-blue-600 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-blue-700 transition-colors z-40"
        aria-label="Back to top"
      >
        <ChevronUp size={20} />
      </button>
    </div>
  );
};

export default Home;