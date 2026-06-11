import { useState } from "react";
import { useLocation } from "react-router";

type Appointment = {
  id: number;
  date: string;
  time: string;
  client: string;
  service: string;
  stylist: string;
  duration: string;
  status: string;
  notes?: string;
};

export const useAppointmentsPresenter = () => {
  const location = useLocation();
  const [appointmentList, setAppointmentList] = useState<Appointment[]>(initialAppointments);
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [open, setOpen] = useState(!!location.state?.clientName);
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [form, setForm] = useState(
    location.state?.clientName
      ? { ...emptyForm, client: location.state.clientName }
      : emptyForm
  );
  
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleClose = () => {
    setOpen(false);
    setForm(emptyForm);
    setErrors({});
  }

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.client.trim()) e.client = "El cliente es obligatorio";
    if (!form.service) e.service = "Selecciona un servicio";
    if (!form.stylist) e.stylist = "Selecciona un estilista";
    if (!form.time) e.time = "Selecciona una hora";
    return e;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    const selectedService = services.find((s) => s.name === form.service);
    const newAppointment: Appointment = {
      id: Date.now(),
      date: date ? date.toISOString().split("T")[0] : new Date().toISOString().split("T")[0],
      time: form.time,
      client: form.client.trim(),
      service: form.service,
      stylist: form.stylist,
      duration: selectedService?.duration ?? "—",
      status: "pendiente",
      notes: form.notes.trim() || undefined,
    };
    setAppointmentList((prev) => [...prev, newAppointment]);
    handleClose();
  }

  const [detailApt, setDetailApt] = useState<Appointment | null>(null);

  const changeStatus = (id: number, status: string) => {
    setAppointmentList((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)));
    setDetailApt((prev) => (prev?.id === id ? { ...prev, status } : prev));
  }

  const filteredAppointments = appointmentList.filter((apt) => {
    const matchesStatus = filterStatus === "all" || apt.status === filterStatus;
    const matchesSearch =
      apt.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
      apt.service.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const todayStr = new Date().toISOString().split("T")[0];
  const todayAppointments = filteredAppointments.filter((apt) => apt.date === todayStr);

  return {
    date,
    open,
    form,
    errors,
    setForm,
    setOpen,
    setDate,
    services,
    detailApt,
    searchTerm,
    handleClose,
    filterStatus,
    setDetailApt,
    handleSubmit,
    changeStatus,
    setSearchTerm,
    setFilterStatus,
    todayAppointments,
    filteredAppointments
  };
};

const initialAppointments: Appointment[] = [
  {
    id: 1,
    date: "2026-04-23",
    time: "09:00",
    client: "Ana Martínez",
    service: "Corte de cabello",
    stylist: "Laura García",
    duration: "45min",
    status: "confirmada",
  },
  {
    id: 2,
    date: "2026-04-23",
    time: "10:30",
    client: "Carlos Ruiz",
    service: "Tinte + Corte",
    stylist: "María López",
    duration: "2h",
    status: "pendiente",
  },
  {
    id: 3,
    date: "2026-04-23",
    time: "14:00",
    client: "Sofía Hernández",
    service: "Manicure",
    stylist: "Laura García",
    duration: "1h",
    status: "confirmada",
  },
  {
    id: 4,
    date: "2026-04-24",
    time: "09:30",
    client: "Juan Pérez",
    service: "Corte + Barba",
    stylist: "Pedro Sánchez",
    duration: "1h",
    status: "confirmada",
  },
  {
    id: 5,
    date: "2026-04-24",
    time: "11:00",
    client: "Elena Torres",
    service: "Peinado especial",
    stylist: "María López",
    duration: "1.5h",
    status: "pendiente",
  },
  {
    id: 6,
    date: "2026-04-25",
    time: "10:00",
    client: "Roberto García",
    service: "Corte de cabello",
    stylist: "Laura García",
    duration: "45min",
    status: "confirmada",
  },
];

const emptyForm = {
  client: "",
  service: "",
  stylist: "",
  time: "",
  notes: "",
};

const services = [
  { name: "Corte de cabello", duration: "45min", price: "$25" },
  { name: "Tinte + Corte", duration: "2h", price: "$80" },
  { name: "Manicure", duration: "1h", price: "$30" },
  { name: "Corte + Barba", duration: "1h", price: "$35" },
  { name: "Peinado especial", duration: "1.5h", price: "$50" },
];