import { Link } from "react-router";
import { Calendar, Users, DollarSign, TrendingDown, Plus, Scan, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@components/card";
import { Button } from "@components/button";
import { Badge } from "@components/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@components/table";
import { useAuthStore } from "@modules/auth/application/state/authStore";
import { ROUTES } from "@app/router/routes";

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

const recentAppointments = [
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

const statusColors = {
  confirmada: "bg-[#48BB78] text-white",
  pendiente: "bg-[#ECC94B] text-[#2D3748]",
  cancelada: "bg-[#F56565] text-white",
};

export default function Dashboard() {
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

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-[#2D3748]">Panel de control</h2>
          <p className="text-[#4A5568] mt-1">
            Resumen de actividad de hoy,{" "}
            {new Date().toLocaleDateString("es-ES", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
        {user?.role !== "cliente" && (
          <Link to={ROUTES.DASHBOARD_APPOINTMENTS}>
            <Button className="bg-[#4A5568] hover:bg-[#2D3748] w-full sm:w-auto">
              <Plus className="w-4 h-4 mr-2" />
              Nueva cita
            </Button>
          </Link>
        )}
      </div>

      <div
        className={`grid grid-cols-1 sm:grid-cols-2 ${currentMetrics.length > 2 ? "lg:grid-cols-4" : "lg:grid-cols-3"} gap-4`}
      >
        {currentMetrics.map((metric) => (
          <Card key={metric.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-[#4A5568]">{metric.title}</CardTitle>
              <div className={`p-2 rounded-lg ${metric.bgColor}`}>
                <metric.icon className={`w-5 h-5 ${metric.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[#2D3748]">{metric.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <CardTitle className="text-xl text-[#2D3748]">
              {user?.role === "cliente" ? "Mis citas" : "Citas recientes"}
            </CardTitle>
            <Link to={ROUTES.DASHBOARD_APPOINTMENTS}>
              <Button variant="outline" className="w-full sm:w-auto">
                Ver todas las citas
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          <div className="hidden md:block overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Hora</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Servicio</TableHead>
                  <TableHead>Estilista</TableHead>
                  <TableHead>Estado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentAppointments.map((appointment) => (
                  <TableRow key={appointment.id}>
                    <TableCell className="font-medium">{appointment.time}</TableCell>
                    <TableCell>{appointment.client}</TableCell>
                    <TableCell>{appointment.service}</TableCell>
                    <TableCell>{appointment.stylist}</TableCell>
                    <TableCell>
                      <Badge
                        className={statusColors[appointment.status as keyof typeof statusColors]}
                      >
                        {appointment.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="md:hidden space-y-4">
            {recentAppointments.map((appointment) => (
              <div key={appointment.id} className="bg-[#F7FAFC] rounded-lg p-4 space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold text-[#2D3748]">{appointment.client}</p>
                    <p className="text-sm text-[#4A5568]">{appointment.service}</p>
                  </div>
                  <Badge className={statusColors[appointment.status as keyof typeof statusColors]}>
                    {appointment.status}
                  </Badge>
                </div>
                <div className="flex justify-between text-sm text-[#4A5568]">
                  <span>{appointment.time}</span>
                  <span>{appointment.stylist}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {user?.role !== "cliente" && (
        <Link to={ROUTES.DASHBOARD_APPOINTMENTS} className="md:hidden">
          <Button className="fixed bottom-[72px] right-4 rounded-full w-14 h-14 shadow-lg bg-[#4A5568] hover:bg-[#2D3748]">
            <Plus className="w-6 h-6" />
          </Button>
        </Link>
      )}

      {user?.role === "cliente" && (
        <Card>
          <CardHeader>
            <CardTitle className="text-xl text-[#2D3748]">Acciones rápidas</CardTitle>
          </CardHeader>
          <CardContent className="grid sm:grid-cols-2 gap-4">
            <Link to={ROUTES.DASHBOARD_FACIAL_ANALYSIS}>
              <Button className="w-full h-24 bg-[#48BB78] hover:bg-[#38A169] flex flex-col gap-2">
                <Scan className="w-8 h-8" />
                <span>Análisis Facial</span>
              </Button>
            </Link>
            <Link to={ROUTES.DASHBOARD_APPOINTMENTS}>
              <Button className="w-full h-24 bg-[#4A5568] hover:bg-[#2D3748] flex flex-col gap-2">
                <Calendar className="w-8 h-8" />
                <span>Mis Citas</span>
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
