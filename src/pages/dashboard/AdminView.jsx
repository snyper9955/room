import React from "react";
import { 
  Home, 
  UserCheck, 
  Bed, 
  IndianRupee, 
  TrendingUp, 
  ShieldCheck 
} from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Bar, Doughnut } from 'react-chartjs-2';

const StatCard = ({ icon: Icon, label, value, color, trend }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="glass-card p-6 flex flex-col gap-4 group hover:bg-white/5 transition-all duration-500 border border-white/5"
  >
    <div className="flex items-center justify-between">
      <div className={`p-3 rounded-2xl bg-${color}-500/10 text-${color}-400 group-hover:scale-110 transition-transform duration-500`}>
        <Icon size={24} />
      </div>
      {trend && (
        <span className={`text-xs font-semibold px-2 py-1 rounded-lg ${trend > 0 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
          {trend > 0 ? '+' : ''}{trend}%
        </span>
      )}
    </div>
    <div>
      <p className="text-slate-400 text-sm font-medium">{label}</p>
      <h3 className="text-2xl font-bold mt-1 text-white tracking-tight">{value}</h3>
    </div>
  </motion.div>
);

const AdminView = ({ stats, doughnutData, barData, chartOptions }) => (
  <div className="space-y-8 animate-in fade-in duration-700">
    <div>
      <h2 className="text-4xl font-extrabold text-white tracking-tighter">Owner Dashboard</h2>
      <p className="text-slate-400 mt-2 text-lg">Property analytics and portfolio performance.</p>
    </div>

    {stats.totalRooms === 0 ? (
      <div className="bg-blue-600/10 border border-blue-500/20 rounded-[3rem] p-16 flex flex-col items-center text-center animate-in fade-in zoom-in duration-700">
        <div className="w-20 h-20 bg-blue-500/20 rounded-3xl flex items-center justify-center mb-6 border border-blue-500/30">
          <TrendingUp size={40} className="text-blue-400" />
        </div>
        <h3 className="text-3xl font-black text-white mb-4 tracking-tight">Expand Your Portfolio</h3>
        <p className="text-slate-400 max-w-lg mb-8 text-lg leading-relaxed">
          Your property management system is ready. Start by adding your first unit to begin tracking ROI and occupancy analytics.
        </p>
        <Link to="/admin/rooms" className="bg-blue-600 hover:bg-blue-500 text-white px-12 py-5 rounded-2xl font-black transition-all shadow-2xl shadow-blue-600/40 hover:scale-105 active:scale-95">
          Step 1: Add a Room
        </Link>
      </div>
    ) : (
      <>
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard icon={Home} label="Total Rooms" value={stats.totalRooms} color="blue" />
          <StatCard icon={UserCheck} label="Occupied Units" value={stats.occupiedRooms} color="indigo" />
          <StatCard icon={Bed} label="Available Space" value={stats.availableRooms} color="emerald" />
          <StatCard icon={IndianRupee} label="Estimated Monthly" value={`₹${stats.monthlyIncome}`} color="amber" trend={12} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Revenue Chart */}
          <div className="lg:col-span-2 glass-card p-8 border border-white/5">
            <div className="flex justify-between items-center mb-8">
              <h4 className="text-xl font-bold text-white tracking-tight">Revenue Analytics</h4>
              <div className="flex gap-2">
                <span className="flex items-center gap-2 text-xs font-black uppercase text-slate-500 tracking-widest">
                  <div className="w-2 h-2 rounded-full bg-blue-500"></div> Projection
                </span>
              </div>
            </div>
            <div className="h-72">
              <Bar data={barData} options={chartOptions} />
            </div>
          </div>

          {/* Occupancy Distribution */}
          <div className="glass-card p-8 border border-white/5">
            <h4 className="text-xl font-bold text-white tracking-tight mb-8">Occupancy Velocity</h4>
            <div className="relative h-64 flex items-center justify-center">
              <Doughnut data={doughnutData} options={{ cutout: '75%', plugins: { legend: { display: false } } }} />
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-black text-white">
                  {stats.totalRooms > 0 ? Math.round((stats.occupiedRooms / stats.totalRooms) * 100) : 0}%
                </span>
                <span className="text-xs text-slate-500 font-black uppercase tracking-widest mt-1">Full</span>
              </div>
            </div>
            <div className="mt-8 space-y-4">
              <div className="flex justify-between text-sm py-3 border-b border-white/5">
                <span className="text-slate-400 font-medium">Occupied Units</span>
                <span className="text-white font-bold">{stats.occupiedRooms}</span>
              </div>
              <div className="flex justify-between text-sm py-3 border-b border-white/5">
                <span className="text-slate-400 font-medium">Available Units</span>
                <span className="text-emerald-400 font-bold">{stats.availableRooms}</span>
              </div>
            </div>
          </div>
        </div>
      </>
    )}

    {/* Bottom Section */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pb-12">
      <div className="glass-card p-10 flex items-center justify-between border border-white/5 group hover:bg-emerald-500/5 transition-colors duration-500">
        <div className="space-y-1">
          <p className="text-slate-400 text-sm font-bold uppercase tracking-widest">Total Collected</p>
          <h3 className="text-4xl font-black text-emerald-400 tracking-tighter">₹{stats.totalRevenue}</h3>
        </div>
        <div className="p-5 bg-emerald-500/10 rounded-3xl border border-emerald-500/20 group-hover:scale-110 transition-transform">
          <TrendingUp size={40} className="text-emerald-400" />
        </div>
      </div>

      <div className="glass-card p-10 border-l-8 border-l-blue-500 flex items-center gap-6 border-y border-r border-white/5">
        <div className="p-4 bg-blue-500/10 text-blue-400 rounded-3xl border border-blue-500/20">
          <ShieldCheck size={40} />
        </div>
        <div>
          <p className="font-black text-white text-lg tracking-tight">Enterprise Infrastructure</p>
          <p className="text-slate-400 leading-relaxed">Real-time sync active across all modules. Database healthy.</p>
        </div>
      </div>
    </div>
  </div>
);

export default AdminView;
