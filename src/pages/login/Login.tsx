import { Link } from "react-router";
import { Input } from "@components/input";
import { Label } from "@components/label";
import { Checkbox } from "@components/checkbox";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@components/select";
import { Button } from "@components/button";
import { useLoginPresenter } from "./useLoginPresenter";
// import type { UserRole } from "@modules/auth/application/state/authStore";
import { ROUTES } from "@app/router/routes";

 const Login = () => {
 const {
  //  role,
  //  roles,
   email,
   errors,
  //  setRole,
   setEmail,
   password,
   setErrors,
   setPassword,
   handleSubmit,
   isLoading,
  } = useLoginPresenter();

  return (
    <div className="min-h-screen bg-[#F7FAFC] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to={ROUTES.LANDING} className="text-3xl font-semibold text-[#2D3748]">
            BeautyManager
          </Link>
          <p className="mt-2 text-[#4A5568]">Inicia sesión en tu cuenta</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* <div>
              <Label htmlFor="role" className="mb-2">
                Tipo de usuario
              </Label>
              <Select value={role} onValueChange={(value) => setRole(value as UserRole)}>
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
            </div> */}

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

            {errors.general && (
              <p className="text-[#F56565] text-sm text-center">{errors.general}</p>
            )}

            <Button type="submit" disabled={isLoading} className="w-full bg-[#4A5568] text-white hover:bg-[#2D3748] disabled:opacity-50">
              {isLoading ? "Iniciando sesión..." : "Iniciar sesión"}
            </Button>

            <p className="text-center text-sm text-[#4A5568]">
              ¿No tienes cuenta?{" "}
              <Link to={ROUTES.REGISTER} className="text-[#2D3748] hover:underline font-medium">
                Regístrate
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;