import React, { useEffect, useState } from "react";
import { useAdmin } from "../../context/AdminContext";
import { useAuth } from "../../context/AuthContext";
import { useBooking } from "../../context/BookingContext";
import AdminView from "./AdminView";
import RenterView from "./RenterView";

const Dashboard = () => {
  const { stats, loading: adminLoading } = useAdmin();
  const { user } = useAuth();
  const { getMyBookings } = useBooking();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    if (!isAdmin) {
      const fetchMyData = async () => {
        try {
          const data = await getMyBookings();
          setBookings(data || []);
        } catch (error) {
          console.error("Dashboard: Fetch fail:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchMyData();
    } else {
      setLoading(false);
    }
  }, [getMyBookings, isAdmin]);

  if (adminLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-slate-400 text-center animate-pulse">
          <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin mx-auto mb-4" />
          Synchronizing your space...
        </div>
      </div>
    );
  }

  const calculateRemainingDays = (booking) => {
    let expiry = booking.expiryDate;
    if (!expiry && booking.moveInDate) {
      const fallbackDate = new Date(booking.moveInDate);
      fallbackDate.setDate(fallbackDate.getDate() + 30);
      expiry = fallbackDate;
    }
    if (!expiry) return 0;
    const diff = new Date(expiry) - new Date();
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  };

  const activeBookings = bookings.filter(b => 
    (b.status === 'approved' || b.status === 'pending') && b.status !== 'vacated'
  ).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const doughnutData = {
    labels: ['Occupied', 'Available'],
    datasets: [{
      data: [stats.occupiedRooms || 0, stats.availableRooms || 0],
      backgroundColor: ['rgba(59, 130, 246, 0.9)', 'rgba(30, 41, 59, 1)'],
      borderColor: ['rgba(255, 255, 255, 0.1)', 'rgba(255, 255, 255, 0.05)'],
      borderWidth: 2,
    }],
  };

  const barData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [{
      label: 'Revenue',
      data: [12000, 19000, 15000, 25000, 22000, stats.totalRevenue || 0],
      backgroundColor: 'rgba(59, 130, 246, 0.8)',
      borderRadius: 12,
      hoverBackgroundColor: 'rgba(59, 130, 246, 1)',
    }],
  };

  const chartOptions = {
    responsive: true, maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      y: { grid: { color: 'rgba(255, 255, 255, 0.03)' }, ticks: { color: '#64748b', font: { weight: 'bold' } } },
      x: { grid: { display: false }, ticks: { color: '#64748b', font: { weight: 'bold' } } },
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {isAdmin ? (
        <AdminView 
          stats={stats} 
          doughnutData={doughnutData} 
          barData={barData} 
          chartOptions={chartOptions} 
        />
      ) : (
        <RenterView 
          activeBookings={activeBookings} 
          calculateRemainingDays={calculateRemainingDays} 
        />
      )}
    </div>
  );
};

export default Dashboard;
