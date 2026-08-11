import { Badge } from "@components/badge";

type TimeSlotProps = {
  date: string;
  time: string;
  appointment?: {
    clientName: string;
    service: string;
    status: string;
  } | null;
  onClick: (date: string, time: string) => void;
};

const statusColors = {
  Confirmed: "bg-[#48BB78] text-white",
  Pending: "bg-[#ECC94B] text-[#2D3748]",
  Cancelled: "bg-[#F56565] text-white",
};

export default function TimeSlot({ date, time, appointment, onClick }: TimeSlotProps) {
  if (appointment) {
    return (
      <div className="p-1 h-16 border border-gray-100 bg-gray-50">
        <div className="bg-white rounded p-1.5 shadow-sm h-full flex flex-col justify-center">
          <p className="text-xs font-semibold text-[#2D3748] truncate">{appointment.clientName}</p>
          <p className="text-[10px] text-[#718096] truncate">{appointment.service}</p>
          <Badge className={`${statusColors[appointment.status as keyof typeof statusColors]} text-[10px] mt-0.5`}>
            {appointment.status}
          </Badge>
        </div>
      </div>
    );
  }

  return (
    <button
      onClick={() => onClick(date, time)}
      className="h-16 w-full border border-dashed border-gray-200 hover:bg-[#48BB78]/10 hover:border-[#48BB78] transition-colors cursor-pointer"
      title={`Agendar a las ${time}`}
    />
  );
}
