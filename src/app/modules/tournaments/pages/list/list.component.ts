import { Component } from '@angular/core';
import { TournamentLegacy } from '../../../../core/models/legacy.types'; // Importamos el tipo legacy

// Componente para listar torneos
@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent {

  // Aquí creamos la lista de torneos
  tournaments: TournamentLegacy[] = [
    {
      id: '1',
      name: 'Copa Primavera 2024',
      sportId: 'sport-1',
      sportType: 'Fútbol',
      organizerId: 'user-123',
      tournamentType: 'elimination',
      startDate: '15 Mar 2024',
      maxTeams: 16,
      currentTeams: 12,
      participants: 12,
      prize: '$5,000',
      imageUrl: 'assets/images/Background-card-play.avif',
      bannerUrl: 'assets/images/Background-card-play.avif',
      status: 'ongoing',
      sportSettings: {
        matchDuration: 90,
        playersPerTeam: 11,
        halves: 2
      },
      createdAt: new Date().toISOString()
    },
    {
      id: '2',
      name: 'Apex Legends: Champions Quest',
      sportId: 'sport-2',
      sportType: 'eSports (Apex)',
      organizerId: 'user-123',
      tournamentType: 'elimination',
      startDate: '14 Dic 2023',
      maxTeams: 64,
      currentTeams: 0,
      participants: 0,
      prize: '$20,000',
      imageUrl: 'assets/images/Card-valorant.png',
      bannerUrl: 'assets/images/Card-valorant.png',
      status: 'upcoming',
      sportSettings: {
        matchDuration: 30,
        playersPerTeam: 3
      },
      createdAt: new Date().toISOString()
    },
    {
      id: '3',
      name: 'Call of Duty: Combat Challenge',
      sportId: 'sport-3',
      sportType: 'eSports (CoD)',
      organizerId: 'user-123',
      tournamentType: 'elimination',
      startDate: '10 Ene 2023',
      maxTeams: 32,
      currentTeams: 32,
      participants: 32,
      prize: '$10,000',
      imageUrl: 'assets/images/Card-cod.png',
      bannerUrl: 'assets/images/Card-cod.png',
      status: 'finished',
      sportSettings: {
        matchDuration: 20,
        playersPerTeam: 5
      },
      createdAt: new Date().toISOString()
    },
    {
      id: '4',
      name: 'Liga Anual de Volleyball',
      sportId: 'sport-4',
      sportType: 'Volleyball',
      organizerId: 'user-123',
      tournamentType: 'league',
      startDate: '01 Nov 2023',
      maxTeams: 8,
      currentTeams: 8,
      participants: 8,
      prize: '$2,500',
      imageUrl: 'assets/images/Background-volley-card.png',
      bannerUrl: 'assets/images/Background-volley-card.png',
      status: 'ongoing',
      sportSettings: {
        matchDuration: 60,
        playersPerTeam: 6
      },
      createdAt: new Date().toISOString()
    }
  ];

}