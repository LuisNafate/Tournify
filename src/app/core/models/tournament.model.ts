/**
 * Modelos de Torneo
 */

export interface Tournament {
  id: string; // UUID
  name: string;
  description?: string | null;
  sportId: string; // UUID
  organizerId: string; // UUID
  tournamentType: TournamentType;
  eliminationMode?: EliminationMode | null;
  status: TournamentStatus;
  startDate?: string | null; // ISO 8601
  endDate?: string | null; // ISO 8601
  registrationDeadline?: string | null; // ISO 8601
  location?: string | null;
  prizePool?: string | null;
  rules?: string | null;
  bannerUrl?: string | null;
  sportSettings: SportSettings;
  groupConfig?: GroupConfig | null;
  currentTeams: number;
  maxTeams: number;
  createdAt: string; // ISO 8601
  updatedAt?: string | null;
}

export type TournamentType = 'league' | 'elimination' | 'hybrid';
export type EliminationMode = 'single' | 'double' | 'group_stage';
export type TournamentStatus = 'upcoming' | 'registration' | 'ongoing' | 'finished';

export interface SportSettings {
  matchDuration: number; // Minutos
  playersPerTeam: number;
  halves?: number;
  overtimeEnabled?: boolean;
  penaltiesEnabled?: boolean;
}

export interface GroupConfig {
  numGroups: number;
  teamsPerGroup: number;
  advancePerGroup?: number;
}