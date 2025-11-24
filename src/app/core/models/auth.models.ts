/**
 * Modelos de Autenticación
 */

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  photoUrl?: string;
}

export interface AuthResponse {
  token: string;
  user: AuthUser;
}

export interface AuthUser {
  id: string; // UUID
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  avatarUrl?: string | null;
}

export type UserRole = 'player' | 'organizer' | 'referee' | 'admin';

export interface TokenPayload {
  userId: string;
  email: string;
  role: UserRole;
  exp: number;
  iat: number;
}
