import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListComponent } from './pages/list/list.component';
import { CreateComponent } from './pages/create/create.component';
import { DetailComponent } from './pages/detail/detail.component';
import { JoinComponent } from './pages/join/join.component';
import { CreateTeamComponent } from './pages/create-team/create-team.component';
import { EditComponent } from './pages/edit/edit.component';
import { MatchesListComponent } from './pages/matches/matches-list.component';
import { MatchDetailComponent } from './pages/matches/match-detail.component';
import { MatchUpdateResultComponent } from './pages/matches/match-update-result.component';
import { MatchCreateComponent } from './pages/matches/match-create.component';
import { BracketComponent } from './pages/bracket/bracket.component';
import { AuthGuard } from '../../core/guards/auth.guard';

// Rutas del módulo tournaments
const routes: Routes = [
  { path: 'list', component: ListComponent },
  {
    path: 'create',
    component: CreateComponent,
    canActivate: [AuthGuard],
    data: { hideSidebar: true }
  },
  {
    path: 'edit/:id',
    component: EditComponent,
    canActivate: [AuthGuard],
    data: { hideSidebar: true }
  },
  { path: 'detail/:id', component: DetailComponent },
  { path: 'join/:id', component: JoinComponent },
  // crear equipo asociado a un torneo (opcional tournamentId)
  { path: 'teams/create/:tournamentId', component: CreateTeamComponent, canActivate: [AuthGuard] },
  // Rutas de partidos
  { path: ':tournamentId/matches', component: MatchesListComponent },
  {
    path: ':tournamentId/matches/create',
    component: MatchCreateComponent,
    canActivate: [AuthGuard]
  },
  { path: ':tournamentId/bracket', component: BracketComponent },
  { path: 'matches/:id', component: MatchDetailComponent },
  {
    path: 'matches/:id/update',
    component: MatchUpdateResultComponent,
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TournamentsRoutingModule { }