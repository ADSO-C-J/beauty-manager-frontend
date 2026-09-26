import { useState } from "react";
import { Link, useParams } from "react-router";
import { ArrowLeft, Phone, Mail, Calendar, Plus, Trash2, X } from "lucide-react";
import { Button } from "@components/button";
import { Card, CardContent, CardHeader, CardTitle } from "@components/card";
import { Avatar, AvatarFallback } from "@components/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@components/tabs";
import { Separator } from "@components/separator";
import { Input } from "@components/input";
import { useClientDetailPresenter } from "./useClientDetailPresenter";

export default function ClientDetail() {
  const { id } = useParams();
  const {
    client,
    clientInitials,
    notes,
    preferences,
    isLoading,
    isSavingNote,
    error,
    clearError,
    addNote,
    removeNote,
    upsertPreference,
    removePreference,
  } = useClientDetailPresenter(id);

  const [newNote, setNewNote] = useState("");
  const [showNoteForm, setShowNoteForm] = useState(false);
  const [newPrefKey, setNewPrefKey] = useState("");
  const [newPrefValue, setNewPrefValue] = useState("");

  const handleAddNote = async () => {
    const ok = await addNote(newNote);
    if (ok) {
      setNewNote("");
      setShowNoteForm(false);
    }
  };

  const handleAddPreference = async () => {
    const ok = await upsertPreference(newPrefKey, newPrefValue);
    if (ok) {
      setNewPrefKey("");
      setNewPrefValue("");
    }
  };

  const formatDate = (value?: string) =>
    value ? new Date(value).toLocaleDateString("es-ES") : "";

  return (
    <div className="space-y-6">
      <div>
        <Link to="/dashboard/clients">
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver a clientes
          </Button>
        </Link>

        {error && (
          <div
            className="mb-4 flex items-center justify-between rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600"
            onClick={clearError}
          >
            {error}
            <X className="w-4 h-4 cursor-pointer" />
          </div>
        )}

        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row sm:items-start gap-6">
              <Avatar className="w-20 h-20">
                <AvatarFallback className="bg-[#4A5568] text-white text-2xl">
                  {clientInitials || "--"}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-bold text-[#2D3748]">
                      {client?.name ?? "Cliente"}
                    </h2>
                  </div>
                  <Link
                    to="/dashboard/appointments"
                    state={{ clientName: client?.name, clientId: client?.id }}
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
                    <span className="text-sm truncate">{client?.email ?? "—"}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[#4A5568]">
                    <Phone className="w-4 h-4 shrink-0" />
                    <span className="text-sm">{client?.phone ?? "—"}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[#4A5568]">
                    <Calendar className="w-4 h-4 shrink-0" />
                    <span className="text-sm">
                      Cliente desde {formatDate(client?.createdAt) || "—"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {isLoading && (
        <p className="text-sm text-[#718096]">Cargando datos del cliente...</p>
      )}

      <Tabs defaultValue="preferences" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="preferences">Preferencias</TabsTrigger>
          <TabsTrigger value="notes">Notas</TabsTrigger>
        </TabsList>

        <TabsContent value="preferences" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Preferencias del cliente</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-3 mb-6">
                <Input
                  placeholder="Clave (ej: estilista_preferido)"
                  value={newPrefKey}
                  onChange={(e) => setNewPrefKey(e.target.value)}
                />
                <Input
                  placeholder="Valor (ej: Laura García)"
                  value={newPrefValue}
                  onChange={(e) => setNewPrefValue(e.target.value)}
                />
                <Button
                  className="bg-[#4A5568] hover:bg-[#2D3748] shrink-0"
                  onClick={handleAddPreference}
                  disabled={!newPrefKey.trim() || !newPrefValue.trim()}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Agregar
                </Button>
              </div>

              {preferences.length === 0 ? (
                <p className="text-sm text-[#718096]">
                  Este cliente aún no tiene preferencias registradas.
                </p>
              ) : (
                <div className="space-y-4">
                  {preferences.map((pref, index) => (
                    <div key={pref.id}>
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-medium text-[#2D3748]">{pref.key}</span>
                        <div className="flex items-center gap-3">
                          <span className="text-[#4A5568]">{pref.value}</span>
                          <button
                            onClick={() => removePreference(pref.id)}
                            className="text-[#718096] hover:text-red-600"
                            aria-label="Eliminar preferencia"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      {index < preferences.length - 1 && <Separator className="mt-4" />}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notes" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Notas del estilista</CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowNoteForm((v) => !v)}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Nueva nota
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {showNoteForm && (
                <div className="mb-6 space-y-3">
                  <textarea
                    className="w-full rounded-lg border border-[#E2E8F0] p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#4A5568]"
                    rows={3}
                    placeholder="Escribe una nota sobre el cliente..."
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                  />
                  <div className="flex gap-2">
                    <Button
                      className="bg-[#4A5568] hover:bg-[#2D3748]"
                      onClick={handleAddNote}
                      disabled={!newNote.trim() || isSavingNote}
                    >
                      {isSavingNote ? "Guardando..." : "Guardar nota"}
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={() => {
                        setShowNoteForm(false);
                        setNewNote("");
                      }}
                    >
                      Cancelar
                    </Button>
                  </div>
                </div>
              )}

              {notes.length === 0 ? (
                <p className="text-sm text-[#718096]">
                  Este cliente aún no tiene notas registradas.
                </p>
              ) : (
                <div className="space-y-4">
                  {notes.map((note, index) => (
                    <div key={note.id}>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-[#2D3748]">
                            {note.staffName || "Equipo"}
                          </span>
                          <div className="flex items-center gap-3">
                            <span className="text-sm text-[#718096]">
                              {formatDate(note.createdAt)}
                            </span>
                            <button
                              onClick={() => removeNote(note.id)}
                              className="text-[#718096] hover:text-red-600"
                              aria-label="Eliminar nota"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                        <p className="text-[#4A5568]">{note.content}</p>
                      </div>
                      {index < notes.length - 1 && <Separator className="mt-4" />}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
