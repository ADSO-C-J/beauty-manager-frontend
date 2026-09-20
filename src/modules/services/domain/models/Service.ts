export type ServiceCategory =
  | "Cabello"
  | "Manos"
  | "Pies"
  | "Caballeros"
  | "Facial"
  | "Otro";

export interface Service {
  id: string;
  name: string;
  description: string;
  category: ServiceCategory;
  durationMin: number; // minutos
  price: number; // valor numérico
  popular: boolean;
}
