import { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { useModalStore } from '../store/useModalStore';
import LoadingSpinner from '../components/common/LoadingSpinner';

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuthStore();
  const { openAuth } = useModalStore();
  const location = useLocation();

  useEffect(() => {
    if (!loading && !user) {
      // Open the login modal automatically upon redirecting
      openAuth('login');
    }
  }, [user, loading, openAuth]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!user) {
    // Redirect to home page but keep track of where they tried to go
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return children;
}
