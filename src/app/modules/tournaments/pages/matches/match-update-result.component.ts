import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatchService } from '../../../../core/services/match.service';
import { MatchWithDetails, MatchStatus } from '../../../../core/models/match.model';

@Component({
  selector: 'app-match-update-result',
  templateUrl: './match-update-result.component.html',
  styleUrls: ['./match-update-result.component.css']
})
export class MatchUpdateResultComponent implements OnInit {
  match: MatchWithDetails | null = null;
  updateForm!: FormGroup;
  loading = false;
  saving = false;
  error: string | null = null;
  matchId!: string;

  statusOptions = [
    { value: 'scheduled', label: 'Programado' },
    { value: 'ongoing', label: 'En Vivo' },
    { value: 'finished', label: 'Finalizado' },
    { value: 'postponed', label: 'Pospuesto' },
    { value: 'cancelled', label: 'Cancelado' }
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private matchService: MatchService
  ) {
    this.initForm();
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.matchId = id;
      this.loadMatch();
    }
  }

  initForm(): void {
    this.updateForm = this.formBuilder.group({
      scoreHome: [0, [Validators.required, Validators.min(0)]],
      scoreAway: [0, [Validators.required, Validators.min(0)]],
      status: ['scheduled', Validators.required],
      notes: ['']
    });
  }

  loadMatch(): void {
    this.loading = true;
    this.error = null;

    this.matchService.getById(this.matchId).subscribe({
      next: (match) => {
        this.match = match;
        this.updateForm.patchValue({
          scoreHome: match.scoreHome ?? 0,
          scoreAway: match.scoreAway ?? 0,
          status: match.status,
          notes: ''
        });
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading match:', err);
        this.error = 'Error al cargar el partido';
        this.loading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.updateForm.invalid || !this.match) {
      return;
    }

    this.saving = true;
    this.error = null;

    const formValue = this.updateForm.value;
    const scoreHome = parseInt(formValue.scoreHome, 10);
    const scoreAway = parseInt(formValue.scoreAway, 10);

    // Determinar ganador
    let winnerId: string | undefined = undefined;
    if (formValue.status === 'finished' && scoreHome !== scoreAway) {
      winnerId = scoreHome > scoreAway ? (this.match.homeTeamId ?? undefined) : (this.match.awayTeamId ?? undefined);
    }

    this.matchService.updateScore(
      this.matchId,
      scoreHome,
      scoreAway,
      winnerId,
      formValue.status,
      formValue.notes
    ).subscribe({
      next: () => {
        this.saving = false;
        this.router.navigate(['/tournaments/matches', this.matchId]);
      },
      error: (err) => {
        console.error('Error updating match:', err);
        this.error = 'Error al actualizar el partido';
        this.saving = false;
      }
    });
  }

  startMatch(): void {
    if (!this.match) return;

    this.matchService.start(this.matchId).subscribe({
      next: () => {
        this.updateForm.patchValue({ status: 'ongoing' as MatchStatus });
        if (this.match) {
          this.match.status = 'ongoing';
        }
      },
      error: (err) => {
        console.error('Error starting match:', err);
        this.error = 'Error al iniciar el partido';
      }
    });
  }

  finishMatch(): void {
    if (!this.match) return;

    this.matchService.finish(this.matchId).subscribe({
      next: () => {
        this.updateForm.patchValue({ status: 'finished' as MatchStatus });
        if (this.match) {
          this.match.status = 'finished';
        }
      },
      error: (err) => {
        console.error('Error finishing match:', err);
        this.error = 'Error al finalizar el partido';
      }
    });
  }

  cancel(): void {
    if (this.match) {
      this.router.navigate(['/tournaments/matches', this.matchId]);
    }
  }

  getStatusLabel(status: string): string {
    const option = this.statusOptions.find(opt => opt.value === status);
    return option ? option.label : status;
  }

  getTeamInitials(name: string): string {
    if (!name) return '??';
    const words = name.trim().split(' ');
    if (words.length === 1) {
      return name.substring(0, 2).toUpperCase();
    }
    return words.map(w => w[0]).join('').substring(0, 2).toUpperCase();
  }
}
