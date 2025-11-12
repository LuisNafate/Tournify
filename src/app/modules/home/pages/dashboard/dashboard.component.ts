import { Component, OnInit } from '@angular/core';
import { TournamentService } from '../../../tournaments/services/tournament.service';
import { Tournament } from '../../../../core/models/tournament.model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  tournaments: Tournament[] = [];
  loading = false;
  error: string | null = null;

  // Datos de ejemplo para las noticias, basados en tu imagen
  newsItems = [
    {
      id: 1,
      title: 'Gran Final del Torneo de Fútbol Este Domingo',
      description: 'Los equipos finalistas se preparan para el encuentro decisivo que definirá al campeón de la temporada.',
      time: 'Hace 2 horas',
      category: 'Fútbol',
      featured: true,
      imageUrl: 'assets/images/Background-card-sports.png'
    },
    {
      id: 2,
      title: 'Nuevas Inscripciones Abiertas para Liga de Basketball',
      description: 'Ya están disponibles las inscripciones para la nueva temporada de basketball amateur.',
      time: 'Hace 4 horas',
      category: 'Basketball',
      featured: false
    }
  ];

  constructor(private tournamentService: TournamentService) {}

  ngOnInit(): void {
    this.loadTournaments();
  }

  loadTournaments(): void {
    this.loading = true;
    this.error = null;

    this.tournamentService.getTournaments({ page: 0, limit: 6 }).subscribe({
      next: (response) => {
        this.tournaments = response.content;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading tournaments:', err);
        this.error = 'Error al cargar los torneos.';
        this.loading = false;
      }
    });
  }
}