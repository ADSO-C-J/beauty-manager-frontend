import { useCallback, useEffect, useState } from "react";
import { useAuthStore } from "@modules/auth/application/state/authStore";
import { reportService } from "@modules/reports/application/reportServices";
import { appointmentService } from "@modules/appointments/application/appointmentServices";
import { facialAnalysisService, resolveClientIdByEmail } from "@modules/facial-analysis/application/facialAnalysisServices";
import type { ReportMetrics } from "@modules/reports/domain/models/Report";
import type { Appointment } from "@modules/appointments/domain/models/Appointment";
import { Calendar, Users, DollarSign, TrendingDown, Scan, Clock } from "lucide-react";

export interface DashboardMetric {
  title: string;
  value: string;
  icon: typeof Calendar;
  color: string;
  bgColor: string;
}

export interface RecentAppointment {
  id: string;
  time: string;
  client: string;
  service: string;
  stylist: string;
  status: string;
}

/** Rango del día de hoy en formato ISO local que espera el backend. */
function todayRange(): { dateFrom: string; dateTo: string } {
  const pad = (n: number) => n.toString().padStart(2, "0");
  const now = new Date();
  const day = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
  return { dateFrom: `${day}T00:00:00`, dateTo: `${day}T23:59:59` };
}

/** Formatea "09:00" a "09:00 AM". */
function formatTime(time: string): string {
  const [hStr, mStr] = time.split(":");
  const hour = Number(hStr);
  if (Number.isNaN(hour)) return time;
  const suffix = hour >= 12 ? "PM" : "AM";
  const h12 = hour % 12 === 0 ? 12 : hour % 12;
  return `${h12}:${mStr ?? "00"} ${suffix}`;
}

const currency = new Intl.NumberFormat("es-MX", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

export const useDashboardPresenter = () => {
  const user = useAuthStore((state) => state.user);
  const [metrics, setMetrics] = useState<ReportMetrics | null>(null);
  const [recentAppointments, setRecentAppointments] = useState<RecentAppointment[]>([]);
  const [facialAnalysisCount, setFacialAnalysisCount] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async (isCancelled?: () => boolean) => {
    setIsLoading(true);
    setError(null);
    const { dateFrom, dateTo } = todayRange();
    // Solo los clientes (y estilistas que atienden análisis) tienen análisis faciales;
    // para el resto de roles se evita una petición que devolvería 404.
    const canHaveAnalyses =
      user?.role === "cliente" || user?.role === "estilista";
    const clientId = canHaveAnalyses
      ? await resolveClientIdByEmail(user?.email)
      : null;
    const [metricsRes, appointmentsRes, analysesRes] = await Promise.allSettled([
      reportService.getMetrics("month"),
      appointmentService.getAppointments(dateFrom, dateTo),
      clientId
        ? facialAnalysisService.getAnalyses(clientId)
        : Promise.resolve([]),
    ]);
    if (isCancelled?.()) return;
    if (metricsRes.status === "fulfilled") {
      setMetrics(metricsRes.value);
    } else {
      setError("No se pudieron cargar las métricas");
    }
    if (appointmentsRes.status === "fulfilled") {
      setRecentAppointments(appointmentsRes.value.slice(0, 5).map(toRecentAppointment));
    }
    if (analysesRes.status === "fulfilled") {
      setFacialAnalysisCount(analysesRes.value.length);
    }
    setIsLoading(false);
  }, [user]);

  useEffect(() => {
    let cancelled = false;
    const isCancelled = () => cancelled;
    // Diferido para evitar setState sincrónico dentro del effect (patrón del proyecto).
    Promise.resolve()
      .then(() => loadData(isCancelled))
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, [loadData]);

  const getMetricsByRole = (): DashboardMetric[] => {
    switch (user?.role) {
      case "administrador":
        return [
          {
            title: "Citas hoy",
            value: String(recentAppointments.length),
            icon: Calendar,
            color: "text-blue-600",
            bgColor: "bg-blue-50",
          },
          {
            title: "Clientes nuevos",
            value: String(metrics?.newClients ?? 0),
            icon: Users,
            color: "text-green-600",
            bgColor: "bg-green-50",
          },
          {
            title: "Ingresos del mes",
            value: currency.format(metrics?.totalRevenue ?? 0),
            icon: DollarSign,
            color: "text-purple-600",
            bgColor: "bg-purple-50",
          },
          {
            title: "Tasa de cancelación",
            value: `${(metrics?.cancellationRate ?? 0).toFixed(1)}%`,
            icon: TrendingDown,
            color: "text-red-600",
            bgColor: "bg-red-50",
          },
        ];
      case "estilista":
        return [
          {
            title: "Mis citas hoy",
            value: String(recentAppointments.length),
            icon: Calendar,
            color: "text-blue-600",
            bgColor: "bg-blue-50",
          },
          {
            title: "Clientes atendidos",
            value: String(metrics?.newClients ?? 0),
            icon: Users,
            color: "text-green-600",
            bgColor: "bg-green-50",
          },
          {
            title: "Próxima cita",
            value: recentAppointments[0]?.time ?? "—",
            icon: Clock,
            color: "text-purple-600",
            bgColor: "bg-purple-50",
          },
          {
            title: "Análisis realizados",
            value:
              facialAnalysisCount !== null
                ? String(facialAnalysisCount)
                : "—",
            icon: Scan,
            color: "text-orange-600",
            bgColor: "bg-orange-50",
          },
        ];
      case "recepcionista":
        return [
          {
            title: "Citas hoy",
            value: String(recentAppointments.length),
            icon: Calendar,
            color: "text-blue-600",
            bgColor: "bg-blue-50",
          },
          {
            title: "Citas pendientes",
            value: String(recentAppointments.filter((a) => a.status === "pendiente").length),
            icon: Clock,
            color: "text-orange-600",
            bgColor: "bg-orange-50",
          },
          {
            title: "Nuevos registros",
            value: String(metrics?.newClients ?? 0),
            icon: Users,
            color: "text-green-600",
            bgColor: "bg-green-50",
          },
        ];
      case "cliente":
        return [
          {
            title: "Próxima cita",
            value: recentAppointments[0]?.time ?? "—",
            icon: Calendar,
            color: "text-blue-600",
            bgColor: "bg-blue-50",
          },
          {
            title: "Análisis realizados",
            value:
              facialAnalysisCount !== null
                ? String(facialAnalysisCount)
                : "—",
            icon: Scan,
            color: "text-purple-600",
            bgColor: "bg-purple-50",
          },
          {
            title: "Visitas totales",
            value: String(recentAppointments.length),
            icon: TrendingDown,
            color: "text-green-600",
            bgColor: "bg-green-50",
          },
        ];
      default:
        return [];
    }
  };

  return { currentMetrics: getMetricsByRole(), recentAppointments, isLoading, error };
};

function toRecentAppointment(apt: Appointment): RecentAppointment {
  return {
    id: apt.id,
    time: formatTime(apt.time),
    client: apt.clientName || "Cliente",
    service: apt.service || "Servicio",
    stylist: apt.stylistName || "Sin asignar",
    status: apt.status,
  };
}

export const statusColors = {
  confirmada: "bg-[#48BB78] text-white",
  pendiente: "bg-[#ECC94B] text-[#2D3748]",
  cancelada: "bg-[#F56565] text-white",
};