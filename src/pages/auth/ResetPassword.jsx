import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, Key, Loader2, ArrowRight, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const ResetPassword = () => {
  const location = useLocation();
  const [email, setEmail] = useState(location.state?.email || '');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { resetPassword } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setIsLoading(true);

    try {
      const result = await resetPassword(email, otp, newPassword);
      if (result.success) {
        setMessage(result.message || 'Password successfully reset.');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        setError(result.message || 'Failed to reset password. Please check your recovery code.');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-[#fafafa] px-4 py-12">
      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="max-w-md w-full"
      >
        <div className="text-center mb-10">
          <motion.h1 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-4xl font-light tracking-tight text-[#1a1a1a] mb-2"
          >
            New Access
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-[#666] font-light"
          >
            Create a secure new password for your SmartRoom account
          </motion.p>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-[#f0f0f0]">
          {error && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mb-6 p-4 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100 font-light"
            >
              {error}
            </motion.div>
          )}

          {message && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mb-6 p-4 bg-green-50 text-green-600 text-sm rounded-lg border border-green-100 font-light"
            >
              {message}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-widest text-[#999] font-medium ml-1">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#aaa]" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-[#fcfcfc] border border-[#eee] rounded-xl focus:outline-none focus:border-[#333] transition-colors font-light text-[#1a1a1a]"
                  placeholder="name@example.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs uppercase tracking-widest text-[#999] font-medium ml-1">Recovery Code (OTP)</label>
              <div className="relative">
                <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#aaa]" />
                <input
                  type="text"
                  required
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-[#fcfcfc] border border-[#eee] rounded-xl focus:outline-none focus:border-[#333] transition-colors font-light text-[#1a1a1a]"
                  placeholder="Enter Code"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs uppercase tracking-widest text-[#999] font-medium ml-1">New Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#aaa]" />
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-[#fcfcfc] border border-[#eee] rounded-xl focus:outline-none focus:border-[#333] transition-colors font-light text-[#1a1a1a]"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 mt-4 bg-[#1a1a1a] text-white rounded-xl font-light hover:bg-[#333] transition-all flex items-center justify-center group disabled:opacity-70"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  Reset Password
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>
        </div>

        <div className="text-center mt-8">
          <Link to="/login" title="Login Page" className="inline-flex items-center text-[#666] hover:text-[#1a1a1a] font-light text-sm transition-colors group">
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to login
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default ResetPassword;
