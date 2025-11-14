import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MyTeamsComponent } from './pages/my-teams/my-teams.component';
import { CreateTeamComponent } from '../tournaments/pages/create-team/create-team.component';
import { AuthGuard } from '../../core/guards/auth.guard';

const routes: Routes = [
  {
    path: 'my-teams',
    component: MyTeamsComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'create',
    component: CreateTeamComponent,
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TeamsRoutingModule { }
