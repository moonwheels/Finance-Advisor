import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AppLoadingState from './AppLoadingState';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <AppLoadingState title="Loading your account" message="Checking your session and preparing the app..." />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
