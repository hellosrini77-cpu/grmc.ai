import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children }) {
  const { currentUser, isSubscribed } = useAuth();

  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  if (!isSubscribed) {
    return <Navigate to="/pricing" />;
  }

  return children;
}
