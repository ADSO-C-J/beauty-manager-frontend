import { Navigate, useLocation } from "react-router";
import { hasPermission, useAuthStore } from "@modules/auth/application/state/authStore";
import type { ReactNode } from "react";

interface RoleBasedRouteProps {
  children: ReactNode;
}

export default function RoleBasedRoute({ children }: RoleBasedRouteProps) {
  const user = useAuthStore((state) => state.user);
  const isLoading = useAuthStore((state) => state.isLoading);
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F7FAFC] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#4A5568] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#4A5568]">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!hasPermission(user.role, location.pathname)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}
