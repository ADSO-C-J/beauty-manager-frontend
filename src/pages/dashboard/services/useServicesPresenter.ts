import { useState } from "react";


type Service = {
  id: number;
  name: string;
  category: string;
  duration: string;
  price: string;
  description: string;
  popular: boolean;
};

const initialServices: Service[] = [
  {
    id: 1,
    name: "Corte de cabello",
    category: "Cabello",
    duration: "45min",
    price: "$25",
    description: "Corte profesional de cabello para damas y caballeros",
    popular: true,
  },
  {
    id: 2,
    name: "Tinte completo",
    category: "Cabello",
    duration: "2h",
    price: "$80",
    description: "Aplicación de tinte profesional en todo el cabello",
    popular: true,
  },
  {
    id: 3,
    name: "Mechas/Luces",
    category: "Cabello",
    duration: "2.5h",
    price: "$95",
    description: "Aplicación de mechas o luces para dar dimensión al cabello",
    popular: false,
  },
  {
    id: 4,
    name: "Manicure",
    category: "Manos",
    duration: "1h",
    price: "$30",
    description: "Cuidado y embellecimiento de uñas y manos",
    popular: true,
  },
  {
    id: 5,
    name: "Pedicure",
    category: "Pies",
    duration: "1h",
    price: "$35",
    description: "Cuidado y embellecimiento de uñas y pies",
    popular: false,
  },
  {
    id: 6,
    name: "Peinado especial",
    category: "Cabello",
    duration: "1.5h",
    price: "$50",
    description: "Peinado elaborado para eventos especiales",
    popular: false,
  },
  {
    id: 7,
    name: "Corte + Barba",
    category: "Caballeros",
    duration: "1h",
    price: "$35",
    description: "Servicio completo de corte de cabello y arreglo de barba",
    popular: true,
  },
  {
    id: 8,
    name: "Tratamiento capilar",
    category: "Cabello",
    duration: "1h",
    price: "$45",
    description: "Tratamiento de hidratación y reparación capilar",
    popular: false,
  },
];

const emptyForm = {
  name: "",
  category: "Cabello",
  duration: "",
  price: "",
  description: "",
  popular: false,
};

type ModalMode = "create" | "edit";

export const useServicesPresenter = () => {
  const [serviceList, setServiceList] = useState<Service[]>(initialServices);
  const [activeCategory, setActiveCategory] = useState("Todos");

  // Form modal (create / edit)
  const [showFormModal, setShowFormModal] = useState(false);
  const [modalMode, setModalMode] = useState<ModalMode>("create");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Detail modal
  const [detailService, setDetailService] = useState<Service | null>(null);

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
  }

  const openEdit = (service: Service) => {
    setModalMode("edit");
    setEditingId(service.id);
    setForm({
      name: service.name,
      category: service.category,
      duration: service.duration,
      price: service.price.replace("$", ""),
      description: service.description,
      popular: service.popular,
    });
    setErrors({});
    setShowFormModal(true);
  }

  const handleCloseForm = () => {
    setShowFormModal(false);
    setForm(emptyForm);
    setErrors({});
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "El nombre es obligatorio";
    if (!form.duration.trim()) e.duration = "La duración es obligatoria";
    if (!form.price.trim()) e.price = "El precio es obligatorio";
    if (!form.description.trim()) e.description = "La descripción es obligatoria";
    return e;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    const priceFormatted = form.price.trim().startsWith("$")
      ? form.price.trim()
      : `$${form.price.trim()}`;

    if (modalMode === "create") {
      const newService: Service = {
        id: Date.now(),
        name: form.name.trim(),
        category: form.category,
        duration: form.duration.trim(),
        price: priceFormatted,
        description: form.description.trim(),
        popular: form.popular,
      };
      setServiceList((prev) => [...prev, newService]);
      setActiveCategory("Todos"); // make the new service always visible
    } else {
      setServiceList((prev) =>
        prev.map((s) =>
          s.id === editingId
            ? {
              ...s,
              name: form.name.trim(),
              category: form.category,
              duration: form.duration.trim(),
              price: priceFormatted,
              description: form.description.trim(),
              popular: form.popular,
            }
            : s,
        ),
      );
      // Refresh detail panel if it's open for this service
      if (detailService?.id === editingId) {
        setDetailService((prev) =>
          prev
            ? {
              ...prev,
              name: form.name.trim(),
              category: form.category,
              duration: form.duration.trim(),
              price: priceFormatted,
              description: form.description.trim(),
              popular: form.popular,
            }
            : prev,
        );
      }
    }

    handleCloseForm();
  }

  return {
    form,
    errors,
    setForm,
    openEdit,
    modalMode,
    openCreate,
    handleSubmit,
    showFormModal,
    detailService,
    activeCategory,
    handleCloseForm,
    setDetailService,
    filteredServices,
    setActiveCategory,
  };
}