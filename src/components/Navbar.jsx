import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Menu, X, Home, Bed, Users, CreditCard, LayoutDashboard, LogOut, UserCircle } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { logout, user } = useAuth();

  const navLinks = [
    { name: "Home", path: "/", icon: Home },
    ...(user ? [{ name: "Dashboard", path: "/dashboard", icon: LayoutDashboard }] : []),
    { name: "Rooms", path: "/rooms", icon: Bed },
    ...(user?.role === 'admin' || user?.email === 'chemistryhero1@gmail.com' ? [
      { name: "Admin", path: "/admin", icon: LayoutDashboard },
      { name: "Tenants", path: "/tenants", icon: Users },
      { name: "Payments", path: "/payments", icon: CreditCard },
      { name: "Manage Rooms", path: "/admin/rooms", icon: Bed },
    ] : []),
  ];

  return (
    <nav className="bg-white dark:bg-gray-900 sticky top-0 z-50 shadow-sm border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link 
              to="/" 
              className="text-2xl font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent hover:from-blue-500 hover:to-indigo-500 transition-all duration-300"
            >
              SmartRoom
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-1">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                className={({ isActive }) =>
                  `px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 group ${
                    isActive
                      ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                      : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white"
                  }`
                }
              >
                <link.icon className={`w-4 h-4 transition-transform duration-200 group-hover:scale-110 ${
                  link.name === "Admin" ? "text-purple-500" : ""
                }`} />
                <span>{link.name}</span>
              </NavLink>
            ))}
          </div>

          {/* User Menu - Desktop */}
          <div className="hidden md:flex md:items-center md:space-x-3">
            {user ? (
              <>
                <div className="flex items-center space-x-3 px-3 py-1.5 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                  <UserCircle className="w-5 h-5 text-gray-400" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                    {user.name}
                  </span>
                </div>
                <button
                  onClick={logout}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 transition-all duration-200 group"
                >
                  <LogOut className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white transition-all duration-200"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 rounded-lg text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 transition-all duration-200 shadow-sm hover:shadow"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 focus:outline-none transition-colors duration-200"
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div
        className={`md:hidden transition-all duration-300 ease-in-out ${
          isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0 overflow-hidden"
        }`}
      >
        <div className="px-4 pt-2 pb-3 space-y-1 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
          {navLinks.map((link) => (
            <NavLink
              key={link.name}
              to={link.path}
              onClick={() => setIsOpen(false)}
              className={({ isActive }) =>
                `px-4 py-3 rounded-lg text-base font-medium flex items-center gap-3 transition-all duration-200 ${
                  isActive
                    ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                    : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white"
                }`
              }
            >
              <link.icon className="w-5 h-5" />
              <span>{link.name}</span>
            </NavLink>
          ))}
          
          {/* Mobile User Section */}
          {user ? (
            <>
              <div className="px-4 py-3 mt-2 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3">
                  <UserCircle className="w-5 h-5 text-gray-400" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                    {user.name}
                  </span>
                </div>
              </div>
              <button
                onClick={() => {
                  logout();
                  setIsOpen(false);
                }}
                className="w-full px-4 py-3 rounded-lg text-base font-medium text-gray-600 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 flex items-center gap-3 transition-all duration-200"
              >
                <LogOut className="w-5 h-5" />
                <span>Logout</span>
              </button>
            </>
          ) : (
            <div className="pt-4 space-y-2">
              <Link
                to="/login"
                onClick={() => setIsOpen(false)}
                className="block w-full px-4 py-3 text-center rounded-lg text-base font-medium text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
              >
                Login
              </Link>
              <Link
                to="/register"
                onClick={() => setIsOpen(false)}
                className="block w-full px-4 py-3 text-center rounded-lg text-base font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 transition-all duration-200"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;