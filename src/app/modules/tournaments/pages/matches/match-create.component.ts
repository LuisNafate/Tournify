import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatchService } from '../../../../core/services/match.service';
import { TournamentService } from '../../services/tournament.service';
import { AuthService } from '../../../../core/services/auth.service';
import { UserService } from '../../../../core/services/user.service';
import { User } from '../../../../core/models/user.model';

@Component({
  selector: 'app-match-create',
  templateUrl: './match-create.component.html',
  styleUrls: ['./match-create.component.css']
})
export class MatchCreateComponent implements OnInit {
  matchForm: FormGroup;
  tournamentId!: string;
  loading = false;
  error: string | null = null;
  teams: any[] = [];
  referees: User[] = [];
  tournament: any = null;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private matchService: MatchService,
    private tournamentService: TournamentService,
    private authService: AuthService,
    private userService: UserService
  ) {
    this.matchForm = this.fb.group({
      homeTeamId: ['', Validators.required],
      awayTeamId: ['', Validators.required],
      roundName: [''],
      matchNumber: [1, [Validators.required, Validators.min(1)]],
      scheduledAt: [''],
      location: [''],
      refereeId: ['']
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('tournamentId');
    if (id) {
      this.tournamentId = id;
      this.loadTournament();
      this.loadTeams();
      this.loadReferees();
    }
  }

  loadReferees(): void {
    this.userService.getUsersByRole('referee').subscribe({
      next: (referees) => {
        this.referees = referees;
      },
      error: (err) => {
        console.error('Error loading referees:', err);
      }
    });
  }

  loadTournament(): void {
    this.tournamentService.getTournamentById(this.tournamentId).subscribe({
      next: (tournament) => {
        this.tournament = tournament;
        
        // Verificar permisos
        const currentUser = this.authService.usuarioActualValue;
        if (!currentUser || 
            (String(currentUser.id) !== String(tournament.organizerId) && 
             currentUser.role !== 'admin')) {
          this.error = 'No tienes permisos para crear partidos en este torneo';
          setTimeout(() => this.goBack(), 2000);
        }
      },
      error: (err) => {
        console.error('Error loading tournament:', err);
        this.error = 'Error al cargar el torneo';
      }
    });
  }

  loadTeams(): void {
    // Cargar equipos inscritos (registraciones aprobadas)
    this.tournamentService.getRegistrations(this.tournamentId, 'approved').subscribe({
      next: (registrations: any[]) => {
        // Mapear registraciones a formato de equipo (solo ID y nombre, sin logoUrl)
        this.teams = registrations.map(reg => ({
          id: reg.teamId,
          name: reg.teamName
        }));
        
        console.log('Equipos cargados:', this.teams);
        
        if (this.teams.length === 0) {
          this.error = 'No hay equipos inscritos en este torneo. Por favor, inscribe equipos primero.';
        }
      },
      error: (err: any) => {
        console.error('Error loading teams:', err);
        this.error = 'Error al cargar los equipos';
      }
    });
  }

  onSubmit(): void {
    if (this.matchForm.invalid) {
      Object.keys(this.matchForm.controls).forEach(key => {
        this.matchForm.get(key)?.markAsTouched();
      });
      return;
    }

    const formValue = this.matchForm.value;
    
    // Validar que no sean el mismo equipo
    if (formValue.homeTeamId === formValue.awayTeamId) {
      this.error = 'Un equipo no puede jugar contra sí mismo';
      return;
    }

    this.loading = true;
    this.error = null;

    const matchData = {
      tournamentId: this.tournamentId,
      homeTeamId: formValue.homeTeamId,
      awayTeamId: formValue.awayTeamId,
      roundName: formValue.roundName || null,
      matchNumber: formValue.matchNumber,
      scheduledAt: formValue.scheduledAt || null,
      location: formValue.location || null,
      refereeId: formValue.refereeId || null
    };

    console.log('Sending match data:', matchData);

    this.matchService.create(matchData).subscribe({
      next: (match) => {
        console.log('Match created:', match);
        // Navegar a la lista de partidos
        this.router.navigate(['/tournaments', this.tournamentId, 'matches']);
      },
      error: (err) => {
        console.error('Error creating match:', err);
        this.error = err.error?.message || 'Error al crear el partido';
        this.loading = false;
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/tournaments', this.tournamentId, 'matches']);
  }

  get f() {
    return this.matchForm.controls;
  }
}
