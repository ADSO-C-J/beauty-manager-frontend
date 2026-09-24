import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@components/card";
import { Button } from "@components/button";
import { Input } from "@components/input";
import { Label } from "@components/label";
import { Switch } from "@components/switch";
import { Separator } from "@components/separator";
import { Badge } from "@components/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@components/tabs";
import { CheckCircle2, AlertCircle, X } from "lucide-react";
import { toTimeInput } from "@modules/business/infrastructure/mappers/businessMapper";
import {
  useSettingsPresenter,
  WEEK_DAYS,
  type NotificationKey,
} from "./useSettingsPresenter";

const NOTIFICATION_ITEMS: {
  key: NotificationKey;
  label: string;
  description: string;
}[] = [
  {
    key: "appointmentReminders",
    label: "Recordatorios de citas",
    description: "Recibe recordatorios antes de cada cita programada",
  },
  {
    key: "newClients",
    label: "Nuevos clientes",
    description: "Notificación cuando un nuevo cliente se registre",
  },
  {
    key: "cancellations",
    label: "Cancelaciones",
    description: "Alerta cuando un cliente cancele una cita",
  },
  {
    key: "monthlyReports",
    label: "Reportes mensuales",
    description: "Resumen de métricas y desempeño cada mes",
  },
  {
    key: "systemUpdates",
    label: "Actualizaciones del sistema",
    description: "Información sobre nuevas funcionalidades y mejoras",
  },
];

// Mapea la etiqueta del día a su clave del backend.
const dayValue = (label: string) =>
  WEEK_DAYS.find((d) => d.label === label)?.value ?? "lunes";

