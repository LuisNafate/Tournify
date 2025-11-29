/**
 * Modelo de Usuario
 */

// Importar UserRole desde auth.models para evitar duplicación
import { UserRole } from './auth.models';

export interface User {
  id: string; // UUID
  username: string;
  email: string;
  role: UserRole;
  avatarUrl?: string | null;
  createdAt: string; // ISO 8601
  updatedAt?: string | null;
}

export interface UserProfile extends User {
  tournamentsCreated?: number;
  tournamentsParticipated?: number;
  matchesPlayed?: number;
}

export interface UpdateUserRequest {
  username?: string;
  avatarUrl?: string;
}
