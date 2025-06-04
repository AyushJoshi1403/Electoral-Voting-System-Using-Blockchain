import { Navigate } from 'react-router-dom';
import authService from '../utils/authService';

const ProtectedRoute = ({ children, requireAdmin = true }) => {
  const isLoggedIn = authService.isAdminLoggedIn();
  
  if (requireAdmin && !isLoggedIn) {
    return <Navigate to="/admin/login" />;
  }
  
  return children;
};

export default ProtectedRoute;