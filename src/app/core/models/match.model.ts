/**
 * Modelo de Partido
 */

export interface Match {
  id: string; // UUID
  tournamentId: string;
  roundName?: string | null;
  matchNumber: number;
  homeTeamId?: string | null;
  awayTeamId?: string | null;
  refereeId?: string | null;
  scheduledAt?: string | null; // ISO 8601
  playedAt?: string | null; // ISO 8601
  location?: string | null;
  scoreHome?: number | null;
  scoreAway?: number | null;
  status: MatchStatus;
  matchData?: MatchData | null; // JSONB
  createdAt: string;
  updatedAt?: string | null;
}

export type MatchStatus = 'scheduled' | 'ongoing' | 'finished' | 'postponed' | 'cancelled';

export interface MatchData {
  firstHalfScoreHome?: number;
  firstHalfScoreAway?: number;
  secondHalfScoreHome?: number;
  secondHalfScoreAway?: number;
  overtimeScoreHome?: number;
  overtimeScoreAway?: number;
  penaltiesScoreHome?: number;
  penaltiesScoreAway?: number;
  events?: MatchEvent[];
  statistics?: MatchStatistics;
}

export interface MatchEvent {
  id: string;
  type: MatchEventType;
  minute: number;
  teamId: string;
  playerId?: string;
  playerName?: string;
  description?: string;
  timestamp: string;
}

export type MatchEventType = 
  | 'goal' 
  | 'penalty' 
  | 'yellow_card' 
  | 'red_card' 
  | 'substitution' 
  | 'injury' 
  | 'var';

export interface MatchStatistics {
  possession?: {
    home: number;
    away: number;
  };
  shots?: {
    home: number;
    away: number;
  };
  shotsOnTarget?: {
    home: number;
    away: number;
  };
  corners?: {
    home: number;
    away: number;
  };
  fouls?: {
    home: number;
    away: number;
  };
}

export interface MatchWithDetails extends Match {
  roundNumber?: number;
  winnerId?: string | null;
  homeTeam?: {
    id: string;
    name: string;
    logoUrl?: string;
  };
  awayTeam?: {
    id: string;
    name: string;
    logoUrl?: string;
  };
  // Propiedades alternativas que viene del backend
  homeTeamName?: string;
  awayTeamName?: string;
  tournamentName?: string;
  referee?: {
    id: string;
    username: string;
  };
  tournament?: {
    id: string;
    name: string;
  };
}

export interface CreateMatchRequest {
  tournamentId: string;
  roundName?: string;
  roundNumber?: number;
  matchNumber?: number;
  homeTeamId?: string;
  awayTeamId?: string;
  refereeId?: string;
  scheduledAt?: string;
  location?: string;
  groupId?: string;
}

export interface UpdateMatchRequest {
  roundName?: string;
  homeTeamId?: string;
  awayTeamId?: string;
  refereeId?: string;
  scheduledAt?: string;
  playedAt?: string;
  location?: string;
  scoreHome?: number;
  scoreAway?: number;
  status?: MatchStatus;
  matchData?: MatchData;
}
