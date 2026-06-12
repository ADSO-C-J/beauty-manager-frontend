import { useState } from "react";
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

const monthlyRevenue = [
  { month: "Ene", revenue: 3200 },
  { month: "Feb", revenue: 3800 },
  { month: "Mar", revenue: 4100 },
  { month: "Abr", revenue: 4280 },
];

const servicePopularity = [
  { name: "Corte de cabello", value: 45, color: "#4A5568" },
  { name: "Tinte", value: 25, color: "#718096" },
  { name: "Manicure", value: 15, color: "#A0AEC0" },
  { name: "Peinados", value: 10, color: "#CBD5E0" },
  { name: "Otros", value: 5, color: "#E2E8F0" },
];

const stylistPerformance = [
  { name: "Laura García", appointments: 87, revenue: 2180 },
  { name: "María López", appointments: 72, revenue: 1980 },
  { name: "Pedro Sánchez", appointments: 65, revenue: 1650 },
  { name: "Ana Rodríguez", appointments: 58, revenue: 1470 },
];

const metrics = [
  {
    title: "Ingresos totales",
    value: "$15,400",
    change: "+12.5%",
    trend: "up",
    period: "vs mes anterior",
  },
  {
    title: "Total de citas",
    value: "282",
    change: "+8.3%",
    trend: "up",
    period: "vs mes anterior",
  },
  {
    title: "Nuevos clientes",
    value: "34",
    change: "+15.2%",
    trend: "up",
    period: "vs mes anterior",
  },
  {
    title: "Tasa de cancelación",
    value: "4.2%",
    change: "-1.8%",
    trend: "down",
    period: "vs mes anterior",
  },
];

const Reports = () => {
  const [dateRange, setDateRange] = useState("month");

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
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-full sm:w-48">
              <Calendar className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Esta semana</SelectItem>
              <SelectItem value="month">Este mes</SelectItem>
              <SelectItem value="quarter">Este trimestre</SelectItem>
              <SelectItem value="year">Este año</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="w-full sm:w-auto">
            <Download className="w-4 h-4 mr-2" />
            Exportar Excel
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric) => (
          <Card key={metric.title}>
            <CardContent className="p-6">
              <p className="text-sm text-[#4A5568] mb-2">{metric.title}</p>
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-2xl font-bold text-[#2D3748]">{metric.value}</p>
                  <div className="flex items-center gap-1 mt-2">
                    {metric.trend === "up" ? (
                      <TrendingUp className="w-4 h-4 text-[#48BB78]" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-[#48BB78]" />
                    )}
                    <span className="text-sm text-[#48BB78]">{metric.change}</span>
                  </div>
                </div>
              </div>
              <p className="text-xs text-[#718096] mt-2">{metric.period}</p>
            </CardContent>
          </Card>
        ))}
      </div>

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
              <div className="h-56 sm:h-72 lg:h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyRevenue}>
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
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="services">
          <Card>
            <CardHeader>
              <CardTitle>Servicios más solicitados</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col lg:flex-row gap-6 items-center">
                <div className="h-56 sm:h-64 w-full lg:w-1/2">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={servicePopularity}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {servicePopularity.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="w-full lg:w-1/2 space-y-3">
                  {servicePopularity.map((service) => (
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
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="stylists">
          <Card>
            <CardHeader>
              <CardTitle>Desempeño por estilista</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stylistPerformance.map((stylist, index) => (
                  <div
                    key={stylist.name}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-[#F7FAFC] rounded-lg"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex items-center justify-center w-10 h-10 bg-[#4A5568] text-white rounded-full font-semibold">
                        #{index + 1}
                      </div>
                      <div>
                        <p className="font-semibold text-[#2D3748]">{stylist.name}</p>
                        <p className="text-sm text-[#4A5568]">
                          {stylist.appointments} citas completadas
                        </p>
                      </div>
                    </div>
                    <div className="sm:ml-auto">
                      <p className="text-xl sm:text-2xl font-bold text-[#2D3748]">
                        ${stylist.revenue.toLocaleString()}
                      </p>
                      <p className="text-sm text-[#718096]">Ingresos generados</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default Reports;