/**
 * Modelo de Usuario
 */

// Importar UserRole desde auth.models para evitar duplicación
import { UserRole } from './auth.models';

export interface User {
  id: string; // UUID
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role: UserRole;
  avatarUrl?: string | null;
}

export interface UserProfile extends User {
  phone?: string;
  tournamentsCreated?: number;
  tournamentsParticipated?: number;
  matchesPlayed?: number;
}

export interface UpdateUserRequest {
  firstName?: string;
  lastName?: string;
  phone?: string;
}
