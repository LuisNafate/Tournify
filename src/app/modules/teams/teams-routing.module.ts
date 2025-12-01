import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MyTeamsComponent } from './pages/my-teams/my-teams.component';
import { CreateTeamComponent } from '../tournaments/pages/create-team/create-team.component';
import { TeamDetailComponent } from './pages/team-detail/team-detail.component';
import { AuthGuard } from '../../core/guards/auth.guard';

const routes: Routes = [
  {
    path: 'my-teams',
    component: MyTeamsComponent,
    canActivate: [AuthGuard],
    data: { hideSidebar: true }
  },
  {
    path: 'create',
    component: CreateTeamComponent,
    canActivate: [AuthGuard],
    data: { hideSidebar: true }
  },
  {
    path: ':id',
    component: TeamDetailComponent,
    canActivate: [AuthGuard],
    data: { hideSidebar: true }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TeamsRoutingModule { }
