import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@app/router/routes";
import { useAuthStore } from "@modules/auth/application/state/authStore";
import type { UserRole } from "@modules/auth/application/state/authStore";

export const useRegisterPresenter = () => {
  const navigate = useNavigate();
  const register = useAuthStore((state) => state.register);
  const isLoading = useAuthStore((state) => state.isLoading);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    role: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!formData.name) newErrors.name = "El nombre es requerido";
    if (!formData.email) {
      newErrors.email = "El email es requerido";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email inválido";
    }
    if (!formData.phone) newErrors.phone = "El teléfono es requerido";
    if (!formData.password) {
      newErrors.password = "La contraseña es requerida";
    } else if (formData.password.length < 6) {
      newErrors.password = "La contraseña debe tener al menos 6 caracteres";
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Las contraseñas no coinciden";
    }
    if (!formData.role) newErrors.role = "Selecciona un rol";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      await register(
        formData.name,
        formData.email,
        formData.password,
        formData.phone,
        formData.role as UserRole
      );
      navigate(ROUTES.DASHBOARD);
    } catch (error) {
      console.error("Error al registrar el usuario:", error);
      setErrors({
        general: "No se pudo crear la cuenta. Inténtalo de nuevo más tarde.",
      });
    }
  };

  const updateField = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
    setErrors({ ...errors, [field]: "" });
  };

  return {
    handleSubmit,
    updateField,
    formData,
    errors,
    isLoading,
  };
};
