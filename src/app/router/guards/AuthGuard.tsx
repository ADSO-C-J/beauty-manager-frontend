import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../../../modules/auth/application/state/authStore';
import { ROUTES } from '../routes';

const AuthGuard = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  return <Outlet />;
};

export default AuthGuard;
