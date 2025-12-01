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
  category?: string | null;
  sportSubType?: string | null;
  status: TournamentStatus;
  startDate?: string | null; // ISO 8601
  endDate?: string | null; // ISO 8601
  registrationDeadline?: string | null; // ISO 8601
  location?: string | null;
  prizePool?: string | null;
  rules?: string | null;
  rulesText?: string | null;
  bannerUrl?: string | null;
  imageUrl?: string | null;
  sportSettings?: SportSettings;
  groupConfig?: GroupConfig | null;
  currentTeams: number;
  maxTeams: number;
  createdAt?: string; // ISO 8601
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

export interface TournamentWithDetails extends Tournament {
  sport?: string | {
    id: string;
    name: string;
    category: string;
  };
  organizer?: string | {
    id: string;
    username: string;
    avatarUrl?: string;
  };
  teams?: TournamentTeam[];
  followersCount?: number;
  isFollowing?: boolean;
}

export interface TournamentTeam {
  id: string; // UUID
  tournamentId: string;
  name: string;
  captainId: string; // UUID
  logoUrl?: string | null;
  players?: TeamPlayer[];
  stats?: TeamStats;
  createdAt: string;
}

export interface TeamPlayer {
  id: string;
  teamId: string;
  userId: string;
  position?: string;
  jerseyNumber?: number;
  user?: {
    id: string;
    username: string;
    avatarUrl?: string;
  };
}

export interface TeamStats {
  matchesPlayed: number;
  wins: number;
  draws: number;
  losses: number;
  goalsFor: number;
  goalsAgainst: number;
  points: number;
  goalDifference: number;
}

export interface CreateTournamentRequest {
  name: string;
  description?: string;
  sportId: string; // UUID del deporte
  sportSubType?: string;
  tournamentType: string;
  category?: string;
  eliminationMode?: string;
  location?: string;
  startDate: string; // ISO 8601
  endDate?: string;
  registrationDeadline?: string;
  maxTeams: number;
  registrationFee?: number;
  prizePool?: string;
  isPrivate: boolean;
  requiresApproval: boolean;
  accessCode?: string;
  hasGroupStage: boolean;
  numberOfGroups?: number;
  teamsPerGroup?: number;
  teamsAdvancePerGroup?: number;
  sportSettings?: string; // JSON stringificado
  allowTies: boolean;
  pointsForWin: number;
  pointsForDraw: number;
  pointsForLoss: number;
  rulesText?: string;
}

export interface UpdateTournamentRequest {
  name?: string;
  description?: string;
  status?: TournamentStatus;
  startDate?: string;
  endDate?: string;
  registrationDeadline?: string;
  location?: string;
  prizePool?: string;
  rules?: string;
  bannerUrl?: string;
  sportSettings?: SportSettings;
  groupConfig?: GroupConfig;
  maxTeams?: number;
}

export interface TournamentFilters {
  status?: TournamentStatus | TournamentStatus[];
  sportId?: string;
  tournamentType?: TournamentType;
  search?: string;
  organizerId?: string;
  page?: number;
  limit?: number;
}

export interface TournamentStanding {
  position: number;
  teamId: string;
  teamName: string;
  teamLogoUrl?: string;
  matchesPlayed: number;
  wins: number;
  draws: number;
  losses: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
}

export interface Follower {
  id: string; // UUID
  userId: string;
  tournamentId: string;
  createdAt: string;
}

export interface FollowerStats {
  tournamentId: string;
  followersCount: number;
  isFollowing: boolean;
}

export interface TeamRegistration {
  id: string; // UUID
  tournamentId: string;
  teamId: string;
  teamName: string;
  teamLogoUrl?: string | null;
  captainName: string;
  status: RegistrationStatus;
  requiresApproval: boolean;
  registeredAt: string; // ISO 8601
  approvedAt?: string | null;
  rejectedAt?: string | null;
  rejectionReason?: string | null;
}

export type RegistrationStatus = 'pending' | 'approved' | 'rejected';