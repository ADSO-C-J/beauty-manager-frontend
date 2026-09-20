import { useState, useEffect } from "react";
import { toast } from "sonner";
import { serviceService } from "@modules/services/application/serviceServices";
import type {
  Service,
  ServiceCategory,
} from "@modules/services/domain/models/Service";
import type { CreateServiceData } from "@modules/services/domain/ports/ServiceRepository";

export const SERVICE_CATEGORIES: ServiceCategory[] = [
  "Cabello",
  "Manos",
  "Pies",
  "Caballeros",
  "Facial",
  "Otro",
];

const emptyForm = {
  name: "",
  category: "Cabello" as ServiceCategory,
  duration: "",
  price: "",
  description: "",
};

type ModalMode = "create" | "edit";

/** Convierte minutos a un texto legible: 45 -> "45min", 90 -> "1.5h", 120 -> "2h" */
function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes}min`;
  const hours = minutes / 60;
  return `${Number.isInteger(hours) ? hours : hours.toFixed(1)}h`;
}

/** Convierte un texto de duración ("45min", "2h", "1.5h", "90") a minutos */
function parseDurationToMinutes(input: string): number | null {
  const value = input.trim().toLowerCase();
  if (!value) return null;
  if (/^\d+$/.test(value)) return Number(value);

  const hoursMatch = value.match(/^(\d+(?:\.\d+)?)\s*h/);
  if (hoursMatch) return Math.round(Number(hoursMatch[1]) * 60);

  const minMatch = value.match(/^(\d+(?:\.\d+)?)\s*min/);
  if (minMatch) return Math.round(Number(minMatch[1]));

  return null;
}

export const useServicesPresenter = () => {
  const [serviceList, setServiceList] = useState<Service[]>([]);
  const [activeCategory, setActiveCategory] = useState("Todos");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Form modal (create / edit)
  const [showFormModal, setShowFormModal] = useState(false);
  const [modalMode, setModalMode] = useState<ModalMode>("create");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Detail modal
  const [detailService, setDetailService] = useState<Service | null>(null);

  useEffect(() => {
    let cancelled = false;
    serviceService
      .getServices()
      .then((data) => {
        if (!cancelled) setServiceList(data);
      })
      .catch((err) => {
        console.error("Error cargando servicios:", err);
        toast.error("No se pudieron cargar los servicios");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const filteredServices =
    activeCategory === "Todos"
      ? serviceList
      : serviceList.filter((s) => s.category === activeCategory);

  const openCreate = () => {
    setModalMode("create");
    setEditingId(null);
    setForm(emptyForm);
    setErrors({});
    setShowFormModal(true);
  };

  const openEdit = (service: Service) => {
    setModalMode("edit");
    setEditingId(service.id);
    setForm({
      name: service.name,
      category: service.category,
      duration: formatDuration(service.durationMin),
      price: String(service.price),
      description: service.description,
    });
    setErrors({});
    setShowFormModal(true);
  };

  const handleCloseForm = () => {
    setShowFormModal(false);
    setForm(emptyForm);
    setErrors({});
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "El nombre es obligatorio";
    if (!form.duration.trim()) e.duration = "La duración es obligatoria";
    else if (parseDurationToMinutes(form.duration) === null)
      e.duration = "Formato inválido (ej. 45min, 1.5h)";
    if (!form.price.trim()) e.price = "El precio es obligatorio";
    else if (Number.isNaN(Number(form.price)) || Number(form.price) <= 0)
      e.price = "El precio debe ser un número mayor a 0";
    return e;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    const durationMin = parseDurationToMinutes(form.duration);
    if (durationMin === null) return;

    const payload: CreateServiceData = {
      name: form.name.trim(),
      description: form.description.trim(),
      category: form.category,
      durationMin,
      price: Number(form.price),
    };

    setSaving(true);
    try {
      if (modalMode === "create") {
        const created = await serviceService.createService(payload);
        setServiceList((prev) => [...prev, created]);
        setActiveCategory("Todos");
        toast.success("Servicio creado");
      } else if (editingId) {
        const updated = await serviceService.updateService(editingId, payload);
        setServiceList((prev) =>
          prev.map((s) => (s.id === editingId ? updated : s)),
        );
        if (detailService?.id === editingId) setDetailService(updated);
        toast.success("Servicio actualizado");
      }
      handleCloseForm();
    } catch (err) {
      console.error("Error guardando servicio:", err);
      toast.error("No se pudo guardar el servicio");
    } finally {
      setSaving(false);
    }
  };

  const deleteService = async (id: string) => {
    try {
      await serviceService.deleteService(id);
      setServiceList((prev) => prev.filter((s) => s.id !== id));
      setDetailService((prev) => (prev?.id === id ? null : prev));
      toast.success("Servicio eliminado");
    } catch (err) {
      console.error("Error eliminando servicio:", err);
      toast.error("No se pudo eliminar el servicio");
    }
  };

  return {
    form,
    errors,
    saving,
    loading,
    setForm,
    openEdit,
    modalMode,
    openCreate,
    handleSubmit,
    showFormModal,
    detailService,
    activeCategory,
    handleCloseForm,
    deleteService,
    setDetailService,
    filteredServices,
    setActiveCategory,
  };
};
