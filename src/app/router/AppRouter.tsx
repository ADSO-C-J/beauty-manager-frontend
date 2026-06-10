import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ROUTES } from './routes';
import AuthGuard from './guards/AuthGuard';
import GuestGuard from './guards/GuestGuard';
import NotFoundPage from '../../ui/errors/NotFoundPage';
import Login from '../../modules/auth/page/login/Login';
import LandingPage from '../../ui/landingPage/Landing';
import Register from '../../modules/auth/page/register/Register';

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rutas públicas (solo para usuarios no autenticados) */}
        <Route element={<GuestGuard />}>
          <Route path={ROUTES.LANDING} element={<LandingPage />} />
          <Route path={ROUTES.LOGIN} element={<Login />} />
          <Route path={ROUTES.REGISTER} element={<Register />} />
        </Route>

        {/* Rutas protegidas (requieren autenticación) */}
        <Route element={<AuthGuard />}>
          <Route path={ROUTES.HOME} element={<div>Home Page</div>} />
        </Route>

        {/* Ruta 404 — debe ir siempre al final */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
