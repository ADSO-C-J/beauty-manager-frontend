import {
  Plus,
  Filter,
  Search,
  X,
  Pencil,
  Trash2,
  Mail,
  Phone,
  ShieldCheck,
  UserPlus,
} from "lucide-react";
import { Button } from "@components/button";
import { Card, CardContent } from "@components/card";
import { Badge } from "@components/badge";
import { Input } from "@components/input";
import { Label } from "@components/label";
import { Avatar, AvatarFallback } from "@components/avatar";
import { Separator } from "@components/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@components/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@components/select";
import type { UserRole } from "@modules/users/domain/models/SystemUser";
import { roleLabels, ROLE_OPTIONS } from "@modules/users/infrastructure/mappers/userMapper";
import { useUsersPresenter } from "./useUsersPresenter";

const roleColors: Record<UserRole, string> = {
  administrador: "bg-[#4A5568] text-white",
  estilista: "bg-[#9F7AEA] text-white",
  recepcionista: "bg-[#4299E1] text-white",
  cliente: "bg-gray-200 text-[#4A5568]",
};

const initialsOf = (name: string) =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");

const formatDate = (iso?: string) =>
  iso
    ? new Date(iso).toLocaleDateString("es-ES", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "—";

const Users = () => {
  const {
    isLoading,
    isSaving,
    error,
    clearError,
    searchTerm,
    setSearchTerm,
    filterRole,
    setFilterRole,
    open,
    editingId,
    form,
    setForm,
    errors,
    openCreate,
    openEdit,
    handleClose,
    handleSubmit,
    deleteUser,
    filteredUsers,
    activeCount,
  } = useUsersPresenter();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-[#2D3748]">Usuarios</h2>
          <p className="text-[#4A5568] mt-1">Gestiona las cuentas y roles del personal del salón</p>
        </div>
        <Button className="bg-[#4A5568] hover:bg-[#2D3748] w-full sm:w-auto" onClick={openCreate}>
          <Plus className="w-4 h-4 mr-2" />
          Nuevo usuario
        </Button>

        <Dialog
          open={open}
          onOpenChange={(isOpen) => {
            if (!isOpen) handleClose();
          }}
        >
          <DialogContent className="w-[calc(100vw-2rem)] sm:max-w-lg max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingId ? "Editar usuario" : "Nuevo usuario"}</DialogTitle>
            </DialogHeader>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <Label htmlFor="name">Nombre</Label>
                <Input
                  id="name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
              </div>

              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="phone">Teléfono (opcional)</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="role">Rol</Label>
                  <Select
                    value={form.role}
                    onValueChange={(v) => setForm({ ...form, role: v as UserRole })}
                  >
                    <SelectTrigger id="role">
                      <SelectValue placeholder="Selecciona un rol" />
                    </SelectTrigger>
                    <SelectContent>
                      {ROLE_OPTIONS.map((r) => (
                        <SelectItem key={r} value={r}>
                          {roleLabels[r]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.role && <p className="text-red-500 text-xs mt-1">{errors.role}</p>}
                </div>
              </div>

              <Separator />

              <div>
                <Label htmlFor="password">
                  {editingId ? "Contraseña (se guardará de nuevo)" : "Contraseña"}
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                />
                <p className="text-xs text-[#718096] mt-1">
                  Mínimo 6 caracteres.
                  {editingId ? " El backend exige enviar la contraseña en cada actualización." : ""}
                </p>
                {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <Button
                  type="submit"
                  disabled={isSaving}
                  className="flex-1 bg-[#4A5568] hover:bg-[#2D3748]"
                >
                  <UserPlus className="w-4 h-4 mr-2" />
                  {isSaving ? "Guardando..." : editingId ? "Guardar cambios" : "Crear usuario"}
                </Button>
                <Button type="button" variant="outline" className="flex-1" onClick={handleClose}>
                  Cancelar
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Resumen */}
      <Card>
        <CardContent className="p-4 flex items-center gap-4">
          <div className="p-3 rounded-lg bg-[#4A5568]/10">
            <ShieldCheck className="w-6 h-6 text-[#4A5568]" />
          </div>
          <div>
            <p className="text-sm text-[#718096]">Usuarios activos</p>
            <p className="text-xl font-bold text-[#2D3748]">
              {activeCount} / {filteredUsers.length}
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 w-4 h-4 text-[#A0AEC0]" />
          <Input
            placeholder="Buscar por nombre, email o teléfono..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select value={filterRole} onValueChange={(v) => setFilterRole(v as UserRole | "all")}>
          <SelectTrigger className="w-full sm:w-52">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los roles</SelectItem>
            {ROLE_OPTIONS.map((r) => (
              <SelectItem key={r} value={r}>
                {roleLabels[r]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {error && (
        <div
          className="flex items-center justify-between rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600"
          onClick={clearError}
        >
          {error}
          <X className="w-4 h-4 cursor-pointer" />
        </div>
      )}

      <div className="grid gap-4">
        {isLoading && <p className="text-sm text-[#718096]">Cargando usuarios...</p>}
        {!isLoading && filteredUsers.length === 0 && (
          <p className="text-sm text-[#718096]">No hay usuarios que coincidan.</p>
        )}
        {filteredUsers.map((user) => (
          <Card key={user.id}>
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <Avatar className="w-11 h-11 shrink-0">
                    <AvatarFallback className="bg-[#4A5568] text-white text-sm font-semibold">
                      {initialsOf(user.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold text-[#2D3748]">{user.name}</h3>
                      <Badge className={roleColors[user.role]}>{roleLabels[user.role]}</Badge>
                      {!user.isActive && (
                        <Badge className="bg-[#F56565] text-white">Inactivo</Badge>
                      )}
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-x-4 text-sm text-[#718096] mt-1">
                      <span className="flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5" />
                        {user.email}
                      </span>
                      {user.phone && (
                        <span className="flex items-center gap-1.5">
                          <Phone className="w-3.5 h-3.5" />
                          {user.phone}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[#A0AEC0] mt-1">
                      Alta: {formatDate(user.createdAt)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 sm:ml-auto">
                  <Button
                    variant="outline"
                    size="sm"
                    aria-label={`Editar ${user.name}`}
                    onClick={() => openEdit(user)}
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    aria-label={`Eliminar ${user.name}`}
                    className="border-red-300 text-red-500 hover:bg-red-50"
                    onClick={() => void deleteUser(user)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Users;
