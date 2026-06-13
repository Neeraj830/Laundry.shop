import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import LoadingSpinner from '../components/common/LoadingSpinner';

export default function AdminRoute({ children }) {
  const { user, profile, loading } = useAuthStore();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // If not logged in, redirect to home and let ProtectedRoute style logic handle
  if (!user) {
    return <Navigate to="/" replace />;
  }

  // Check role inside profile table
  if (profile?.role !== 'admin') {
    return <Navigate to="/access-denied" replace />;
  }

  return children;
}
