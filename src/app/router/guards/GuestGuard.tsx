import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../../../modules/auth/application/state/authStore';
import { ROUTES } from '../routes';

/**
 * GuestGuard — protege rutas que solo deben ver usuarios NO autenticados.
 * Si el usuario YA está autenticado, redirige al home.
 */
const GuestGuard = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (isAuthenticated) {
    return <Navigate to={ROUTES.HOME} replace />;
  }

  return <Outlet />;
};

export default GuestGuard;
