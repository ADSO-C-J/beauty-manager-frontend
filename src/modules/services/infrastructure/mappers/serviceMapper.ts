import type { Service, ServiceCategory } from '../../domain/models/Service';

// Estructura que devuelve el backend (ServiceResponseDTO).
// Nota: el backend no expone category ni is_popular en la respuesta,
// por lo que se manejan como opcionales y se aplican valores por defecto.
export interface ApiService {
  id: string;
  name: string;
  duration_min: number;
  price: number;
  description?: string;
  category?: string;
  is_popular?: boolean;
}

// Categorías que usa el backend (enum TypeServices, en minúsculas)
const API_CATEGORY_BY_UI: Record<ServiceCategory, string> = {
  Cabello: 'cabello',
  Manos: 'manos',
  Pies: 'pies',
  Caballeros: 'caballeros',
  Facial: 'facial',
  Otro: 'otro',
};

// Categorías de la UI a partir del valor del backend
const UI_CATEGORY_BY_API: Record<string, ServiceCategory> = {
  cabello: 'Cabello',
  manos: 'Manos',
  pies: 'Pies',
  caballeros: 'Caballeros',
  facial: 'Facial',
  otro: 'Otro',
};

export function categoryToApi(category: ServiceCategory): string {
  return API_CATEGORY_BY_UI[category] ?? 'otro';
}

export function categoryFromApi(category?: string): ServiceCategory {
  if (!category) return 'Otro';
  return UI_CATEGORY_BY_API[category.toLowerCase()] ?? 'Otro';
}

export function toService(api: ApiService): Service {
  return {
    id: api.id,
    name: api.name,
    description: api.description ?? '',
    category: categoryFromApi(api.category),
    durationMin: api.duration_min,
    price: typeof api.price === 'number' ? api.price : Number(api.price),
    popular: api.is_popular ?? false,
  };
}
