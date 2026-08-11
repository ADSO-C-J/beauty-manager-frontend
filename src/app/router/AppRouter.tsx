import { createBrowserRouter } from "react-router";
import LandingPage from '@ui/landingPage/Landing';
import Login from '@pages/login/Login';
import Register from '@pages/register/Register';
import DashboardLayout from '@pages/dashboard/DashboardLayout';
import Dashboard from '@pages/dashboard/Dashboard';
import Appointments from '@pages/dashboard/appointments/Appointments';
import Clients from '@pages/dashboard/clients/Clients';
import ClientDetail from '@pages/dashboard/clients/ClientDetail';
import Services from '@pages/dashboard/services/Services';
import FacialAnalysis from '@pages/dashboard/facial-analysis/FacialAnalysis';
import Reports from '@pages/dashboard/reports/Reports';
import Settings from '@pages/dashboard/settings/Settings';
import RoleBasedRoute from "./RoleBasedRoute";
import Scheduler from '@pages/dashboard/scheduler/scheduler';
import { ROUTES } from "./routes";

export const router = createBrowserRouter([
  {
    path: ROUTES.LANDING,
    element: <LandingPage />,
  },
  {
    path: ROUTES.LOGIN,
    element: <Login />,
  },
  {
    path: ROUTES.REGISTER,
    element: <Register />,
  },
  {
    path: ROUTES.DASHBOARD,
    element: (
      <RoleBasedRoute>
        <DashboardLayout />
      </RoleBasedRoute>
    ),
    children: [
      { index: true, element: <Dashboard /> },
      { path: "appointments", element: <Appointments /> },
      { path: "clients", element: <Clients /> },
      { path: "clients/:id", element: <ClientDetail /> },
      { path: "services", element: <Services /> },
      { path: "facial-analysis", element: <FacialAnalysis /> },
      { path: "reports", element: <Reports /> },
      { path: "settings", element: <Settings /> },
      { path: "scheduler", element: <Scheduler /> },
    ],
  },
]);
