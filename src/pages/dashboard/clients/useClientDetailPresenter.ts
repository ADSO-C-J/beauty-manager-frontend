import { useCallback, useEffect, useState } from 'react';
import { clientService } from '@modules/clients/application/clientServices';
import { clientNoteService } from '@modules/client-notes/application/clientNoteServices';
import { clientPreferenceService } from '@modules/client-preferences/application/clientPreferenceServices';
import type { Client } from '@modules/clients/domain/models/Client';
import type { ClientNote } from '@modules/client-notes/domain/models/ClientNote';
import type { ClientPreference } from '@modules/client-preferences/domain/models/ClientPreference';

function initialsOf(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');
}

export function useClientDetailPresenter(clientId: string | undefined) {
  const [client, setClient] = useState<Client | null>(null);
  const [notes, setNotes] = useState<ClientNote[]>([]);
  const [preferences, setPreferences] = useState<ClientPreference[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSavingNote, setIsSavingNote] = useState(false);

  const loadAll = useCallback(
    async (isCancelled?: () => boolean) => {
      if (!clientId) return;
      setIsLoading(true);
      setError(null);
      try {
        const [clientData, notesData, prefsData] = await Promise.all([
          clientService.getClientById(clientId),
          clientNoteService.getNotes(clientId),
          clientPreferenceService.getPreferences(clientId),
        ]);
        if (isCancelled?.()) return;
        setClient(clientData);
        setNotes(notesData);
        setPreferences(prefsData);
      } catch {
        if (isCancelled?.()) return;
        setError('No se pudieron cargar los datos del cliente');
      } finally {
        if (!isCancelled?.()) setIsLoading(false);
      }
    },
    [clientId]
  );

  useEffect(() => {
    let cancelled = false;
    const isCancelled = () => cancelled;
    // Diferido para evitar setState sincrónico dentro del effect (patrón del proyecto).
    Promise.resolve()
      .then(() => loadAll(isCancelled))
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, [loadAll]);

  const addNote = useCallback(
    async (content: string) => {
      if (!clientId || !content.trim()) return false;
      setIsSavingNote(true);
      try {
        const created = await clientNoteService.createNote(clientId, {
          content: content.trim(),
        });
        setNotes((prev) => [created, ...prev]);
        return true;
      } catch {
        setError('No se pudo guardar la nota');
        return false;
      } finally {
        setIsSavingNote(false);
      }
    },
    [clientId]
  );

  const removeNote = useCallback(
    async (id: string) => {
      if (!clientId) return;
      try {
        await clientNoteService.deleteNote(clientId, id);
        setNotes((prev) => prev.filter((n) => n.id !== id));
      } catch {
        setError('No se pudo eliminar la nota');
      }
    },
    [clientId]
  );

  const upsertPreference = useCallback(
    async (key: string, value: string) => {
      if (!clientId || !key.trim() || !value.trim()) return false;
      try {
        const saved = await clientPreferenceService.upsertPreference(clientId, {
          key: key.trim(),
          value: value.trim(),
        });
        setPreferences((prev) => {
          const exists = prev.some((p) => p.id === saved.id);
          return exists ? prev.map((p) => (p.id === saved.id ? saved : p)) : [...prev, saved];
        });
        return true;
      } catch {
        setError('No se pudo guardar la preferencia');
        return false;
      }
    },
    [clientId]
  );

  const removePreference = useCallback(
    async (id: string) => {
      if (!clientId) return;
      try {
        await clientPreferenceService.deletePreference(clientId, id);
        setPreferences((prev) => prev.filter((p) => p.id !== id));
      } catch {
        setError('No se pudo eliminar la preferencia');
      }
    },
    [clientId]
  );

  return {
    client,
    clientInitials: client ? initialsOf(client.name) : '',
    notes,
    preferences,
    isLoading,
    isSavingNote,
    error,
    clearError: () => setError(null),
    addNote,
    removeNote,
    upsertPreference,
    removePreference,
  };
}