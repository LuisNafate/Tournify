/**
 * Modelos de Equipo
 */

export interface Team {
  id: string; // UUID
  name: string;
  shortName?: string | null;
  description?: string | null;
  logoUrl?: string | null;
  captainId: string; // UUID
  contactEmail?: string | null;
  contactPhone?: string | null;
  createdAt: string; // ISO 8601
  updatedAt?: string | null;
}

export interface TeamWithMembers extends Team {
  members?: TeamMember[];
  captain?: {
    id: string;
    username: string;
    email: string;
  };
}

export interface TeamMember {
  id: string; // UUID
  teamId: string;
  userId: string;
  name?: string | null;
  email: string;
  role: MemberRole;
  jerseyNumber?: number | null;
  position?: string | null;
  joinedAt: string; // ISO 8601
  user?: {
    id: string;
    username: string;
    email: string;
    avatarUrl?: string;
  };
}

export type MemberRole = 'captain' | 'player' | 'substitute' | 'coach';

export interface CreateTeamRequest {
  name: string;
  shortName?: string;
  description?: string;
  contactEmail?: string;
  contactPhone?: string;
}

export interface UpdateTeamRequest {
  name?: string;
  shortName?: string;
  description?: string;
  logoUrl?: string;
  contactEmail?: string;
  contactPhone?: string;
}

export interface AddMemberRequest {
  email: string;
  name?: string;
  role?: MemberRole;
  jerseyNumber?: number;
  position?: string;
}
