/**
 * Modelos de Grupos y Tablas de Posiciones
 */

export interface TournamentGroup {
  id: string; // UUID
  tournamentId: string;
  name: string; // Ej: "Grupo A", "Grupo B"
  groupNumber: number; // 1, 2, 3, etc.
  createdAt?: string;
  updatedAt?: string;
}

export interface GroupStanding {
  id: string; // UUID
  groupId: string;
  teamId: string;
  played: number; // Partidos jugados
  won: number; // Partidos ganados
  drawn: number; // Partidos empatados
  lost: number; // Partidos perdidos
  goalsFor: number; // Goles a favor
  goalsAgainst: number; // Goles en contra
  goalDifference: number; // Diferencia de goles
  points: number; // Puntos
  position: number; // Posición en el grupo
  updatedAt?: string;
}

export interface GroupStandingWithDetails extends GroupStanding {
  team?: {
    id: string;
    name: string;
    logoUrl?: string;
  };
  group?: {
    id: string;
    name: string;
    groupNumber: number;
  };
}

export interface GroupWithStandings {
  group: TournamentGroup;
  standings: GroupStandingWithDetails[];
}

export interface TournamentGroupsData {
  groups: GroupWithStandings[];
  totalGroups: number;
}

export interface GenerateGroupsRequest {
  tournamentId: string;
  numberOfGroups: number;
}

export interface AssignTeamsToGroupsRequest {
  tournamentId: string;
  randomize?: boolean; // Si true, asigna equipos aleatoriamente
}

export interface GenerateGroupMatchesRequest {
  tournamentId: string;
  startDate?: string; // Fecha de inicio de los partidos
}
