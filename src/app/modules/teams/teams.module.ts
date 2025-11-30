import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TeamsRoutingModule } from './teams-routing.module';
import { MyTeamsComponent } from './pages/my-teams/my-teams.component';
import { CreateTeamComponent } from '../tournaments/pages/create-team/create-team.component';
import { TeamDetailComponent } from './pages/team-detail/team-detail.component';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    TeamsRoutingModule,
    MyTeamsComponent, // Standalone component
    CreateTeamComponent, // Standalone component
    TeamDetailComponent // Standalone component
  ]
})
export class TeamsModule { }
