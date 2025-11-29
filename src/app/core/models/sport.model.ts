/**
 * Modelo de Deporte
 */

export interface Sport {
  id: string; // UUID
  name: string;
  category: SportCategory;
  defaultPlayersPerTeam: number;
  iconUrl?: string | null;
  description?: string | null;
  createdAt: string; // ISO 8601
}

export type SportCategory = 'sport' | 'esport';

export interface CreateSportRequest {
  name: string;
  category: SportCategory;
  defaultPlayersPerTeam: number;
  iconUrl?: string;
  description?: string;
}

export interface UpdateSportRequest {
  name?: string;
  category?: SportCategory;
  defaultPlayersPerTeam?: number;
  iconUrl?: string;
  description?: string;
}