const Settings = () => {
  const {
    user,
    business,
    form,
    setForm,
    errors,
    hoursByDay,
    notifications,
    isLoading,
    isSavingBusiness,
    error,
    success,
    clearMessages,
    saveBusiness,
    upsertHours,
    toggleDayClosed,
    toggleNotification,
  } = useSettingsPresenter();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl md:text-3xl font-bold text-[#2D3748]">Configuración</h2>
        <p className="text-[#4A5568] mt-1">Personaliza las opciones de tu cuenta y negocio</p>
      </div>

      {error && (
        <div
          className="flex items-center justify-between rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600"
          onClick={clearMessages}
        >
          <span className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            {error}
          </span>
          <X className="w-4 h-4 cursor-pointer" />
        </div>
      )}

      {success && (
        <div
          className="flex items-center justify-between rounded-lg bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-700"
          onClick={clearMessages}
        >
          <span className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            {success}
          </span>
          <X className="w-4 h-4 cursor-pointer" />
        </div>
      )}

      {isLoading && (
        <p className="text-sm text-[#718096]">Cargando configuración...</p>
      )}

      <Tabs defaultValue="business" className="space-y-4">
        <TabsList className="w-full sm:w-auto grid grid-cols-3 sm:inline-flex">
          <TabsTrigger value="business">Negocio</TabsTrigger>
          <TabsTrigger value="hours">Horarios</TabsTrigger>
          <TabsTrigger value="notifications">Avisos</TabsTrigger>
        </TabsList>

        {/* --- Negocio --- */}
        <TabsContent value="business">
          <Card>
            <CardHeader>
              <CardTitle>Información del negocio</CardTitle>
              <CardDescription>Configura los detalles de tu salón de belleza</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4" onSubmit={saveBusiness}>
                <div>
                  <Label htmlFor="businessName">Nombre del negocio</Label>
                  <Input
                    id="businessName"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                  {errors.name && (
                    <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="businessAddress">Dirección</Label>
                  <Input
                    id="businessAddress"
                    value={form.address}
                    onChange={(e) => setForm({ ...form, address: e.target.value })}
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="businessCity">Ciudad</Label>
                    <Input
                      id="businessCity"
                      value={form.city}
                      onChange={(e) => setForm({ ...form, city: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="businessCountry">País</Label>
                    <Input
                      id="businessCountry"
                      value={form.country}
                      onChange={(e) => setForm({ ...form, country: e.target.value })}
                    />
                    {errors.country && (
                      <p className="text-red-500 text-xs mt-1">{errors.country}</p>
                    )}
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="businessPhone">Teléfono del negocio</Label>
                    <Input
                      id="businessPhone"
                      type="tel"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="businessEmail">Email del negocio</Label>
                    <Input
                      id="businessEmail"
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                    />
                    {errors.email && (
                      <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                    )}
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="businessWebsite">Sitio web</Label>
                    <Input
                      id="businessWebsite"
                      value={form.website}
                      onChange={(e) => setForm({ ...form, website: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="businessCurrency">Moneda</Label>
                    <Input
                      id="businessCurrency"
                      value={form.currency}
                      onChange={(e) => setForm({ ...form, currency: e.target.value })}
                    />
                    {errors.currency && (
                      <p className="text-red-500 text-xs mt-1">{errors.currency}</p>
                    )}
                  </div>
                </div>

                <div>
                  <Label htmlFor="businessTimezone">Zona horaria</Label>
                  <Input
                    id="businessTimezone"
                    placeholder="America/Bogota"
                    value={form.timezone}
                    onChange={(e) => setForm({ ...form, timezone: e.target.value })}
                  />
                </div>

                <div className="flex justify-end pt-2">
                  <Button
                    type="submit"
                    disabled={isSavingBusiness}
                    className="bg-[#4A5568] hover:bg-[#2D3748]"
                  >
                    {isSavingBusiness ? "Guardando..." : "Guardar cambios"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* --- Horarios de atención --- */}
        <TabsContent value="hours">
          <Card>
            <CardHeader>
              <CardTitle>Horario de atención</CardTitle>
              <CardDescription>
                Define el horario de apertura de tu negocio por día
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {WEEK_DAYS.map(({ value, label }) => {
                const hours = hoursByDay[value];
                const isClosed = hours?.isClosed ?? false;
                return (
                  <div
                    key={value}
                    className="flex flex-col sm:flex-row sm:items-center gap-3 border-b border-gray-100 pb-3 last:border-0"
                  >
                    <div className="flex items-center gap-3 sm:w-40 shrink-0">
                      <Label className="text-sm font-medium">{label}</Label>
                      {isClosed && (
                        <Badge className="bg-gray-200 text-[#4A5568]">Cerrado</Badge>
                      )}
                    </div>

                    <div className="flex flex-1 items-center gap-2">
                      <Input
                        type="time"
                        aria-label={`Apertura ${label}`}
                        disabled={isClosed}
                        defaultValue={toTimeInput(hours?.opensAt ?? "09:00")}
                        onBlur={(e) => {
                          const value = e.target.value;
                          if (value) {
                            void upsertHours(
                              dayValue(label),
                              value,
                              toTimeInput(hours?.closesAt ?? "18:00"),
                              false
                            );
                          }
                        }}
                        className="w-32"
                      />
                      <span className="text-[#A0AEC0]">—</span>
                      <Input
                        type="time"
                        aria-label={`Cierre ${label}`}
                        disabled={isClosed}
                        defaultValue={toTimeInput(hours?.closesAt ?? "18:00")}
                        onBlur={(e) => {
                          const value = e.target.value;
                          if (value) {
                            void upsertHours(
                              dayValue(label),
                              toTimeInput(hours?.opensAt ?? "09:00"),
                              value,
                              false
                            );
                          }
                        }}
                        className="w-32"
                      />
                    </div>

                    <div className="flex items-center gap-2 sm:ml-auto">
                      <Label className="text-xs text-[#718096]">Cerrado</Label>
                      <Switch
                        aria-label={`Cerrado ${label}`}
                        checked={isClosed}
                        onCheckedChange={(checked) =>
                          void toggleDayClosed(value, checked)
                        }
                      />
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </TabsContent>

        {/* --- Notificaciones --- */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Preferencias de notificaciones</CardTitle>
              <CardDescription>Controla qué notificaciones deseas recibir</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {!notifications && (
                <p className="text-sm text-[#718096]">
                  {user?.id
                    ? "No hay preferencias disponibles."
                    : "Inicia sesión para ver tus preferencias."}
                </p>
              )}
              {notifications &&
                NOTIFICATION_ITEMS.map((item, index) => (
                  <div key={item.key}>
                    {index > 0 && <Separator className="mb-6" />}
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>{item.label}</Label>
                        <p className="text-sm text-[#718096]">{item.description}</p>
                      </div>
                      <Switch
                        aria-label={item.label}
                        checked={notifications[item.key]}
                        onCheckedChange={(checked) =>
                          void toggleNotification(item.key, checked)
                        }
                      />
                    </div>
                  </div>
                ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {business && (
        <p className="text-xs text-[#A0AEC0]">
          Negocio: {business.name} · Moneda: {business.currency}
          {business.timezone ? ` · Zona: ${business.timezone}` : ""}
        </p>
      )}
    </div>
  );
};

export default Settings;
