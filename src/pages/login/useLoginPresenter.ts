import { useState } from "react";
import { useNavigate } from "react-router";
import { useAuthStore } from "@modules/auth/application/state/authStore";
import { ROUTES } from "@app/router/routes";

export const useLoginPresenter = () => {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const isLoading = useAuthStore((state) => state.isLoading);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string; general?: string }>({});

  const roles = [] as any[]; // Ya no se muestra; se mantiene la estructura vacía para no romper imports

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { email?: string; password?: string; general?: string } = {};

    if (!email) {
      newErrors.email = "El email es requerido";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Email inválido";
    }

    if (!password) {
      newErrors.password = "La contraseña es requerida";
    } else if (password.length < 6) {
      newErrors.password = "La contraseña debe tener al menos 6 caracteres";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      await login(email, password);
      navigate(ROUTES.DASHBOARD);
    } catch (error) {
      const message = error instanceof Error ? error.message : "No se pudo iniciar sesión";
      setErrors({ general: message });
    }
  };

  return {
    handleSubmit,
    role: undefined,
    setRole: () => {},
    email,
    setEmail,
    password,
    setPassword,
    errors,
    roles,
    setErrors,
    isLoading
  }
}

