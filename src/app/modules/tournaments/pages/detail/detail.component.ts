import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TournamentService } from '../../services/tournament.service';

// Componente para detalle de torneo
@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css']
})
export class DetailComponent implements OnInit {
  tournament: any;

  constructor(
    private route: ActivatedRoute,
    private tournamentService: TournamentService
  ) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.tournament = this.tournamentService.getTournamentById(id);
  }
}
