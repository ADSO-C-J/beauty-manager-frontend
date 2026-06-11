import { useAuthStore } from "@modules/auth/application/state/authStore";
import { Calendar, Users, DollarSign, TrendingDown, Scan, Clock } from "lucide-react";

export const useDashboardPresenter = () => {
  const user = useAuthStore((state) => state.user);

  const getMetricsByRole = () => {
    switch (user?.role) {
      case "administrador":
        return metrics;
      case "estilista":
        return [
          {
            title: "Mis citas hoy",
            value: "8",
            icon: Calendar,
            color: "text-blue-600",
            bgColor: "bg-blue-50",
          },
          {
            title: "Clientes atendidos",
            value: "124",
            icon: Users,
            color: "text-green-600",
            bgColor: "bg-green-50",
          },
          {
            title: "Próxima cita",
            value: "10:30 AM",
            icon: Clock,
            color: "text-purple-600",
            bgColor: "bg-purple-50",
          },
          {
            title: "Análisis realizados",
            value: "15",
            icon: Scan,
            color: "text-orange-600",
            bgColor: "bg-orange-50",
          },
        ];
      case "recepcionista":
        return [
          {
            title: "Citas hoy",
            value: "12",
            icon: Calendar,
            color: "text-blue-600",
            bgColor: "bg-blue-50",
          },
          {
            title: "Citas pendientes",
            value: "3",
            icon: Clock,
            color: "text-orange-600",
            bgColor: "bg-orange-50",
          },
          {
            title: "Nuevos registros",
            value: "5",
            icon: Users,
            color: "text-green-600",
            bgColor: "bg-green-50",
          },
        ];
      case "cliente":
        return [
          {
            title: "Próxima cita",
            value: "Hoy",
            icon: Calendar,
            color: "text-blue-600",
            bgColor: "bg-blue-50",
          },
          {
            title: "Análisis realizados",
            value: "2",
            icon: Scan,
            color: "text-purple-600",
            bgColor: "bg-purple-50",
          },
          {
            title: "Visitas totales",
            value: "8",
            icon: TrendingDown,
            color: "text-green-600",
            bgColor: "bg-green-50",
          },
        ];
      default:
        return [];
    }
  };

  const currentMetrics = getMetricsByRole();

  return { currentMetrics };
}


const metrics = [
  {
    title: "Citas hoy",
    value: "12",
    icon: Calendar,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
  },
  {
    title: "Clientes nuevos",
    value: "8",
    icon: Users,
    color: "text-green-600",
    bgColor: "bg-green-50",
  },
  {
    title: "Ingresos del mes",
    value: "$4,280",
    icon: DollarSign,
    color: "text-purple-600",
    bgColor: "bg-purple-50",
  },
  {
    title: "Tasa de cancelación",
    value: "4.2%",
    icon: TrendingDown,
    color: "text-red-600",
    bgColor: "bg-red-50",
  },
];

export const recentAppointments = [
  {
    id: 1,
    time: "09:00 AM",
    client: "Ana Martínez",
    service: "Corte de cabello",
    stylist: "Laura García",
    status: "confirmada",
  },
  {
    id: 2,
    time: "10:30 AM",
    client: "Carlos Ruiz",
    service: "Tinte + Corte",
    stylist: "María López",
    status: "pendiente",
  },
  {
    id: 3,
    time: "11:00 AM",
    client: "Sofía Hernández",
    service: "Manicure",
    stylist: "Laura García",
    status: "confirmada",
  },
  {
    id: 4,
    time: "02:00 PM",
    client: "Juan Pérez",
    service: "Corte + Barba",
    stylist: "Pedro Sánchez",
    status: "cancelada",
  },
  {
    id: 5,
    time: "03:30 PM",
    client: "Elena Torres",
    service: "Peinado especial",
    stylist: "María López",
    status: "confirmada",
  },
];

export const statusColors = {
  confirmada: "bg-[#48BB78] text-white",
  pendiente: "bg-[#ECC94B] text-[#2D3748]",
  cancelada: "bg-[#F56565] text-white",
};