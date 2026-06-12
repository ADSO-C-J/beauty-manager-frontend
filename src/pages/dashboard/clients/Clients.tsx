import { Search, Plus, Phone, Mail, Calendar } from "lucide-react";
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

const frequencyColors = {
  Alta: "bg-[#48BB78] text-white",
  Media: "bg-[#ECC94B] text-[#2D3748]",
  Baja: "bg-[#A0AEC0] text-white",
};

const Clients = () => {
  const navigate = useNavigate();
  const {
    newClient,
    searchTerm,
    isDialogOpen,
    setNewClient,
    setSearchTerm,
    filteredClients,
    setIsDialogOpen,
    handleCreateClient,
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
                disabled={!newClient.name || !newClient.email || !newClient.phone}
              >
                Guardar cliente
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-3 w-4 h-4 text-[#A0AEC0]" />
        <Input
          placeholder="Buscar por nombre o email..."
          className="pl-9"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredClients.map((client) => (
          <Card key={client.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <Avatar className="w-12 h-12">
                  <AvatarFallback className="bg-[#4A5568] text-white">
                    {client.initials}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-[#2D3748] truncate">{client.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge
                      className={frequencyColors[client.frequency as keyof typeof frequencyColors]}
                    >
                      {client.frequency}
                    </Badge>
                    <span className="text-sm text-[#718096]">{client.visits} visitas</span>
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
                <div className="flex items-center gap-2 text-[#4A5568]">
                  <Calendar className="w-4 h-4" />
                  <span>
                    Última visita: {new Date(client.lastVisit).toLocaleDateString("es-ES")}
                  </span>
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
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredClients.length === 0 && (
        <div className="text-center py-12">
          <p className="text-[#718096]">No se encontraron clientes</p>
        </div>
      )}
    </div>
  );
}

export default Clients;