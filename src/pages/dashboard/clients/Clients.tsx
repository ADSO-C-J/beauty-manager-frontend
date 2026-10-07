import { Search, Plus, Phone, Mail, Trash2, X } from "lucide-react";
import { Button } from "@components/button";
import { Input } from "@components/input";
import { Card, CardContent } from "@components/card";
import { Avatar, AvatarFallback } from "@components/avatar";
import { Badge } from "@components/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@components/dialog";
import { Label } from "@components/label";
import { useNavigate } from "react-router-dom";
import { useClientPresenter } from "./useClientPresenter";

function initialsOf(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

const Clients = () => {
  const navigate = useNavigate();
  const {
    newClient,
    searchTerm,
    isDialogOpen,
    isLoading,
    isSaving,
    error,
    clearError,
    setNewClient,
    setSearchTerm,
    filteredClients,
    setIsDialogOpen,
    handleCreateClient,
    handleDeleteClient,
  } = useClientPresenter();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-[#2D3748]">Clientes</h2>
          <p className="text-[#4A5568] mt-1">
            Gestiona la información y el historial de tus clientes
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#4A5568] hover:bg-[#2D3748] w-full sm:w-auto">
              <Plus className="w-4 h-4 mr-2" />
              Nuevo cliente
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Agregar nuevo cliente</DialogTitle>
              <DialogDescription>
                Completa la información del nuevo cliente. Haz clic en guardar cuando termines.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Nombre completo</Label>
                <Input
                  id="name"
                  placeholder="Ej: María García"
                  value={newClient.name}
                  onChange={(e) => setNewClient({ ...newClient, name: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Correo electrónico</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Ej: maria@email.com"
                  value={newClient.email}
                  onChange={(e) => setNewClient({ ...newClient, email: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="phone">Teléfono</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="Ej: +1 (555) 123-4567"
                  value={newClient.phone}
                  onChange={(e) => setNewClient({ ...newClient, phone: e.target.value })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancelar
              </Button>
              <Button
                className="bg-[#4A5568] hover:bg-[#2D3748]"
                onClick={handleCreateClient}
                disabled={
                  isSaving || !newClient.name || !newClient.email || !newClient.phone
                }
              >
                {isSaving ? "Guardando..." : "Guardar cliente"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {error && (
        <div
          className="flex items-center justify-between rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600 cursor-pointer"
          onClick={clearError}
        >
          {error}
          <X className="w-4 h-4" />
        </div>
      )}

      <div className="relative">
        <Search className="absolute left-3 top-3 w-4 h-4 text-[#A0AEC0]" />
        <Input
          placeholder="Buscar por nombre o email..."
          className="pl-9"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {isLoading ? (
        <p className="text-sm text-[#718096]">Cargando clientes...</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredClients.map((client) => (
            <Card key={client.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <Avatar className="w-12 h-12">
                    <AvatarFallback className="bg-[#4A5568] text-white">
                      {client.initials || initialsOf(client.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-[#2D3748] truncate">{client.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge className="bg-[#4A5568] text-white">Cliente</Badge>
                    </div>
                  </div>
                </div>

                <div className="mt-4 space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-[#4A5568]">
                    <Mail className="w-4 h-4" />
                    <span className="truncate">{client.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[#4A5568]">
                    <Phone className="w-4 h-4" />
                    <span>{client.phone}</span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-2 gap-2">
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => navigate(`/dashboard/clients/${client.id}`)}
                  >
                    Ver historial
                  </Button>
                  <Button
                    className="w-full bg-[#4A5568] hover:bg-[#2D3748]"
                    onClick={() =>
                      navigate("/dashboard/appointments", {
                        state: { clientName: client.name, clientId: client.id },
                      })
                    }
                  >
                    Agendar cita
                  </Button>
                </div>
                <div className="mt-2">
                  <Button
                    variant="ghost"
                    className="w-full text-red-600 hover:text-red-700 hover:bg-red-50"
                    onClick={() => handleDeleteClient(client.id)}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Eliminar
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {!isLoading && filteredClients.length === 0 && (
        <div className="text-center py-12">
          <p className="text-[#718096]">No se encontraron clientes</p>
        </div>
      )}
    </div>
  );
}

export default Clients;