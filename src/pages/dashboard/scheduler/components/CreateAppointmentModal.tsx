import { useState, useEffect, useRef } from "react";
import { Search } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@components/dialog";
import { Button } from "@components/button";
import { Input } from "@components/input";
import { Label } from "@components/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@components/select";
import { Avatar, AvatarFallback } from "@components/avatar";
import { clientService } from "@modules/clients/application/clientServices";
import type { Client } from "@modules/clients/domain/models/Client";
import type { CreateAppointmentData } from "@modules/appointments/domain/ports/AppointmentRepository";

type CreateAppointmentModalProps = {
  open: boolean;
  selectedSlot: {
    date: string;
    time: string;
    stylistId: string;
    stylistName: string;
  } | null;
  onClose: () => void;
  onSave: (data: CreateAppointmentData) => Promise<void> | void;
};

const services = [
  { name: "Corte de cabello", duration: "45min" },
  { name: "Tinte + Corte", duration: "2h" },
  { name: "Manicure", duration: "1h" },
  { name: "Corte + Barba", duration: "1h" },
  { name: "Peinado especial", duration: "1.5h" },
];

export default function CreateAppointmentModal({ open, selectedSlot, onClose, onSave }: CreateAppointmentModalProps) {
  const [client, setClient] = useState("");
  const [service, setService] = useState("");
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [clientResults, setClientResults] = useState<Client[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [saving, setSaving] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Resetear el formulario cuando se abre el modal
  useEffect(() => {
    if (open) {
      setClient("");
      setService("");
      setSelectedClient(null);
      setClientResults([]);
      setShowResults(false);
    }
  }, [open]);

  // Buscar clientes al escribir (con debounce de 300ms)
  useEffect(() => {
    if (client.trim().length < 2) {
      setClientResults([]);
      return;
    }
    const timer = setTimeout(() => {
      clientService
        .searchClients(client.trim())
        .then(setClientResults)
        .catch((err) => console.error("Error buscando clientes:", err));
    }, 300);
    return () => clearTimeout(timer);
  }, [client]);

  // Cerrar dropdown al hacer click fuera
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowResults(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSlot || !selectedClient || !service) return;

    setSaving(true);
    try {
      await onSave({
        clientId: selectedClient.id,
        service,
        stylistId: selectedSlot.stylistId,
        date: selectedSlot.date,
        time: selectedSlot.time,
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Agendar cita</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {selectedSlot && (
            <div className="bg-gray-50 rounded-lg p-3 text-sm">
              <p><strong>Estilista:</strong> {selectedSlot.stylistName}</p>
              <p><strong>Fecha:</strong> {selectedSlot.date}</p>
              <p><strong>Hora:</strong> {selectedSlot.time}</p>
            </div>
          )}

          {/* Lookup de clientes */}
          <div className="relative" ref={searchRef}>
            <Label>Cliente</Label>
            <div className="relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-[#A0AEC0]" />
              <Input
                className="pl-9"
                placeholder="Buscar cliente por nombre..."
                value={selectedClient ? selectedClient.name : client}
                onChange={(e) => {
                  setClient(e.target.value);
                  setSelectedClient(null);
                  setShowResults(true);
                }}
                onFocus={() => setShowResults(true)}
                required
              />
            </div>

            {showResults && clientResults.length > 0 && (
              <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                {clientResults.map((result) => (
                  <button
                    key={result.id}
                    type="button"
                    onClick={() => {
                      setSelectedClient(result);
                      setClient(result.name);
                      setShowResults(false);
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2 hover:bg-[#F7FAFC] text-left"
                  >
                    <Avatar className="w-8 h-8 shrink-0">
                      <AvatarFallback className="bg-[#4A5568] text-white text-xs">
                        {result.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-[#2D3748] truncate">{result.name}</p>
                      <p className="text-xs text-[#718096] truncate">{result.email}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {showResults && client.trim().length >= 2 && clientResults.length === 0 && (
              <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg p-3">
                <p className="text-sm text-[#718096]">No se encontraron clientes</p>
              </div>
            )}
          </div>

          <div>
            <Label>Servicio</Label>
            <Select value={service} onValueChange={setService}>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona servicio" />
              </SelectTrigger>
              <SelectContent>
                {services.map((s) => (
                  <SelectItem key={s.name} value={s.name}>
                    {s.name} — {s.duration}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-3 pt-2">
            <Button type="submit" className="flex-1 bg-[#4A5568] hover:bg-[#2D3748]" disabled={saving}>
              {saving ? "Guardando..." : "Confirmar"}
            </Button>
            <Button type="button" variant="outline" className="flex-1" onClick={onClose} disabled={saving}>
              Cancelar
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}