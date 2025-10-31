// Modelo de torneo
export interface Tournament {
  id: string;
  name: string;
  sportType: string;
  organizer?: string; // Hacemos opcional al organizador
  startDate: Date | string; // Permitimos string para facilidad en mock data
  endDate?: Date | string;
  maxTeams: number;
  participants: number; // Nuevo: para "12 / 16"
  prize: string; // Nuevo: para "$5,000"
  imageUrl: string; // Nuevo: para la imagen de la tarjeta
  status: 'upcoming' | 'ongoing' | 'finished';
}