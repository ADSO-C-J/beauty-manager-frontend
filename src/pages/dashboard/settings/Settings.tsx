import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@components/card";
import { Button } from "@components/button";
import { Input } from "@components/input";
import { Label } from "@components/label";
import { Switch } from "@components/switch";
import { Separator } from "@components/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@components/tabs";

const Settings = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl md:text-3xl font-bold text-[#2D3748]">Configuración</h2>
        <p className="text-[#4A5568] mt-1">Personaliza las opciones de tu cuenta y negocio</p>
      </div>

      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList className="w-full sm:w-auto grid grid-cols-3 sm:inline-flex">
          <TabsTrigger value="profile">Perfil</TabsTrigger>
          <TabsTrigger value="business">Negocio</TabsTrigger>
          <TabsTrigger value="notifications">Avisos</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Información personal</CardTitle>
              <CardDescription>Actualiza tu información personal y de contacto</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">Nombre</Label>
                  <Input id="firstName" defaultValue="María" />
                </div>
                <div>
                  <Label htmlFor="lastName">Apellido</Label>
                  <Input id="lastName" defaultValue="García" />
                </div>
              </div>

              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" defaultValue="maria.garcia@email.com" />
              </div>

              <div>
                <Label htmlFor="phone">Teléfono</Label>
                <Input id="phone" type="tel" defaultValue="+1 (555) 987-6543" />
              </div>

              <Separator />

              <div>
                <h4 className="font-semibold text-[#2D3748] mb-4">Cambiar contraseña</h4>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="currentPassword">Contraseña actual</Label>
                    <Input id="currentPassword" type="password" />
                  </div>
                  <div>
                    <Label htmlFor="newPassword">Nueva contraseña</Label>
                    <Input id="newPassword" type="password" />
                  </div>
                  <div>
                    <Label htmlFor="confirmPassword">Confirmar contraseña</Label>
                    <Input id="confirmPassword" type="password" />
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button className="bg-[#4A5568] hover:bg-[#2D3748]">Guardar cambios</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="business">
          <Card>
            <CardHeader>
              <CardTitle>Información del negocio</CardTitle>
              <CardDescription>Configura los detalles de tu salón de belleza</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="businessName">Nombre del negocio</Label>
                <Input id="businessName" defaultValue="Salón Elegancia" />
              </div>

              <div>
                <Label htmlFor="businessAddress">Dirección</Label>
                <Input id="businessAddress" defaultValue="123 Calle Principal, Ciudad" />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="businessPhone">Teléfono del negocio</Label>
                  <Input id="businessPhone" defaultValue="+1 (555) 123-4567" />
                </div>
                <div>
                  <Label htmlFor="businessEmail">Email del negocio</Label>
                  <Input id="businessEmail" type="email" defaultValue="info@salonelegancia.com" />
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="font-semibold text-[#2D3748] mb-4">Horario de atención</h4>
                <div className="space-y-3">
                  {[
                    {
                      label: "Lunes - Viernes",
                      open: "9:00 AM",
                      close: "6:00 PM",
                      disabled: false,
                    },
                    { label: "Sábado", open: "10:00 AM", close: "4:00 PM", disabled: false },
                    { label: "Domingo", open: "Cerrado", close: "", disabled: true },
                  ].map((row) => (
                    <div
                      key={row.label}
                      className="flex flex-col sm:grid sm:grid-cols-3 sm:items-center gap-2"
                    >
                      <Label className="text-sm font-medium">{row.label}</Label>
                      <div className="grid grid-cols-2 gap-2 sm:contents">
                        <Input
                          defaultValue={row.open}
                          disabled={row.disabled}
                          placeholder="Apertura"
                        />
                        <Input
                          defaultValue={row.close}
                          disabled={row.disabled}
                          placeholder="Cierre"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end">
                <Button className="bg-[#4A5568] hover:bg-[#2D3748]">Guardar cambios</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Preferencias de notificaciones</CardTitle>
              <CardDescription>Controla qué notificaciones deseas recibir</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Recordatorios de citas</Label>
                  <p className="text-sm text-[#718096]">
                    Recibe recordatorios antes de cada cita programada
                  </p>
                </div>
                <Switch defaultChecked />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Nuevos clientes</Label>
                  <p className="text-sm text-[#718096]">
                    Notificación cuando un nuevo cliente se registre
                  </p>
                </div>
                <Switch defaultChecked />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Cancelaciones</Label>
                  <p className="text-sm text-[#718096]">
                    Alerta cuando un cliente cancele una cita
                  </p>
                </div>
                <Switch defaultChecked />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Reportes mensuales</Label>
                  <p className="text-sm text-[#718096]">Resumen de métricas y desempeño cada mes</p>
                </div>
                <Switch />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Actualizaciones del sistema</Label>
                  <p className="text-sm text-[#718096]">
                    Información sobre nuevas funcionalidades y mejoras
                  </p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex justify-end">
                <Button className="bg-[#4A5568] hover:bg-[#2D3748]">Guardar preferencias</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default Settings;