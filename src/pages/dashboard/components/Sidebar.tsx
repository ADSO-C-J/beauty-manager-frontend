import { Link, useLocation } from "react-router";
import {
  LayoutDashboard,
  Calendar,
  Users,
  Scissors,
  Scan,
  BarChart3,
  Settings,
  LogOut,
  ChevronLeft,
  Menu,
} from "lucide-react";
import { useState } from "react";
import { useAuthStore, rolePermissions, type UserRole } from "@modules/auth/application/state/authStore";
import { cn } from "@components/utils";
import { ROUTES } from "@app/router/routes";

interface NavItem {
  label: string;
  icon: React.ElementType;
  path: string;
}

const allNavItems: NavItem[] = [
  { label: "Panel", icon: LayoutDashboard, path: ROUTES.DASHBOARD },
  { label: "Citas", icon: Calendar, path: ROUTES.DASHBOARD_APPOINTMENTS },
  { label: "Clientes", icon: Users, path: ROUTES.DASHBOARD_CLIENTS },
  { label: "Servicios", icon: Scissors, path: ROUTES.DASHBOARD_SERVICES },
  { label: "Análisis Facial", icon: Scan, path: ROUTES.DASHBOARD_FACIAL_ANALYSIS },
  { label: "Reportes", icon: BarChart3, path: ROUTES.DASHBOARD_REPORTS },
  { label: "Configuración", icon: Settings, path: ROUTES.DASHBOARD_SETTINGS },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  const allowedPaths = user?.role ? rolePermissions[user.role as UserRole] : [];

  const filteredNavItems = allNavItems.filter((item) =>
    allowedPaths.some(
      (allowedPath) =>
        item.path === allowedPath || item.path.startsWith(allowedPath + "/")
    )
  );

  const isActive = (path: string) => {
    if (path === ROUTES.DASHBOARD) return location.pathname === ROUTES.DASHBOARD;
    return location.pathname.startsWith(path);
  };

  return (
    <>
      {/* Mobile toggle */}
      <button
        className="fixed top-4 left-4 z-50 md:hidden p-2 rounded-lg bg-white shadow-md"
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        <Menu className="w-5 h-5 text-[#4A5568]" />
      </button>

      {/* Overlay for mobile */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed md:sticky top-0 left-0 h-screen bg-white border-r border-gray-200 z-50 transition-all duration-300 flex flex-col",
          collapsed ? "w-16" : "w-64",
          mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        {/* Logo */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
          {!collapsed && (
            <Link to={ROUTES.DASHBOARD} className="text-xl font-semibold text-[#2D3748] whitespace-nowrap">
              BeautyManager
            </Link>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden md:block p-1.5 rounded-lg hover:bg-gray-100 text-[#4A5568]"
          >
            <ChevronLeft className={cn("w-5 h-5 transition-transform", collapsed && "rotate-180")} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
          {filteredNavItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setMobileOpen(false)}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors",
                isActive(item.path)
                  ? "bg-[#4A5568] text-white"
                  : "text-[#4A5568] hover:bg-gray-100"
              )}
            >
              <item.icon className="w-5 h-5 min-w-5" />
              {!collapsed && <span className="text-sm font-medium">{item.label}</span>}
            </Link>
          ))}
        </nav>

        {/* Logout */}
        <div className="px-2 py-4 border-t border-gray-200">
          <button
            onClick={() => {
              logout();
              window.location.href = ROUTES.LOGIN;
            }}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors w-full text-[#E53E3E] hover:bg-red-50"
            )}
          >
            <LogOut className="w-5 h-5 min-w-5" />
            {!collapsed && <span className="text-sm font-medium">Cerrar sesión</span>}
          </button>
        </div>
      </aside>
    </>
  );
}