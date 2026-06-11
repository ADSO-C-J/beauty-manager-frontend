import { Link } from "react-router";
import { Calendar, Plus, Scan } from "lucide-react";
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
import { ROUTES } from "@app/router/routes";
import { recentAppointments, statusColors, useDashboardPresenter } from "./useDashboardPresenter";
import { useAuthStore } from "@modules/auth/application/state/authStore";


const Dashboard = () => {
  const user = useAuthStore((state) => state.user);
  const { currentMetrics } = useDashboardPresenter();

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

export default Dashboard;