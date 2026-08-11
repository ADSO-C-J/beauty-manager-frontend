import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@components/button";
import TimeSlot from "./TimeSlot";
import { Fragment } from "react/jsx-runtime";
import type { Appointment } from "@modules/appointments/domain/models/Appointment";

type WeeklyViewProps = {
  weekDays: Date[];
  timeSlots: string[];
  appointments: Appointment[];
  onSlotClick: (date: string, time: string) => void;
  onPrevWeek: () => void;
  onNextWeek: () => void;
  onToday: () => void;
};

const dayNames = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];

function formatDate(date: Date): string {
  const pad = (n: number) => n.toString().padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

export default function WeeklyView({
  weekDays, timeSlots, appointments, onSlotClick, onPrevWeek, onNextWeek, onToday,
}: WeeklyViewProps) {
  return (
    <div className="flex-1 overflow-auto">
      {/* Barra de navegación */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={onPrevWeek}>
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={onNextWeek}>
            <ChevronRight className="w-4 h-4" />
          </Button>
          <Button variant="outline" onClick={onToday}>Hoy</Button>
        </div>
        <p className="text-sm font-medium text-[#2D3748]">
          {weekDays[0]?.toLocaleDateString("es-ES", { day: "numeric", month: "short" })} —{" "}
          {weekDays[6]?.toLocaleDateString("es-ES", { day: "numeric", month: "short" })}
        </p>
      </div>

      {/* Grid */}
      <div className="grid" style={{ gridTemplateColumns: "60px repeat(7, 1fr)" }}>
        {/* Esquina superior izquierda */}
        <div className="sticky left-0 bg-white z-10" />

        {/* Encabezado de días */}
        {weekDays.map((day, i) => (
          <div key={i} className="text-center py-2 border-b border-gray-200">
            <p className="text-xs font-semibold text-[#4A5568]">{dayNames[i]}</p>
            <p className="text-sm font-bold text-[#2D3748]">{day.getDate()}</p>
          </div>
        ))}

        {/* Filas de horas */}
        {timeSlots.map((time) => (
          <Fragment key={time}>
            {/* Columna de hora */}
            <div className="sticky left-0 bg-white text-right pr-2 text-xs text-[#718096] py-1 border-r border-gray-100">
              {time}
            </div>
            {/* Slots de cada día */}
            {weekDays.map((day) => {
              const dateStr = formatDate(day);
              const apt = appointments.find((a) => a.date === dateStr && a.time === time);
              return (
                <TimeSlot
                  key={`${dateStr}-${time}`}
                  date={dateStr}
                  time={time}
                  appointment={apt}
                  onClick={onSlotClick}
                />
              );
            })}
          </Fragment>
        ))}
      </div>
    </div>
  );
}
