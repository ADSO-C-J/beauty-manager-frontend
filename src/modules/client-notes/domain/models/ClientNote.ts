export interface ClientNote {
  id: string;
  clientId: string;
  clientName?: string;
  staffId?: string;
  staffName?: string;
  content: string;
  createdAt?: string;
  updatedAt?: string;
}