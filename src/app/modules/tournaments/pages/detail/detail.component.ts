import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TournamentService } from '../../services/tournament.service';
import { TournamentWithDetails } from '../../../../core/models/tournament.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css']
})
export class DetailComponent implements OnInit, OnDestroy {
  tournament: TournamentWithDetails | null = null;
  loading = false;
  error: string | null = null;
  followLoading = false;
  private routeSubscription?: Subscription;

  constructor(
    private route: ActivatedRoute,
    private tournamentService: TournamentService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.routeSubscription = this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        console.log('Cargando torneo con ID:', id);
        this.loadTournament(id);
      }
    });
  }

  ngOnDestroy(): void {
    // Cancelar suscripción al destruir el componente
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
  }

  loadTournament(id: string): void {
    this.loading = true;
    this.error = null;
    console.log('Iniciando carga del torneo...');

    this.tournamentService.getTournamentById(id).subscribe({
      next: (tournament: TournamentWithDetails) => {
        console.log('Torneo cargado desde el servidor:', tournament);
        this.tournament = tournament;
        // Actualizar el título de la página
        document.title = `${tournament.name} - Tournify`;
        
        // Cargar registraciones aprobadas (equipos inscritos)
        this.tournamentService.getRegistrations(id, 'approved').subscribe({
          next: (registrations) => {
            console.log('Registraciones cargadas:', registrations);
            // Mapear registraciones a formato TournamentTeam
            if (this.tournament) {
              this.tournament.teams = registrations.map(reg => ({
                id: reg.teamId,
                tournamentId: reg.tournamentId,
                name: reg.teamName,
                captainId: '', // No tenemos esta info en la registración
                logoUrl: reg.teamLogoUrl,
                players: new Array(reg.memberCount || 0), // Simular array con length = memberCount
                createdAt: reg.registrationDate
              }));
            }
            this.loading = false;
            console.log('Torneo completamente cargado:', this.tournament);
          },
          error: (err) => {
            console.error('Error loading registrations:', err);
            // No mostramos error, solo dejamos teams vacío
            this.loading = false;
          }
        });
      },
      error: (err) => {
        console.error('Error loading tournament:', err);
        this.error = 'Error al cargar el torneo. Por favor, intenta de nuevo.';
        this.loading = false;
      }
    });
  }

  toggleFollow(): void {
    if (!this.tournament) return;

    this.followLoading = true;
    const isFollowing = this.tournament.isFollowing;

    const action = isFollowing
      ? this.tournamentService.unfollowTournament(this.tournament.id)
      : this.tournamentService.followTournament(this.tournament.id);

    action.subscribe({
      next: () => {
        if (this.tournament) {
          this.tournament.isFollowing = !isFollowing;
          if (this.tournament.followersCount !== undefined) {
            this.tournament.followersCount += isFollowing ? -1 : 1;
          }
        }
        this.followLoading = false;
      },
      error: (err) => {
        console.error('Error toggling follow:', err);
        this.error = 'Error al actualizar el seguimiento. Intenta de nuevo.';
        this.followLoading = false;
      }
    });
  }

  onDeleteTournament(): void {
    if (!this.tournament) return;

    this.loading = true;
    this.tournamentService.deleteTournament(this.tournament.id).subscribe({
      next: () => {
        console.log('Torneo eliminado exitosamente');
        // Redirigir al dashboard después de eliminar
        this.router.navigate(['/home']);
      },
      error: (err: any) => {
        console.error('Error al eliminar torneo:', err);
        this.error = err.error?.message || 'Error al eliminar el torneo. Por favor, intenta de nuevo.';
        this.loading = false;
      }
    });
  }

  onStartTournament(): void {
    if (!this.tournament) return;

    this.loading = true;
    this.error = null;

    this.tournamentService.startTournament(this.tournament.id).subscribe({
      next: (updatedTournament) => {
        console.log('Torneo iniciado exitosamente');
        // Recargar el torneo para actualizar el estado
        this.loadTournament(this.tournament!.id);
      },
      error: (err: any) => {
        console.error('Error al iniciar torneo:', err);
        this.error = 'Error al iniciar el torneo. Por favor, intenta de nuevo.';
        this.loading = false;
      }
    });
  }

  onFinishTournament(): void {
    if (!this.tournament) return;

    this.loading = true;
    this.error = null;

    this.tournamentService.finishTournament(this.tournament.id).subscribe({
      next: (updatedTournament) => {
        console.log('Torneo finalizado exitosamente');
        // Recargar el torneo para actualizar el estado
        this.loadTournament(this.tournament!.id);
      },
      error: (err: any) => {
        console.error('Error al finalizar torneo:', err);
        this.error = 'Error al finalizar el torneo. Por favor, intenta de nuevo.';
        this.loading = false;
      }
    });
  }
}
