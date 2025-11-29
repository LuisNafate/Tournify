/**
 * Tipos y utilidades de compatibilidad
 * Para facilitar la migración gradual del código existente
 */

import { Tournament } from './tournament.model';

/**
 * Interface extendida de Tournament con campos legacy
 * Usar solo para compatibilidad con código antiguo
 * @deprecated Migrar a Tournament estándar
 */
export interface TournamentLegacy extends Tournament {
  imageUrl?: string;        // Usar bannerUrl en su lugar
  sportType?: string;       // Usar sportId + lookup en Sport
  participants?: number;    // Usar currentTeams en su lugar
  prize?: string;           // Usar prizePool en su lugar
  organizer?: string;       // Usar organizerId + lookup en User
}

/**
 * Función helper para convertir Tournament a formato legacy
 * Útil para migrar componentes gradualmente
 */
export function mapToLegacy(tournament: Tournament): TournamentLegacy {
  return {
    ...tournament,
    imageUrl: tournament.bannerUrl || '',
    sportType: tournament.sportId, // Necesitarás hacer lookup del deporte
    participants: tournament.currentTeams,
    prize: tournament.prizePool || '',
    organizer: tournament.organizerId // Necesitarás hacer lookup del usuario
  };
}

/**
 * Función helper para obtener la imagen del torneo
 */
export function getTournamentImage(tournament: Tournament): string {
  return tournament.bannerUrl || 'assets/images/tournament-default.jpg';
}

/**
 * Función helper para formatear el string de deporte
 * Requiere que hayas cargado el catálogo de deportes
 */
export function formatSportType(sportId: string, sports: any[]): string {
  const sport = sports.find(s => s.id === sportId);
  return sport?.name || 'Desconocido';
}
