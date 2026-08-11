import { Outlet, Link, useLocation, useNavigate } from "react-router";
import {
  Home,
  Calendar,
  Users,
  Package,
  BarChart3,
  Settings,
  Bell,
  LogOut,
  Menu,
  X,
  Scan,
} from "lucide-react";
import { useState, useMemo } from "react";
import { Button } from "@components/button";
import { Avatar, AvatarFallback, AvatarImage } from "@components/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@components/dropdown-menu";
import { useAuthStore, hasPermission } from "@modules/auth/application/state/authStore";
import { Badge } from "@components/badge";
import { ROUTES } from "@app/router/routes";

const allNavigation = [
  { name: "Inicio", href: ROUTES.DASHBOARD, icon: Home },
  { name: "Citas", href: ROUTES.DASHBOARD_APPOINTMENTS, icon: Calendar },
  { name: "Clientes", href: ROUTES.DASHBOARD_CLIENTS, icon: Users },
  {name: "Agenda", href: ROUTES.DASHBOARD_SCHEDULER, icon: Calendar},
  { name: "Servicios", href: ROUTES.DASHBOARD_SERVICES, icon: Package },
  { name: "Análisis Facial", href: ROUTES.DASHBOARD_FACIAL_ANALYSIS, icon: Scan },
  { name: "Reportes", href: ROUTES.DASHBOARD_REPORTS, icon: BarChart3 },
  { name: "Configuración", href: ROUTES.DASHBOARD_SETTINGS, icon: Settings },
];

const roleLabels = {
  administrador: "Administrador",
  estilista: "Estilista",
  recepcionista: "Recepcionista",
  cliente: "Cliente",
};

const roleColors = {
  administrador: "bg-purple-500",
  estilista: "bg-blue-500",
  recepcionista: "bg-green-500",
  cliente: "bg-orange-500",
};

export default function DashboardLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigation = useMemo(() => {
    if (!user) return [];
    return allNavigation.filter((item) => hasPermission(user.role, item.href));
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate(ROUTES.LANDING);
  };

  return (
    <div className="min-h-screen bg-[#F7FAFC]">
      {/* Desktop sidebar */}
      <div className="hidden md:fixed md:inset-y-0 md:flex md:w-64 md:flex-col">
        <div className="flex flex-col flex-grow bg-white border-r border-gray-200">
          <div className="flex items-center h-16 px-6 border-b border-gray-200">
            <span className="text-2xl font-semibold text-[#2D3748]">BeautyManager</span>
          </div>
          <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive ? "bg-[#4A5568] text-white" : "text-[#4A5568] hover:bg-[#F7FAFC]"
                  }`}
                >
                  <item.icon className="w-5 h-5 shrink-0" />
                  <span className="truncate">{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Main content */}
      <div className="md:pl-64">
        <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
          <div className="flex items-center justify-between h-16 px-3 sm:px-6">
            <div className="flex items-center gap-3 min-w-0">
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden shrink-0 w-10 h-10"
                onClick={() => setSidebarOpen(!sidebarOpen)}
              >
                <Menu className="w-6 h-6" />
              </Button>
              <div className="min-w-0">
                <h1 className="text-base sm:text-lg font-semibold text-[#2D3748] truncate">
                  Bienvenido, {user?.name?.split(" ")[0] || "Usuario"}
                </h1>
                {user && (
                  <Badge className={`${roleColors[user.role]} text-white text-xs`}>
                    {roleLabels[user.role]}
                  </Badge>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <Button variant="ghost" size="icon" className="relative w-10 h-10">
                <Bell className="w-5 h-5 text-[#4A5568]" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-[#F56565] rounded-full"></span>
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="rounded-full focus:outline-none focus:ring-2 focus:ring-[#4A5568]">
                    <Avatar className="w-9 h-9">
                      <AvatarImage src={user?.avatar} />
                      <AvatarFallback className="bg-[#4A5568] text-white text-sm">
                        {user?.name
                          ?.split(" ")
                          .map((n: string) => n[0])
                          .join("")
                          .toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuLabel className="truncate">{user?.name}</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to={ROUTES.DASHBOARD_SETTINGS} className="w-full cursor-pointer">
                      Configuración
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                    <LogOut className="w-4 h-4 mr-2" />
                    Cerrar sesión
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        <main className="p-3 sm:p-6 lg:p-8 pb-24 md:pb-8">
          <Outlet />
        </main>
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="fixed inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
          <div className="fixed inset-y-0 left-0 w-[min(16rem,80vw)] bg-white flex flex-col shadow-xl">
            <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200 shrink-0">
              <span className="text-lg font-semibold text-[#2D3748]">BeautyManager</span>
              <Button
                variant="ghost"
                size="icon"
                className="w-10 h-10"
                onClick={() => setSidebarOpen(false)}
              >
                <X className="w-6 h-6" />
              </Button>
            </div>
            <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
              {navigation.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      isActive ? "bg-[#4A5568] text-white" : "text-[#4A5568] hover:bg-[#F7FAFC]"
                    }`}
                  >
                    <item.icon className="w-5 h-5 shrink-0" />
                    <span className="truncate">{item.name}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      )}

      {/* Bottom mobile nav */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 md:hidden z-20 safe-area-pb">
        <div className="flex justify-around py-1">
          {navigation.slice(0, 5).map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex flex-col items-center gap-0.5 px-2 py-2 min-w-[52px] touch-manipulation ${
                  isActive ? "text-[#4A5568]" : "text-[#A0AEC0]"
                }`}
              >
                <item.icon className="w-5 h-5 shrink-0" />
                <span className="text-[10px] leading-tight text-center w-full truncate">
                  {item.name}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
