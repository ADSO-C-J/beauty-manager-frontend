import { Link } from "react-router";
import { Button } from "@components/button";
import { Input } from "@components/input";
import { Label } from "@components/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@components/select";
import { useRegisterPresenter } from "./useRegisterPresenter";
import { ROUTES } from "@app/router/routes";

const Register = () => {
  const { handleSubmit, updateField, formData, errors } = useRegisterPresenter();

  return (
    <div className="min-h-screen bg-[#F7FAFC] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to={ROUTES.LANDING} className="text-3xl font-semibold text-[#2D3748]">
            BeautyManager
          </Link>
          <p className="mt-2 text-[#4A5568]">Crea tu cuenta</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <Label htmlFor="name">Nombre completo</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => updateField("name", e.target.value)}
                className={errors.name ? "border-[#F56565]" : ""}
                placeholder="Juan Pérez"
              />
              {errors.name && <p className="text-[#F56565] text-sm mt-1">{errors.name}</p>}
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => updateField("email", e.target.value)}
                className={errors.email ? "border-[#F56565]" : ""}
                placeholder="tu@email.com"
              />
              {errors.email && <p className="text-[#F56565] text-sm mt-1">{errors.email}</p>}
            </div>

            <div>
              <Label htmlFor="phone">Teléfono</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => updateField("phone", e.target.value)}
                className={errors.phone ? "border-[#F56565]" : ""}
                placeholder="+1 (555) 123-4567"
              />
              {errors.phone && <p className="text-[#F56565] text-sm mt-1">{errors.phone}</p>}
            </div>

            <div>
              <Label htmlFor="role">Rol</Label>
              <Select value={formData.role} onValueChange={(value) => updateField("role", value)}>
                <SelectTrigger className={errors.role ? "border-[#F56565]" : ""}>
                  <SelectValue placeholder="Selecciona tu rol" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cliente">Cliente</SelectItem>
                  <SelectItem value="recepcionista">Recepcionista</SelectItem>
                  <SelectItem value="estilista">Estilista</SelectItem>
                  <SelectItem value="administrador">Administrador</SelectItem>
                </SelectContent>
              </Select>
              {errors.role && <p className="text-[#F56565] text-sm mt-1">{errors.role}</p>}
            </div>

            <div>
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => updateField("password", e.target.value)}
                className={errors.password ? "border-[#F56565]" : ""}
                placeholder="••••••••"
              />
              {errors.password && <p className="text-[#F56565] text-sm mt-1">{errors.password}</p>}
            </div>

            <div>
              <Label htmlFor="confirmPassword">Confirmar contraseña</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => updateField("confirmPassword", e.target.value)}
                className={errors.confirmPassword ? "border-[#F56565]" : ""}
                placeholder="••••••••"
              />
              {errors.confirmPassword && (
                <p className="text-[#F56565] text-sm mt-1">{errors.confirmPassword}</p>
              )}
            </div>

            <Button type="submit" className="w-full bg-[#4A5568] text-white hover:bg-[#2D3748]">
              Registrarse{" "}
            </Button>

            <p className="text-center text-sm text-[#4A5568]">
              ¿Ya tienes cuenta?{" "}
              <Link to={ROUTES.LOGIN} className="text-[#2D3748] hover:underline font-medium">
                Inicia sesión
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Register;