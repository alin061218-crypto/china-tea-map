// Guards the admin route for signed-in administrators.
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export default function AdminGuard({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[var(--paper)] text-[var(--ink-faint)]">
        加载中...
      </div>
    );
  }

  if (!user || user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return children;
}
