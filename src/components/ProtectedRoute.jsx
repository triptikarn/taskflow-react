import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/** Route guard: only render children for a logged-in user. */
export default function ProtectedRoute({ children }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return children;
}
