import { useState } from "react";
import { Shield, Scissors, UserCircle, Users } from "lucide-react";
import { useNavigate } from "react-router";
import { useAuthStore } from "@modules/auth/application/state/authStore";
import type { UserRole } from "@modules/auth/application/state/authStore";
import { ROUTES } from "@app/router/routes";

export const useLoginPresenter = () => {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const isLoading = useAuthStore((state) => state.isLoading);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>("estilista");
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const roles = [
    {
      value: "administrador" as string,
      label: "Administrador",
      icon: Shield,
      description: "Acceso completo al sistema",
    },
    {
      value: "estilista" as string,
      label: "Estilista",
      icon: Scissors,
      description: "Gestión de citas y clientes",
    },
    {
      value: "recepcionista" as string,
      label: "Recepcionista",
      icon: Users,
      description: "Gestión de citas",
    },
    {
      value: "cliente" as string,
      label: "Cliente",
      icon: UserCircle,
      description: "Consulta de citas y análisis",
    },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { email?: string; password?: string } = {};

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

    await login(email, password, role);
    navigate(ROUTES.DASHBOARD);
  };

  return {
    handleSubmit,
    role,
    setRole,
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

