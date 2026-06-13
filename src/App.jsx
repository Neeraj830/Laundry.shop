import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Stores
import { useAuthStore } from './store/useAuthStore';

// Routes Guard Wrapper
import ProtectedRoute from './routes/ProtectedRoute';
import AdminRoute from './routes/AdminRoute';

// Layout Components
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import AuthModal from './components/auth/AuthModal';
import BookingModal from './components/booking/BookingModal';

// Public Screens
import Home from './pages/Home';
import Services from './pages/Services';
import About from './pages/About';
import Contact from './pages/Contact';
import AccessDenied from './pages/AccessDenied';
import NotFound from './pages/NotFound';

// User Dashboard Screens
import UserDashboard from './pages/dashboard/UserDashboard';
import UserProfile from './pages/dashboard/UserProfile';
import UserOrders from './pages/dashboard/UserOrders';
import OrderDetail from './pages/dashboard/OrderDetail';

// Admin Dashboard Screens
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageOrders from './pages/admin/ManageOrders';
import ManageServices from './pages/admin/ManageServices';
import ManageUsers from './pages/admin/ManageUsers';
import AdminSettings from './pages/admin/AdminSettings';

export default function App() {
  const { initialize } = useAuthStore();

  useEffect(() => {
    initialize();
  }, [initialize]);

  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-[#f8fafc]">
        {/* Toast Provider Notifications */}
        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              background: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(226, 232, 240, 0.8)',
              color: '#1e293b',
              fontWeight: '600',
              fontSize: '13px',
              borderRadius: '16px',
            },
          }}
        />

        {/* Global sticky Navbar */}
        <Navbar />

        {/* Dynamic Route Screen */}
        <main className="flex-grow">
          <Routes>
            {/* PUBLIC */}
            <Route path="/" element={<Home />} />
            <Route path="/services" element={<Services />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/access-denied" element={<AccessDenied />} />

            {/* PROTECTED CLIENT DASHBOARDS */}
            <Route
              path="/dashboard"
              element={
                <AdminRoute>
                  <UserDashboard />
                </AdminRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <UserProfile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/orders"
              element={
                <ProtectedRoute>
                  <UserOrders />
                </ProtectedRoute>
              }
            />
            <Route
              path="/orders/:id"
              element={
                <ProtectedRoute>
                  <OrderDetail />
                </ProtectedRoute>
              }
            />

            {/* PROTECTED ADMIN DASHBOARDS */}
            <Route
              path="/admin"
              element={
                <AdminRoute>
                  <AdminDashboard />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/orders"
              element={
                <AdminRoute>
                  <ManageOrders />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/services"
              element={
                <AdminRoute>
                  <ManageServices />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/users"
              element={
                <AdminRoute>
                  <ManageUsers />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/settings"
              element={
                <AdminRoute>
                  <AdminSettings />
                </AdminRoute>
              }
            />

            {/* FALLBACKS */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>

        {/* Modals structures */}
        <AuthModal />
        <BookingModal />

        {/* Global Footer */}
        <Footer />
      </div>
    </Router>
  );
}
