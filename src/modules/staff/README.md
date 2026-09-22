# Módulo `staff`

Este módulo centraliza la lógica relacionada con el personal (estilistas).

Estructura:

- `domain/models/Stylist.ts` — tipo `Stylist` (re-exportado desde `appointments`).
- `domain/ports/StaffRepository.ts` — puerto/contrato del repositorio.
- `infrastructure/repository/StaffApiRepository.ts` — implementación que usa `axiosClient` y llama a `/stylists`.
- `application/staffServices.ts` — servicios públicos que exponen `getStylists()` y `getStylistById()`.

Uso rápido:

```ts
import { staffService } from '@modules/staff/application/staffServices';

async function load() {
  const stylists = await staffService.getStylists();
  console.log('Estilistas:', stylists);
}

load();
```

Notas:
- `appointmentService.getStylists()` ahora delega en `staffService` para tener una única fuente de verdad.
- Si añades nuevas funciones de staff (CRUD), extiende `StaffRepository` y actualiza `StaffApiRepository`.
