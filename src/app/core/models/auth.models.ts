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
  role: UserRole;
}

export interface AuthResponse {
  token: string;
  user: AuthUser;
  expiresIn: number; // Tiempo en segundos
}

export interface AuthUser {
  id: string; // UUID
  username: string;
  email: string;
  role: UserRole;
  avatarUrl?: string | null;
  createdAt: string; // ISO 8601
  updatedAt?: string | null;
}

export type UserRole = 'player' | 'organizer' | 'referee' | 'admin';

export interface TokenPayload {
  userId: string;
  email: string;
  role: UserRole;
  exp: number;
  iat: number;
}
