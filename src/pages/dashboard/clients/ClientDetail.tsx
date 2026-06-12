import { Link } from "react-router";
import { ArrowLeft, Phone, Mail, Calendar, Star, Plus } from "lucide-react";
import { Button } from "@components/button";
import { Card, CardContent, CardHeader, CardTitle } from "@components/card";
import { Avatar, AvatarFallback } from "@components/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@components/tabs";
import { Separator } from "@components/separator";

const clientData = {
  id: 1,
  name: "Ana Martínez",
  email: "ana.martinez@email.com",
  phone: "+1 (555) 234-5678",
  visits: 24,
  lastVisit: "2026-04-20",
  frequency: "Alta",
  initials: "AM",
  memberSince: "2024-06-15",
};

const pastAppointments = [
  {
    id: 1,
    date: "2026-04-20",
    service: "Corte de cabello",
    stylist: "Laura García",
    notes: "Cliente prefiere corte en capas",
    rating: 5,
    price: "$25",
  },
  {
    id: 2,
    date: "2026-04-06",
    service: "Tinte + Corte",
    stylist: "María López",
    notes: "Tinte color castaño claro",
    rating: 5,
    price: "$80",
  },
  {
    id: 3,
    date: "2026-03-22",
    service: "Corte de cabello",
    stylist: "Laura García",
    notes: "Mismo estilo que la última vez",
    rating: 4,
    price: "$25",
  },
  {
    id: 4,
    date: "2026-03-08",
    service: "Peinado especial",
    stylist: "María López",
    notes: "Peinado para evento corporativo",
    rating: 5,
    price: "$50",
  },
];

const preferences = [
  { label: "Estilista preferido", value: "Laura García" },
  { label: "Horario preferido", value: "Mañanas (9:00 - 12:00)" },
  { label: "Servicios frecuentes", value: "Corte de cabello, Tinte" },
  { label: "Alergias", value: "Ninguna registrada" },
];

const notes = [
  {
    id: 1,
    date: "2026-04-20",
    author: "Laura García",
    content: "Cliente muy satisfecha con el resultado. Mencionó que volverá en 3 semanas.",
  },
  {
    id: 2,
    date: "2026-04-06",
    author: "María López",
    content: "Aplicado tinte castaño claro. Cliente pidió referencias para productos de cuidado.",
  },
];

export default function ClientDetail() {
  // const { id } = useParams();

  return (
    <div className="space-y-6">
      <div>
        <Link to="/dashboard/clients">
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver a clientes
          </Button>
        </Link>

        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row sm:items-start gap-6">
              <Avatar className="w-20 h-20">
                <AvatarFallback className="bg-[#4A5568] text-white text-2xl">
                  {clientData.initials}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-bold text-[#2D3748]">{clientData.name}</h2>
                    <p className="text-[#4A5568] mt-1">
                      Cliente desde{" "}
                      {new Date(clientData.memberSince).toLocaleDateString("es-ES", {
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                  <Link
                    to="/dashboard/appointments"
                    state={{ clientName: clientData.name, clientId: clientData.id }}
                  >
                    <Button className="bg-[#4A5568] hover:bg-[#2D3748] w-full sm:w-auto">
                      <Plus className="w-4 h-4 mr-2" />
                      Agendar cita
                    </Button>
                  </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-6">
                  <div className="flex items-center gap-2 text-[#4A5568] min-w-0">
                    <Mail className="w-4 h-4 shrink-0" />
                    <span className="text-sm truncate">{clientData.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[#4A5568]">
                    <Phone className="w-4 h-4 shrink-0" />
                    <span className="text-sm">{clientData.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[#4A5568]">
                    <Calendar className="w-4 h-4 shrink-0" />
                    <span className="text-sm">{clientData.visits} visitas totales</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="history" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="history">Historial</TabsTrigger>
          <TabsTrigger value="preferences">Preferencias</TabsTrigger>
          <TabsTrigger value="notes">Notas</TabsTrigger>
        </TabsList>

        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Citas pasadas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {pastAppointments.map((appointment, index) => (
                  <div key={appointment.id}>
                    <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-semibold text-[#2D3748]">{appointment.service}</h3>
                            <p className="text-sm text-[#4A5568] mt-1">
                              {new Date(appointment.date).toLocaleDateString("es-ES", {
                                weekday: "long",
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              })}
                            </p>
                            <p className="text-sm text-[#718096] mt-1">Con {appointment.stylist}</p>
                          </div>
                          <div className="flex flex-col items-end gap-2">
                            <span className="font-semibold text-[#2D3748]">
                              {appointment.price}
                            </span>
                            <div className="flex items-center gap-1">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-4 h-4 ${
                                    i < appointment.rating
                                      ? "fill-[#ECC94B] text-[#ECC94B]"
                                      : "text-[#E2E8F0]"
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                        {appointment.notes && (
                          <div className="mt-3 p-3 bg-[#F7FAFC] rounded-lg">
                            <p className="text-sm text-[#4A5568]">{appointment.notes}</p>
                          </div>
                        )}
                      </div>
                    </div>
                    {index < pastAppointments.length - 1 && <Separator className="mt-6" />}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preferences" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Preferencias del cliente</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {preferences.map((pref, index) => (
                  <div key={index}>
                    <div className="flex flex-col sm:flex-row sm:justify-between gap-2">
                      <span className="font-medium text-[#2D3748]">{pref.label}</span>
                      <span className="text-[#4A5568]">{pref.value}</span>
                    </div>
                    {index < preferences.length - 1 && <Separator className="mt-4" />}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notes" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Notas del estilista</CardTitle>
                <Button variant="outline" size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Nueva nota
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {notes.map((note, index) => (
                  <div key={note.id}>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-[#2D3748]">{note.author}</span>
                        <span className="text-sm text-[#718096]">
                          {new Date(note.date).toLocaleDateString("es-ES")}
                        </span>
                      </div>
                      <p className="text-[#4A5568]">{note.content}</p>
                    </div>
                    {index < notes.length - 1 && <Separator className="mt-4" />}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
