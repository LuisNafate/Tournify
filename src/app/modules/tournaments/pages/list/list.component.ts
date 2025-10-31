import { Component } from '@angular/core';
import { Tournament } from '../../../../core/models/tournament.model'; // Importamos nuestro modelo

// Componente para listar torneos
@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent {

  // Aquí creamos la lista de torneos
  tournaments: Tournament[] = [
    {
      id: '1',
      name: 'Copa Primavera 2024',
      sportType: 'Fútbol',
      startDate: '15 Mar 2024',
      maxTeams: 16,
      participants: 12,
      prize: '$5,000',
      imageUrl: 'assets/images/Background-card-play.avif',
      status: 'ongoing'
    },
    {
      id: '2',
      name: 'Apex Legends: Champions Quest',
      sportType: 'eSports (Apex)',
      startDate: '14 Dic 2023',
      maxTeams: 64,
      participants: 0,
      prize: '$20,000',
      imageUrl: 'assets/images/Card-valorant.png',
      status: 'upcoming'
    },
    {
      id: '3',
      name: 'Call of Duty: Combat Challenge',
      sportType: 'eSports (CoD)',
      startDate: '10 Ene 2023',
      maxTeams: 32,
      participants: 32,
      prize: '$10,000',
      imageUrl: 'assets/images/Card-cod.png',
      status: 'finished'
    },
    {
      id: '4',
      name: 'Liga Anual de Volleyball',
      sportType: 'Volleyball',
      startDate: '01 Nov 2023',
      maxTeams: 8,
      participants: 8,
      prize: '$2,500',
      imageUrl: 'assets/images/Background-volley-card.png',
      status: 'ongoing'
    }
  ];

}