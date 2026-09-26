import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { staffServiceService } from "@modules/staff-services/application/staffServiceServices";
import { staffService } from "@modules/staff/application/staffServices";
import type { Stylist } from "@modules/appointments/domain/models/Stylist";

/**
 * Gestiona qué estilistas pueden realizar un servicio concreto.
 * La API es por estilista (staff/{id}/services), así que para un servicio
 * se consulta la relación de cada estilista y se filtra por serviceId.
 */
export function useServiceStaffPresenter() {
  const [stylists, setStylists] = useState<Stylist[]>([]);
  const [assignedIds, setAssignedIds] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(false);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadForService = useCallback(async (serviceId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const staff = await staffService.getStylists();
      setStylists(staff);

      // Para cada estilista, ver qué servicios tiene asignados.
      // El endpoint requiere el staff.id (no el user.id), expuesto como stylist.staffId.
      const results = await Promise.all(
        staff.map(async (s) => {
          if (!s.staffId) return null;
          try {
            const assigned = await staffServiceService.getStaffServices(s.staffId);
            const has = assigned.some((a) => a.serviceId === serviceId);
            return has ? s.staffId : null;
          } catch {
            return null;
          }
        })
      );
      setAssignedIds(new Set(results.filter((id): id is string => id !== null)));
    } catch {
      setError("No se pudieron cargar los estilistas");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    return () => {
      setStylists([]);
      setAssignedIds(new Set());
    };
  }, []);

  const toggleStylist = useCallback(
    async (serviceId: string, stylistStaffId: string) => {
      const isAssigned = assignedIds.has(stylistStaffId);
      setSavingId(stylistStaffId);
      try {
        if (isAssigned) {
          await staffServiceService.removeService(stylistStaffId, serviceId);
          setAssignedIds((prev) => {
            const next = new Set(prev);
            next.delete(stylistStaffId);
            return next;
          });
        } else {
          await staffServiceService.assignServices(stylistStaffId, [serviceId]);
          setAssignedIds((prev) => new Set(prev).add(stylistStaffId));
        }
        toast.success(isAssigned ? "Servicio desasignado" : "Servicio asignado");
      } catch {
        toast.error("No se pudo actualizar la asignación");
      } finally {
        setSavingId(null);
      }
    },
    [assignedIds]
  );

  return {
    stylists,
    assignedIds,
    isLoading,
    savingId,
    error,
    loadForService,
    toggleStylist,
  };
}