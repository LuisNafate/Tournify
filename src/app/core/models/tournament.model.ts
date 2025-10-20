// Modelo de torneo
export interface Tournament {
  id: string;
  name: string;
  sportType: string;
  organizer: string;
  startDate: Date;
  endDate: Date;
  maxTeams: number;
  status: 'upcoming' | 'ongoing' | 'finished';
}
