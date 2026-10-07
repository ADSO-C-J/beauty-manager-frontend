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

  const handleCreateClient = async () => {
    if (!newClient.name.trim() || !newClient.email.trim() || !newClient.phone.trim()) {
      setError("Nombre, email y teléfono son obligatorios");
      return;
    }
    setIsSaving(true);
    setError(null);
    try {
      const created = await clientService.createClient({
        name: newClient.name.trim(),
        email: newClient.email.trim(),
        phone: newClient.phone.trim(),
      });
      setClientList((prev) => [...prev, created]);
      setIsDialogOpen(false);
      setNewClient(emptyForm);
    } catch {
      setError("No se pudo crear el cliente (¿email duplicado?)");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteClient = async (id: string) => {
    try {
      await clientService.deleteClient(id);
      setClientList((prev) => prev.filter((c) => c.id !== id));
    } catch {
      setError("No se pudo eliminar el cliente");
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
    handleCreateClient,
    handleDeleteClient,
    reload,
  };
};