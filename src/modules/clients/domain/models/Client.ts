export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  initials?: string;
  createdAt?: string;
}

// Datos que acepta el backend para crear/actualizar un cliente
// (CreateClientRequestDTO / UpdateClientRequestDTO).
export interface ClientData {
  name: string;
  email: string;
  phone: string;
}
