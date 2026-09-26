import { Download, TrendingUp, TrendingDown, Calendar } from "lucide-react";
import { Button } from "@components/button";
import { Card, CardContent, CardHeader, CardTitle } from "@components/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@components/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@components/tabs";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  useReportsPresenter,
  formatCurrency,
  rangeLabels,
} from "./useReportsPresenter";
import type { ReportRange } from "@modules/reports/domain/models/Report";

const priorityColor = (index: number) =>
  index === 0 ? "bg-[#4A5568] text-white" : "bg-[#A0AEC0] text-white";

const Reports = () => {
  const {
    metrics,
    dateRange,
    setDateRange,
    isLoading,
    error,
    revenueChartData,
    serviceChartData,
    staffPerformance,
  } = useReportsPresenter();

  const metricCards = [
    {
      title: "Ingresos totales",
      value: formatCurrency(metrics?.totalRevenue ?? 0),
      footer: "según rango seleccionado",
    },
    {
      title: "Total de citas",
      value: String(metrics?.totalAppointments ?? 0),
      footer: "histórico del negocio",
    },
    {
      title: "Nuevos clientes",
      value: String(metrics?.newClients ?? 0),
      footer: "según rango seleccionado",
    },
    {
      title: "Tasa de cancelación",
      value: `${metrics?.cancellationRate ?? 0}%`,
      footer: "incluye no presentados",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-[#2D3748]">Reportes y análisis</h2>
          <p className="text-[#4A5568] mt-1">
            Visualiza métricas clave y el desempeño de tu negocio
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <Select value={dateRange} onValueChange={(v) => setDateRange(v as ReportRange)}>
            <SelectTrigger className="w-full sm:w-48">
              <Calendar className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {(Object.keys(rangeLabels) as ReportRange[]).map((range) => (
                <SelectItem key={range} value={range}>
                  {rangeLabels[range]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="outline" className="w-full sm:w-auto">
            <Download className="w-4 h-4 mr-2" />
            Exportar Excel
          </Button>
        </div>
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metricCards.map((metric, index) => (
          <Card key={metric.title}>
            <CardContent className="p-6">
              <p className="text-sm text-[#4A5568] mb-2">{metric.title}</p>
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-2xl font-bold text-[#2D3748]">{metric.value}</p>
                  <div className="flex items-center gap-1 mt-2">
                    {index === 3 ? (
                      <TrendingDown className="w-4 h-4 text-[#48BB78]" />
                    ) : (
                      <TrendingUp className="w-4 h-4 text-[#48BB78]" />
                    )}
                    <span className="text-sm text-[#718096]">{metric.footer}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {isLoading && (
        <p className="text-sm text-[#718096]">Cargando reportes...</p>
      )}

      <Tabs defaultValue="revenue" className="space-y-4">
        <TabsList className="w-full sm:w-auto grid grid-cols-3 sm:inline-flex">
          <TabsTrigger value="revenue">Ingresos</TabsTrigger>
          <TabsTrigger value="services">Servicios</TabsTrigger>
          <TabsTrigger value="stylists">Estilistas</TabsTrigger>
        </TabsList>

        <TabsContent value="revenue">
          <Card>
            <CardHeader>
              <CardTitle>Ingresos mensuales</CardTitle>
            </CardHeader>
            <CardContent>
              {revenueChartData.length === 0 ? (
                <p className="text-sm text-[#718096]">No hay ingresos registrados.</p>
              ) : (
                <div className="h-56 sm:h-72 lg:h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={revenueChartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                      <XAxis dataKey="month" stroke="#718096" />
                      <YAxis stroke="#718096" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "white",
                          border: "1px solid #E2E8F0",
                          borderRadius: "8px",
                        }}
                      />
                      <Legend />
                      <Bar
                        dataKey="revenue"
                        fill="#4A5568"
                        name="Ingresos ($)"
                        radius={[8, 8, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="services">
          <Card>
            <CardHeader>
              <CardTitle>Servicios más solicitados</CardTitle>
            </CardHeader>
            <CardContent>
              {serviceChartData.length === 0 ? (
                <p className="text-sm text-[#718096]">Aún no hay servicios agendados.</p>
              ) : (
                <div className="flex flex-col lg:flex-row gap-6 items-center">
                  <div className="h-56 sm:h-64 w-full lg:w-1/2">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={serviceChartData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
                          outerRadius={100}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {serviceChartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="w-full lg:w-1/2 space-y-3">
                    {serviceChartData.map((service) => (
                      <div key={service.name} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-4 h-4 rounded"
                            style={{ backgroundColor: service.color }}
                          ></div>
                          <span className="text-[#2D3748]">{service.name}</span>
                        </div>
                        <span className="font-semibold text-[#4A5568]">{service.value}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="stylists">
          <Card>
            <CardHeader>
              <CardTitle>Desempeño por estilista</CardTitle>
            </CardHeader>
            <CardContent>
              {staffPerformance.length === 0 ? (
                <p className="text-sm text-[#718096]">No hay datos de estilistas.</p>
              ) : (
                <div className="space-y-4">
                  {staffPerformance.map((stylist, index) => (
                    <div
                      key={stylist.staffId}
                      className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-[#F7FAFC] rounded-lg"
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={`flex items-center justify-center w-10 h-10 rounded-full font-semibold ${priorityColor(
                            index
                          )}`}
                        >
                          #{index + 1}
                        </div>
                        <div>
                          <p className="font-semibold text-[#2D3748]">{stylist.staffName}</p>
                          <p className="text-sm text-[#4A5568]">
                            {stylist.totalAppointments} citas completadas
                            {stylist.avgRating != null
                              ? ` · ⭐ ${stylist.avgRating} (${stylist.totalReviews})`
                              : ''}
                          </p>
                        </div>
                      </div>
                      <div className="sm:ml-auto">
                        <p className="text-xl sm:text-2xl font-bold text-[#2D3748]">
                          {formatCurrency(stylist.totalRevenue)}
                        </p>
                        <p className="text-sm text-[#718096]">Ingresos generados</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Reports;