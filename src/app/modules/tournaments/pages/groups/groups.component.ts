import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GroupService } from '../../../../core/services/group.service';
import { TournamentGroupsData, GroupWithStandings } from '../../../../core/models/group.model';
import { TournamentService } from '../../../../core/services/tournament.service';

@Component({
  selector: 'app-groups',
  templateUrl: './groups.component.html',
  styleUrls: ['./groups.component.css']
})
export class GroupsComponent implements OnInit {
  tournamentId!: string;
  groupsData: TournamentGroupsData | null = null;
  loading = false;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private groupService: GroupService,
    private tournamentService: TournamentService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('tournamentId');
    if (id) {
      this.tournamentId = id;
      this.loadGroups();
    }
  }

  loadGroups(): void {
    this.loading = true;
    this.error = null;

    this.groupService.getGroupsByTournament(this.tournamentId).subscribe({
      next: (data) => {
        console.log('Datos de grupos cargados:', data);
        this.groupsData = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error cargando grupos:', err);
        this.error = 'Error al cargar los grupos. Por favor, intenta de nuevo.';
        this.loading = false;
      }
    });
  }

  getTeamName(standing: any): string {
    return standing.team?.name || 'Equipo desconocido';
  }

  getTeamLogo(standing: any): string | undefined {
    return standing.team?.logoUrl;
  }

  getTeamInitials(name: string): string {
    if (!name) return '?';
    const words = name.trim().split(' ');
    if (words.length === 1) {
      return name.substring(0, 2).toUpperCase();
    }
    return words.map(w => w[0]).join('').substring(0, 2).toUpperCase();
  }
}
