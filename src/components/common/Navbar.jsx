import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, LogOut, User, Settings, Shield, ShoppingBag, LayoutDashboard, Calendar } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { useModalStore } from '../../store/useModalStore';

export default function Navbar() {
  const { user, profile, signOut } = useAuthStore();
  const { openAuth, openBooking } = useModalStore();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menus on path changes
  useEffect(() => {
    setMobileMenuOpen(false);
    setProfileDropdownOpen(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  const isAdmin = profile?.role === 'admin';

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-40 transition-all duration-300 ${
        scrolled
          ? 'glass-nav shadow-md py-3'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-green-600 flex items-center justify-center shadow-md shadow-emerald-200 group-hover:scale-105 transition-transform">
              <span className="text-white font-black text-xl">L</span>
            </div>
            <span className="font-extrabold text-xl text-slate-800 tracking-tight">
              Laundry<span className="text-emerald-500">Shop</span>
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              to="/"
              className={`text-sm font-semibold hover:text-emerald-600 transition-colors ${
                location.pathname === '/' ? 'text-emerald-500' : 'text-slate-600'
              }`}
            >
              Home
            </Link>
            <Link
              to="/services"
              className={`text-sm font-semibold hover:text-emerald-600 transition-colors ${
                location.pathname === '/services' ? 'text-emerald-500' : 'text-slate-600'
              }`}
            >
              Services
            </Link>
            <Link
              to="/about"
              className={`text-sm font-semibold hover:text-emerald-600 transition-colors ${
                location.pathname === '/about' ? 'text-emerald-500' : 'text-slate-600'
              }`}
            >
              About
            </Link>
            <Link
              to="/contact"
              className={`text-sm font-semibold hover:text-emerald-600 transition-colors ${
                location.pathname === '/contact' ? 'text-emerald-500' : 'text-slate-600'
              }`}
            >
              Contact
            </Link>
          </div>

          {/* Action buttons / User Controls */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <div className="relative">
                {/* User Avatar Action */}
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-100 transition-colors"
                >
                  <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-emerald-100 to-green-200 text-emerald-700 flex items-center justify-center font-bold text-sm overflow-hidden border border-emerald-300">
                    {profile?.avatar_url ? (
                      <img src={profile.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                      <span>{profile?.full_name?.charAt(0).toUpperCase() || 'U'}</span>
                    )}
                  </div>
                  <span className="text-sm font-bold text-slate-700 max-w-[120px] truncate">
                    {profile?.full_name || 'My Account'}
                  </span>
                </button>

                {/* Profile dropdown */}
                <AnimatePresence>
                  {profileDropdownOpen && (
                    <>
                      <div className="fixed inset-0 z-0" onClick={() => setProfileDropdownOpen(false)} />
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute right-0 mt-2 w-56 rounded-2xl bg-white shadow-lg border border-slate-100 p-2 z-10"
                      >
                        {isAdmin && (
                          <>
                            <Link
                              to="/admin"
                              className="flex items-center gap-2.5 px-4 py-2.5 hover:bg-slate-50 text-slate-700 rounded-xl text-sm font-semibold transition-colors"
                            >
                              <Shield size={16} className="text-emerald-500" />
                              Admin Panel
                            </Link>
                            <Link
                              to="/dashboard"
                              className="flex items-center gap-2.5 px-4 py-2.5 hover:bg-slate-50 text-slate-700 rounded-xl text-sm font-semibold transition-colors"
                            >
                              <LayoutDashboard size={16} className="text-emerald-500" />
                              Dashboard
                            </Link>
                          </>
                        )}
                        <Link
                          to="/orders"
                          className="flex items-center gap-2.5 px-4 py-2.5 hover:bg-slate-50 text-slate-700 rounded-xl text-sm font-semibold transition-colors"
                        >
                          <ShoppingBag size={16} className="text-emerald-500" />
                          My Orders
                        </Link>
                        <Link
                          to="/profile"
                          className="flex items-center gap-2.5 px-4 py-2.5 hover:bg-slate-50 text-slate-700 rounded-xl text-sm font-semibold transition-colors"
                        >
                          <User size={16} className="text-emerald-500" />
                          My Profile
                        </Link>
                        <div className="h-px bg-slate-100 my-1" />
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-2.5 px-4 py-2.5 hover:bg-rose-50 text-rose-600 rounded-xl text-sm font-semibold transition-colors text-left"
                        >
                          <LogOut size={16} />
                          Log Out
                        </button>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <button
                  onClick={() => openAuth('login')}
                  className="px-4 py-2.5 text-slate-600 hover:text-emerald-600 text-sm font-semibold transition-colors"
                >
                  Log In
                </button>
                <button
                  onClick={() => openAuth('register')}
                  className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-sm font-semibold shadow-md shadow-emerald-100 hover:shadow-lg transition-all"
                >
                  Register
                </button>
              </div>
            )}
          </div>

          {/* Mobile hamburger menu */}
          <div className="flex md:hidden items-center gap-2">
            {user && isAdmin && (
              <Link
                to="/dashboard"
                className="p-1.5 text-slate-500 hover:text-emerald-500 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <LayoutDashboard size={20} />
              </Link>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-600 hover:text-emerald-600 transition-colors"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer menu overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.3 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-slate-900 z-30 md:hidden"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.25 }}
              className="fixed top-0 right-0 h-screen w-72 bg-white shadow-xl z-40 p-6 flex flex-col md:hidden"
            >
              <div className="flex justify-between items-center mb-8">
                <span className="font-extrabold text-lg text-slate-800">
                  Menu
                </span>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1 text-slate-500 hover:text-slate-800"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Navigation list */}
              <div className="flex flex-col gap-4 mb-8">
                <Link
                  to="/"
                  className="text-slate-600 hover:text-emerald-500 font-bold text-base py-1"
                >
                  Home
                </Link>
                <Link
                  to="/services"
                  className="text-slate-600 hover:text-emerald-500 font-bold text-base py-1"
                >
                  Services
                </Link>
                <Link
                  to="/about"
                  className="text-slate-600 hover:text-emerald-500 font-bold text-base py-1"
                >
                  About
                </Link>
                <Link
                  to="/contact"
                  className="text-slate-600 hover:text-emerald-500 font-bold text-base py-1"
                >
                  Contact
                </Link>
              </div>

              <div className="h-px bg-slate-100 my-4" />

              {/* User dashboard sections on mobile */}
              <div className="flex-grow flex flex-col justify-between">
                <div>
                  {user ? (
                    <div className="flex flex-col gap-3">
                      {isAdmin && (
                        <Link
                          to="/admin"
                          className="flex items-center gap-2.5 px-3 py-2 text-slate-700 font-semibold rounded-lg hover:bg-slate-50"
                        >
                          <Shield size={18} className="text-emerald-500" />
                          Admin Control
                        </Link>
                      )}
                      {isAdmin && (
                        <Link
                          to="/dashboard"
                          className="flex items-center gap-2.5 px-3 py-2 text-slate-700 font-semibold rounded-lg hover:bg-slate-50"
                        >
                          <LayoutDashboard size={18} className="text-emerald-500" />
                          Dashboard
                        </Link>
                      )}
                      <Link
                        to="/orders"
                        className="flex items-center gap-2.5 px-3 py-2 text-slate-700 font-semibold rounded-lg hover:bg-slate-50"
                      >
                        <ShoppingBag size={18} className="text-emerald-500" />
                        My Orders
                      </Link>
                      <Link
                        to="/profile"
                        className="flex items-center gap-2.5 px-3 py-2 text-slate-700 font-semibold rounded-lg hover:bg-slate-50"
                      >
                        <User size={18} className="text-emerald-500" />
                        My Profile
                      </Link>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-3">
                      <button
                        onClick={() => openAuth('login')}
                        className="w-full py-2.5 border border-slate-200 text-slate-600 rounded-xl font-semibold hover:bg-slate-50"
                      >
                        Log In
                      </button>
                      <button
                        onClick={() => openAuth('register')}
                        className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-semibold shadow-md"
                      >
                        Register
                      </button>
                    </div>
                  )}
                </div>

                {user && (
                  <button
                    onClick={handleLogout}
                    className="w-full py-3 border border-rose-200 text-rose-600 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-rose-50 transition-colors"
                  >
                    <LogOut size={16} />
                    Log Out
                  </button>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
}
