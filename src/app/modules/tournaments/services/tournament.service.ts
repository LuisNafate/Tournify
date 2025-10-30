import { Injectable } from '@angular/core';

// servicio para compartir datos de torneos
@Injectable({
  providedIn: 'root'
})
export class TournamentService {
  
  // datos de ejemplo de torneos
  tournaments = [
    {
      id: 1,
      name: 'Copa Primavera 2024',
      sport: 'Volleyball',
      maxTeams: 16,
      enrolled: 12,
      prize: '$5,000',
      startDate: '15 Mar 2024',
      status: 'Activo',
      image: 'assets/images/Background-card-play.avif',
      organizer: 'Club Deportivo Central'
    },
    {
      id: 2,
      name: 'Apex Legends: Champions Quest',
      sport: 'eSports',
      maxTeams: 64,
      enrolled: 0,
      prize: '$20,000',
      startDate: '14 Dic 2023',
      status: 'Próximo',
      image: 'assets/images/Card-valorant.png',
      organizer: 'ESports Pro League'
    },
    {
      id: 3,
      name: 'Call of Duty: Combat Challenge',
      sport: 'eSports (CoD)',
      maxTeams: 32,
      enrolled: 32,
      prize: '$10,000',
      winner: 'Team Queso',
      status: 'Finalizado',
      image: 'assets/images/Card-cod.png',
      organizer: 'Gaming Masters'
    },
    {
      id: 4,
      name: 'Liga Anual de Volleyball',
      sport: 'Volleyball',
      maxTeams: 8,
      enrolled: 8,
      prize: '$2,500',
      startDate: '01 Nov 2023',
      status: 'Activo',
      image: 'assets/images/Background-volley-card.png',
      organizer: 'Federación Nacional'
    }
  ];

  getTournamentById(id: number) {
    return this.tournaments.find(t => t.id === id);
  }
}
