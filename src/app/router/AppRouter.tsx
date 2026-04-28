import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ROUTES } from './routes';
import AuthGuard from './guards/AuthGuard';
import GuestGuard from './guards/GuestGuard';
import NotFoundPage from '../../ui/errors/NotFoundPage';

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rutas públicas (solo para usuarios no autenticados) */}
        <Route element={<GuestGuard />}>
          <Route path={ROUTES.LOGIN} element={<div>Login Page</div>} />
          <Route path={ROUTES.REGISTER} element={<div>Register Page</div>} />
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
