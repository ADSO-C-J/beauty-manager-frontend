import { Link, useNavigate } from "react-router";
import { useState } from "react";
import { Input } from "../../../../ui/components/input";
import { Label } from "../../../../ui/components/label";
import { Checkbox } from "../../../../ui/components/checkbox";
// import { useAuthStore, UserRole } from "../stores/authStore";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../ui/components/select";
import { Shield, Scissors, UserCircle, Users } from "lucide-react";
import { Button } from "../../../../ui/components/button";

export default function Login() {
  const navigate = useNavigate();
  // const login = useAuthStore((state) => state.login);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<string>("estilista");
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

    // await login(email, password, role);
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-[#F7FAFC] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="text-3xl font-semibold text-[#2D3748]">
            BeautyManager
          </Link>
          <p className="mt-2 text-[#4A5568]">Inicia sesión en tu cuenta</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="role" className="mb-2">
                Tipo de usuario
              </Label>
              <Select value={role} onValueChange={(value) => setRole(value as string)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {roles.map((r) => (
                    <SelectItem key={r.value} value={r.value}>
                      <div className="flex items-center gap-2">
                        <r.icon className="w-4 h-4" />
                        <div>
                          <div className="font-medium">{r.label}</div>
                          <div className="text-xs text-[#718096]">{r.description}</div>
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="email" className="mb-2">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setErrors({ ...errors, email: undefined });
                }}
                className={errors.email ? "border-[#F56565]" : ""}
                placeholder="tu@email.com"
              />
              {errors.email && <p className="text-[#F56565] text-sm mt-1">{errors.email}</p>}
            </div>

            <div>
              <Label htmlFor="password" className="mb-2">
                Contraseña
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setErrors({ ...errors, password: undefined });
                }}
                className={errors.password ? "border-[#F56565]" : ""}
                placeholder="••••••••"
              />
              {errors.password && <p className="text-[#F56565] text-sm mt-1">{errors.password}</p>}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Checkbox id="remember" />
                <Label htmlFor="remember" className="text-sm">
                  Recordarme
                </Label>
              </div>
              <a href="#" className="text-sm text-[#4A5568] hover:text-[#2D3748]">
                ¿Olvidaste tu contraseña?
              </a>
            </div>

            <Button type="submit" className="w-full bg-[#4A5568] text-white hover:bg-[#2D3748]">
              Iniciar sesión
            </Button>

            <p className="text-center text-sm text-[#4A5568]">
              ¿No tienes cuenta?{" "}
              <Link to="/register" className="text-[#2D3748] hover:underline font-medium">
                Regístrate
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
