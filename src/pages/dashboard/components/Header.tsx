import { useAuthStore } from "@modules/auth/application/state/authStore";
import { Avatar, AvatarFallback } from "@components/avatar";
import { Bell } from "lucide-react";

export default function Header() {
  const user = useAuthStore((state) => state.user);

  const initials = user?.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) || "?";

  const roleLabels: Record<string, string> = {
    administrador: "Administrador",
    estilista: "Estilista",
    recepcionista: "Recepcionista",
    cliente: "Cliente",
  };

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-3">
      <div className="flex items-center justify-between">
        {/* Page title is rendered by each page */}
        <div />

        {/* Right section */}
        <div className="flex items-center gap-4">
          {/* Notifications */}
          <button className="relative p-2 rounded-lg hover:bg-gray-100 text-[#4A5568] transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#F56565] rounded-full" />
          </button>

          {/* User info */}
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-[#2D3748]">{user?.name}</p>
              <p className="text-xs text-[#4A5568]">
                {user?.role ? roleLabels[user.role] : ""}
              </p>
            </div>
            <Avatar className="w-9 h-9 bg-[#4A5568]">
              <AvatarFallback className="text-white text-sm font-medium">
                {initials}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      </div>
    </header>
  );
}