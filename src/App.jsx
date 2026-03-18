import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/dashboard/Dashboard";
import RoomArchive from "./pages/dashboard/RoomArchive";
import RoomList from "./pages/RoomList";
import RoomDetail from "./pages/RoomDetail";
import TenantList from "./pages/TenantList";
import Home from "./pages/Home";
import PaymentTracker from "./pages/PaymentTracker";
import ExpenseManager from "./pages/ExpenseManager";
import { AuthProvider } from "./context/AuthContext";
import { RoomProvider } from "./context/RoomContext";
import { TenantProvider } from "./context/TenantContext";
import { BookingProvider } from "./context/BookingContext";
import { PaymentProvider } from "./context/PaymentContext";
import { AdminProvider } from "./context/AdminContext";
import "./index.css";

import ProtectedRoute from "./components/ProtectedRoute";
import AdminRooms from "./pages/admin/AdminRooms";
import AdminDashboard from "./pages/admin/AdminDashboard";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";
import UserProfile from "./pages/auth/UserProfile";
import TenantDetails from "./pages/admin/TenantDetails";
import RenterDetails from "./pages/admin/RenterDetails";
import Footer from "./components/Footer";

const App = () => {
  return (
    <AuthProvider>
      <AdminProvider>
        <RoomProvider>
          <TenantProvider>
            <BookingProvider>
              <PaymentProvider>
                <Router>
                  <div className="min-h-screen bg-[#0f172a] text-slate-200">
                    <Navbar />
                    <main className="">
                      <Routes>
                        {/* Public Routes */}
                        <Route path="/" element={<Home />} />
                        <Route path="/rooms" element={<RoomList />} />
                        <Route path="/rooms/:id" element={<RoomDetail />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/forgot-password" element={<ForgotPassword />} />
                        <Route path="/reset-password" element={<ResetPassword />} />

                        {/* Admin Routes */}
                        <Route path="/admin" element={<ProtectedRoute adminOnly={true}><AdminDashboard /></ProtectedRoute>} />
                        <Route path="/admin/rooms" element={<ProtectedRoute adminOnly={true}><AdminRooms /></ProtectedRoute>} />
                        <Route path="/tenants" element={<ProtectedRoute adminOnly={true}><TenantList /></ProtectedRoute>} />
                        <Route path="/tenants/:id" element={<ProtectedRoute adminOnly={true}><TenantDetails /></ProtectedRoute>} />
                        <Route path="/admin/renter/:id" element={<ProtectedRoute adminOnly={true}><RenterDetails /></ProtectedRoute>} />
                        <Route path="/payments" element={<ProtectedRoute adminOnly={true}><PaymentTracker /></ProtectedRoute>} />
                        <Route path="/expenses" element={<ProtectedRoute adminOnly={true}><ExpenseManager /></ProtectedRoute>} />

                        {/* Private User Routes */}
                        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                        <Route path="/dashboard/archive/:roomId" element={<ProtectedRoute><RoomArchive /></ProtectedRoute>} />
                        <Route path="/profile" element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />
                      </Routes>
                    </main>
                    <Footer />
                  </div>
                </Router>
              </PaymentProvider>
            </BookingProvider>
          </TenantProvider>
        </RoomProvider>
      </AdminProvider>
    </AuthProvider>
  );
};

export default App;
