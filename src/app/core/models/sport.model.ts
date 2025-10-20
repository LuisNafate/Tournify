// Modelo de deporte
export interface Sport {
  id: string;
  name: string;
  category: 'sport' | 'esport';
  icon?: string;
}
