import {
  Calendar as CalendarIcon,
  Plus,
  Filter,
  Search,
  Clock,
  X,
  User,
  Scissors,
  UserCheck,
  CalendarDays,
} from "lucide-react";
import { Button } from "@components/button";
import { Card, CardContent } from "@components/card";
import { Badge } from "@components/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@components/dialog";
import { Input } from "@components/input";
import { Label } from "@components/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@components/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@components/tabs";
import { Calendar } from "@components/calendar";
import { useAppointmentsPresenter } from "./useAppointmentsPresenter";


const stylists = ["Laura García", "María López", "Pedro Sánchez", "Ana Rodríguez"];

const statusColors = {
  confirmada: "bg-[#48BB78] text-white",
  pendiente: "bg-[#ECC94B] text-[#2D3748]",
  cancelada: "bg-[#F56565] text-white",
};

const Appointments = () => {
  const {
    date,
    open,
    form,
    errors,
    setDate,
    setOpen,
    setForm,
    services,
    detailApt,
    searchTerm,
    handleClose,
    filterStatus,
    handleSubmit,
    setDetailApt,
    changeStatus,
    setSearchTerm,
    setFilterStatus,
    todayAppointments,
    filteredAppointments,
  } = useAppointmentsPresenter();  

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-[#2D3748]">Gestión de citas</h2>
          <p className="text-[#4A5568] mt-1">Agenda y administra las citas de tus clientes</p>
        </div>
        <Button
          className="bg-[#4A5568] hover:bg-[#2D3748] w-full sm:w-auto"
          onClick={() => setOpen(true)}
        >
          <Plus className="w-4 h-4 mr-2" />
          Nueva cita
        </Button>

        <Dialog
          open={open}
          onOpenChange={(isOpen) => {
            if (!isOpen) handleClose();
          }}
        >
          <DialogContent className="w-[calc(100vw-2rem)] sm:max-w-lg md:max-w-2xl max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Agendar nueva cita</DialogTitle>
            </DialogHeader>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <Label htmlFor="client-search">Cliente</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 w-4 h-4 text-[#A0AEC0]" />
                  <Input
                    id="client-search"
                    placeholder="Buscar cliente..."
                    className="pl-9"
                    value={form.client}
                    onChange={(e) => setForm({ ...form, client: e.target.value })}
                  />
                </div>
                {errors.client && <p className="text-red-500 text-xs mt-1">{errors.client}</p>}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="service">Servicio</Label>
                  <Select
                    value={form.service}
                    onValueChange={(v) => setForm({ ...form, service: v })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona un servicio" />
                    </SelectTrigger>
                    <SelectContent>
                      {services.map((service) => (
                        <SelectItem key={service.name} value={service.name}>
                          {service.name} — {service.duration} — {service.price}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.service && <p className="text-red-500 text-xs mt-1">{errors.service}</p>}
                </div>

                <div>
                  <Label htmlFor="stylist">Estilista</Label>
                  <Select
                    value={form.stylist}
                    onValueChange={(v) => setForm({ ...form, stylist: v })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona estilista" />
                    </SelectTrigger>
                    <SelectContent>
                      {stylists.map((stylist) => (
                        <SelectItem key={stylist} value={stylist}>
                          {stylist}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.stylist && <p className="text-red-500 text-xs mt-1">{errors.stylist}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label>Fecha</Label>
                  <div className="overflow-x-auto">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      className="rounded-md border w-full"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="time">Hora</Label>
                    <Select value={form.time} onValueChange={(v) => setForm({ ...form, time: v })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona hora" />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 20 }, (_, i) => i + 8).map((hour) => (
                          <SelectItem key={hour} value={`${hour}:00`}>
                            {hour}:00
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.time && <p className="text-red-500 text-xs mt-1">{errors.time}</p>}
                  </div>

                  <div>
                    <Label htmlFor="notes">Notas (opcional)</Label>
                    <Input
                      id="notes"
                      placeholder="Notas adicionales..."
                      value={form.notes}
                      onChange={(e) => setForm({ ...form, notes: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <Button type="submit" className="flex-1 bg-[#4A5568] hover:bg-[#2D3748]">
                  Confirmar cita
                </Button>
                <Button type="button" variant="outline" className="flex-1" onClick={handleClose}>
                  Cancelar
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 w-4 h-4 text-[#A0AEC0]" />
          <Input
            placeholder="Buscar por cliente o servicio..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-full sm:w-48">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los estados</SelectItem>
            <SelectItem value="confirmada">Confirmadas</SelectItem>
            <SelectItem value="pendiente">Pendientes</SelectItem>
            <SelectItem value="cancelada">Canceladas</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Tabs defaultValue="today" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2 sm:w-56">
          <TabsTrigger value="today">Hoy</TabsTrigger>
          <TabsTrigger value="all">Todas</TabsTrigger>
        </TabsList>

        <TabsContent value="today" className="space-y-4">
          <div className="grid gap-4">
            {todayAppointments.map((appointment) => (
              <Card key={appointment.id}>
                <CardContent className="p-4">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    <div className="flex items-center gap-3">
                      <div className="flex flex-col items-center justify-center bg-[#4A5568] text-white rounded-lg p-3 w-16 shrink-0">
                        <Clock className="w-4 h-4 mb-1" />
                        <span className="text-xs font-medium leading-tight text-center">
                          {appointment.time}
                        </span>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-[#2D3748]">{appointment.client}</h3>
                        <p className="text-sm text-[#4A5568]">{appointment.service}</p>
                        <p className="text-sm text-[#718096]">
                          {appointment.stylist} • {appointment.duration}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 sm:ml-auto">
                      <Badge
                        className={statusColors[appointment.status as keyof typeof statusColors]}
                      >
                        {appointment.status}
                      </Badge>
                      <Button variant="outline" size="sm" onClick={() => setDetailApt(appointment)}>
                        Ver detalles
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="all" className="space-y-4">
          <div className="grid gap-4">
            {filteredAppointments.map((appointment) => (
              <Card key={appointment.id}>
                <CardContent className="p-4">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    <div className="flex items-center gap-3">
                      <div className="flex flex-col items-center justify-center bg-[#4A5568] text-white rounded-lg p-3 min-w-[80px]">
                        <CalendarIcon className="w-5 h-5 mb-1" />
                        <span className="text-xs">
                          {new Date(appointment.date).toLocaleDateString("es-ES", {
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                        <span className="text-sm font-medium">{appointment.time}</span>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-[#2D3748]">{appointment.client}</h3>
                        <p className="text-sm text-[#4A5568]">{appointment.service}</p>
                        <p className="text-sm text-[#718096]">
                          {appointment.stylist} • {appointment.duration}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 sm:ml-auto">
                      <Badge
                        className={statusColors[appointment.status as keyof typeof statusColors]}
                      >
                        {appointment.status}
                      </Badge>
                      <Button variant="outline" size="sm" onClick={() => setDetailApt(appointment)}>
                        Ver detalles
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Modal detalle de cita */}
      {detailApt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b">
              <h3 className="text-xl font-semibold text-[#2D3748]">Detalle de cita</h3>
              <button
                onClick={() => setDetailApt(null)}
                className="text-[#718096] hover:text-[#2D3748]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <Badge className={statusColors[detailApt.status as keyof typeof statusColors]}>
                  {detailApt.status}
                </Badge>
                <span className="text-sm text-[#718096]">#{detailApt.id}</span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <User className="w-4 h-4 text-[#718096]" />
                    <p className="text-xs text-[#718096]">Cliente</p>
                  </div>
                  <p className="text-sm font-semibold text-[#2D3748]">{detailApt.client}</p>
                </div>

                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <UserCheck className="w-4 h-4 text-[#718096]" />
                    <p className="text-xs text-[#718096]">Estilista</p>
                  </div>
                  <p className="text-sm font-semibold text-[#2D3748]">{detailApt.stylist}</p>
                </div>

                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <Scissors className="w-4 h-4 text-[#718096]" />
                    <p className="text-xs text-[#718096]">Servicio</p>
                  </div>
                  <p className="text-sm font-semibold text-[#2D3748]">{detailApt.service}</p>
                </div>

                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <Clock className="w-4 h-4 text-[#718096]" />
                    <p className="text-xs text-[#718096]">Duración</p>
                  </div>
                  <p className="text-sm font-semibold text-[#2D3748]">{detailApt.duration}</p>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-1">
                  <CalendarDays className="w-4 h-4 text-[#718096]" />
                  <p className="text-xs text-[#718096]">Fecha y hora</p>
                </div>
                <p className="text-sm font-semibold text-[#2D3748]">
                  {new Date(detailApt.date + "T00:00:00").toLocaleDateString("es-ES", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}{" "}
                  — {detailApt.time}
                </p>
              </div>

              {detailApt.notes && (
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-[#718096] mb-1">Notas</p>
                  <p className="text-sm text-[#2D3748]">{detailApt.notes}</p>
                </div>
              )}

              <div className="flex gap-3 pt-2">
                {detailApt.status !== "confirmada" && (
                  <Button
                    className="flex-1 bg-[#48BB78] hover:bg-[#38A169] text-white"
                    onClick={() => changeStatus(detailApt.id, "confirmada")}
                  >
                    Confirmar
                  </Button>
                )}
                {detailApt.status !== "cancelada" && (
                  <Button
                    variant="outline"
                    className="flex-1 border-red-300 text-red-500 hover:bg-red-50"
                    onClick={() => changeStatus(detailApt.id, "cancelada")}
                  >
                    Cancelar cita
                  </Button>
                )}
                <Button variant="outline" className="flex-1" onClick={() => setDetailApt(null)}>
                  Cerrar
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Appointments;