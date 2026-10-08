import { useCallback, useEffect, useState } from "react";
import { clientService } from "@modules/clients/application/clientServices";
import type { Client } from "@modules/clients/domain/models/Client";

export interface NewClientForm {
  name: string;
  email: string;
  phone: string;
}

const emptyForm: NewClientForm = { name: "", email: "", phone: "" };

export const useClientPresenter = () => {
  const [clientList, setClientList] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newClient, setNewClient] = useState<NewClientForm>(emptyForm);
  // Modo del diálogo: crear (null) o editar un cliente existente (id).
  const [editingId, setEditingId] = useState<string | null>(null);
  // Cliente pendiente de confirmación de borrado.
  const [pendingDelete, setPendingDelete] = useState<Client | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadClients = useCallback(async (isCancelled?: () => boolean) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await clientService.searchClients("");
      if (isCancelled?.()) return;
      setClientList(data);
    } catch {
      if (isCancelled?.()) return;
      setError("No se pudieron cargar los clientes");
    } finally {
      if (!isCancelled?.()) setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    const isCancelled = () => cancelled;
    // Diferido para evitar setState sincrónico dentro del effect (patrón del proyecto).
    Promise.resolve()
      .then(() => loadClients(isCancelled))
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, [loadClients]);

  const reload = useCallback(async () => {
    await loadClients();
  }, [loadClients]);

  /** Abre el diálogo en modo creación (limpio). */
  const openCreate = () => {
    setEditingId(null);
    setNewClient(emptyForm);
    setIsDialogOpen(true);
  };

  /** Abre el diálogo en modo edición con los datos del cliente. */
  const openEdit = (client: Client) => {
    setEditingId(client.id);
    setNewClient({
      name: client.name ?? "",
      email: client.email ?? "",
      phone: client.phone ?? "",
    });
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setEditingId(null);
    setNewClient(emptyForm);
  };

  /** Extrae el mensaje del backend (o el fallback). */
  const apiErrorMessage = (err: unknown, fallback: string): string => {
    if (typeof err === "object" && err !== null) {
      const anyErr = err as { response?: { data?: { message?: string } } };
      return anyErr.response?.data?.message ?? fallback;
    }
    return fallback;
  };

  /** Crea o edita según el modo del diálogo. */
  const handleSaveClient = async () => {
    if (!newClient.name.trim() || !newClient.email.trim() || !newClient.phone.trim()) {
      setError("Nombre, email y teléfono son obligatorios");
      return;
    }
    setIsSaving(true);
    setError(null);
    try {
      const payload = {
        name: newClient.name.trim(),
        email: newClient.email.trim(),
        phone: newClient.phone.trim(),
      };
      if (editingId) {
        const updated = await clientService.updateClient(editingId, payload);
        setClientList((prev) =>
          prev.map((c) => (c.id === editingId ? { ...c, ...updated } : c)),
        );
      } else {
        const created = await clientService.createClient(payload);
        setClientList((prev) => [...prev, created]);
      }
      closeDialog();
    } catch (err) {
      setError(
        apiErrorMessage(
          err,
          editingId
            ? "No se pudo actualizar el cliente (¿email duplicado?)"
            : "No se pudo crear el cliente (¿email duplicado?)",
        ),
      );
    } finally {
      setIsSaving(false);
    }
  };

  /** Abre la confirmación de borrado. */
  const requestDelete = (client: Client) => {
    setPendingDelete(client);
  };

  const cancelDelete = () => {
    setPendingDelete(null);
  };

  /** Elimina el cliente pendiente de confirmación (DELETE /clients/{id}). */
  const confirmDelete = async () => {
    if (!pendingDelete) return;
    const target = pendingDelete;
    setIsDeleting(true);
    setError(null);
    try {
      await clientService.deleteClient(target.id);
      setClientList((prev) => prev.filter((c) => c.id !== target.id));
      setPendingDelete(null);
    } catch (err) {
      setPendingDelete(null);
      setError(apiErrorMessage(err, "No se pudo eliminar el cliente"));
    } finally {
      setIsDeleting(false);
    }
  };

  const term = searchTerm.trim().toLowerCase();
  const filteredClients = clientList.filter(
    (client) =>
      term === "" ||
      client.name.toLowerCase().includes(term) ||
      client.email.toLowerCase().includes(term),
  );

  return {
    newClient,
    searchTerm,
    isDialogOpen,
    isLoading,
    isSaving,
    error,
    clearError: () => setError(null),
    setNewClient,
    setSearchTerm,
    filteredClients,
    setIsDialogOpen,
    editingId,
    openCreate,
    openEdit,
    closeDialog,
    handleSaveClient,
    pendingDelete,
    isDeleting,
    requestDelete,
    cancelDelete,
    confirmDelete,
    reload,
  };
};