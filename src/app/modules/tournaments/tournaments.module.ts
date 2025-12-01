import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TournamentsRoutingModule } from './tournaments-routing.module';

import { ListComponent } from './pages/list/list.component';
import { CreateComponent } from './pages/create/create.component';
import { DetailComponent } from './pages/detail/detail.component';
import { TournamentViewComponent } from './pages/detail/tournament-view.component';
import { EditComponent } from './pages/edit/edit.component';
import { MatchesListComponent } from './pages/matches/matches-list.component';
import { MatchDetailComponent } from './pages/matches/match-detail.component';
import { MatchUpdateResultComponent } from './pages/matches/match-update-result.component';

// Módulo de torneos
@NgModule({
  declarations: [
    ListComponent,
    CreateComponent,
    DetailComponent,
    TournamentViewComponent,
    EditComponent,
    MatchesListComponent,
    MatchDetailComponent,
    MatchUpdateResultComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TournamentsRoutingModule
  ]
})
export class TournamentsModule { }
