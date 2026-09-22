import {
  Clock,
  Plus,
  Trash2,
  X,
  CalendarDays,
  User,
  Power,
} from 'lucide-react';
import { Button } from '@components/button';
import { Card, CardContent } from '@components/card';
import { Badge } from '@components/badge';
import { Input } from '@components/input';
import { Label } from '@components/label';
import { Switch } from '@components/switch';
import { Separator } from '@components/separator';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@components/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@components/select';
import type { ScheduleDay } from '@modules/staff-schedules/domain/models/StaffSchedule';
import { toTimeInput } from '@modules/staff-schedules/infrastructure/mappers/staffScheduleMapper';
import {
  useStaffSchedulesPresenter,
  WEEK_DAYS,
} from './useStaffSchedulesPresenter';

const Schedules = () => {
  const {
    stylists,
    selectedStaffId,
    setSelectedStaffId,
    scheduleByDay,
    availableDays,
    activeCount,
    isLoading,
    error,
    clearError,
    open,
    form,
    setForm,
    errors,
    openCreate,
    handleClose,
    handleSubmit,
    updateSchedule,
    toggleActive,
    deleteSchedule,
  } = useStaffSchedulesPresenter();

  const canAdd = availableDays.length > 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-[#2D3748]">Horarios del personal</h2>
          <p className="text-[#4A5568] mt-1">
            Configura la disponibilidad semanal de cada estilista
          </p>
        </div>
        <Button
          className="bg-[#4A5568] hover:bg-[#2D3748] w-full sm:w-auto"
          onClick={openCreate}
          disabled={!selectedStaffId || !canAdd}
        >
          <Plus className="w-4 h-4 mr-2" />
          Añadir horario
        </Button>
      </div>

      {/* Selector de estilista */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-[#718096]" />
              <Label className="text-sm font-medium">Estilista</Label>
            </div>
            <Select value={selectedStaffId} onValueChange={setSelectedStaffId}>
              <SelectTrigger className="w-full sm:w-72">
                <SelectValue placeholder="Selecciona un estilista" />
              </SelectTrigger>
              <SelectContent>
                {stylists.length === 0 && (
                  <div className="px-2 py-1.5 text-sm text-[#718096]">
                    No hay estilistas disponibles
                  </div>
                )}
                {stylists.map((s) => (
                  <SelectItem key={s.id} value={s.id}>
                    {s.name}
                    {s.specialty ? ` — ${s.specialty}` : ''}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedStaffId && (
              <Badge className="bg-[#48BB78]/10 text-[#38A169] w-fit">
                {activeCount} día{activeCount === 1 ? '' : 's'} activo{activeCount === 1 ? '' : 's'}
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>

      {error && (
        <div
          className="flex items-center justify-between rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600"
          onClick={clearError}
        >
          {error}
          <X className="w-4 h-4 cursor-pointer" />
        </div>
      )}

      {/* Rejilla semanal */}
      {isLoading ? (
        <p className="text-sm text-[#718096]">Cargando horarios...</p>
      ) : (
        <div className="grid gap-3">
          {WEEK_DAYS.map(({ value, label }) => {
            const schedule = scheduleByDay[value];
            return (
              <Card key={value} className={schedule && !schedule.isActive ? 'opacity-60' : ''}>
                <CardContent className="p-4">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    <div className="flex items-center gap-3 sm:w-44 shrink-0">
                      <div className="flex flex-col items-center justify-center bg-[#4A5568] text-white rounded-lg p-2 w-14 shrink-0">
                        <CalendarDays className="w-4 h-4 mb-0.5" />
                        <span className="text-[10px] font-medium text-center leading-tight">
                          {label.slice(0, 3)}
                        </span>
                      </div>
                      <span className="font-semibold text-[#2D3748]">{label}</span>
                    </div>

                    {schedule ? (
                      <>
                        <div className="flex flex-1 items-center gap-2">
                          <Input
                            type="time"
                            aria-label={`Inicio ${label}`}
                            defaultValue={toTimeInput(schedule.startsAt)}
                            onBlur={(e) => {
                              const value = e.target.value;
                              if (value && value !== toTimeInput(schedule.startsAt)) {
                                void updateSchedule(
                                  schedule,
                                  value,
                                  toTimeInput(schedule.endsAt)
                                );
                              }
                            }}
                            className="w-32"
                          />
                          <span className="text-[#A0AEC0]">—</span>
                          <Input
                            type="time"
                            aria-label={`Fin ${label}`}
                            defaultValue={toTimeInput(schedule.endsAt)}
                            onBlur={(e) => {
                              const value = e.target.value;
                              if (value && value !== toTimeInput(schedule.endsAt)) {
                                void updateSchedule(
                                  schedule,
                                  toTimeInput(schedule.startsAt),
                                  value
                                );
                              }
                            }}
                            className="w-32"
                          />
                        </div>

                        <div className="flex items-center gap-3 sm:ml-auto">
                          <div className="flex items-center gap-2">
                            <Switch
                              aria-label={`Activo ${label}`}
                              checked={schedule.isActive}
                              onCheckedChange={() => void toggleActive(schedule)}
                            />
                            <span className="text-xs text-[#718096]">
                              {schedule.isActive ? 'Activo' : 'Inactivo'}
                            </span>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-red-300 text-red-500 hover:bg-red-50"
                            aria-label={`Eliminar ${label}`}
                            onClick={() => void deleteSchedule(schedule.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </>
                    ) : (
                      <span className="text-sm text-[#A0AEC0] flex-1">
                        Sin horario configurado
                      </span>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Dialog crear horario */}
      <Dialog
        open={open}
        onOpenChange={(isOpen) => {
          if (!isOpen) handleClose();
        }}
      >
        <DialogContent className="w-[calc(100vw-2rem)] sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Añadir horario</DialogTitle>
          </DialogHeader>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <Label htmlFor="day">Día</Label>
              <Select
                value={form.day}
                onValueChange={(v) => setForm({ ...form, day: v as ScheduleDay })}
              >
                <SelectTrigger id="day">
                  <SelectValue placeholder="Selecciona un día" />
                </SelectTrigger>
                <SelectContent>
                  {availableDays.length === 0 && (
                    <div className="px-2 py-1.5 text-sm text-[#718096]">
                      Todos los días ya están configurados
                    </div>
                  )}
                  {availableDays.map((d) => (
                    <SelectItem key={d.value} value={d.value}>
                      {d.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.day && <p className="text-red-500 text-xs mt-1">{errors.day}</p>}
            </div>

            <Separator />

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="startsAt">Hora de inicio</Label>
                <div className="relative">
                  <Clock className="absolute left-3 top-3 w-4 h-4 text-[#A0AEC0] pointer-events-none" />
                  <Input
                    id="startsAt"
                    type="time"
                    className="pl-9"
                    value={form.startsAt}
                    onChange={(e) => setForm({ ...form, startsAt: e.target.value })}
                  />
                </div>
                {errors.startsAt && (
                  <p className="text-red-500 text-xs mt-1">{errors.startsAt}</p>
                )}
              </div>
              <div>
                <Label htmlFor="endsAt">Hora de fin</Label>
                <div className="relative">
                  <Clock className="absolute left-3 top-3 w-4 h-4 text-[#A0AEC0] pointer-events-none" />
                  <Input
                    id="endsAt"
                    type="time"
                    className="pl-9"
                    value={form.endsAt}
                    onChange={(e) => setForm({ ...form, endsAt: e.target.value })}
                  />
                </div>
                {errors.endsAt && (
                  <p className="text-red-500 text-xs mt-1">{errors.endsAt}</p>
                )}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Button type="submit" className="flex-1 bg-[#4A5568] hover:bg-[#2D3748]">
                <Power className="w-4 h-4 mr-2" />
                Guardar horario
              </Button>
              <Button type="button" variant="outline" className="flex-1" onClick={handleClose}>
                Cancelar
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Schedules;