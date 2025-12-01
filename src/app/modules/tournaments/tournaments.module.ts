import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TournamentsRoutingModule } from './tournaments-routing.module';

import { ListComponent } from './pages/list/list.component';
import { CreateComponent } from './pages/create/create.component';
import { DetailComponent } from './pages/detail/detail.component';
import { TournamentViewComponent } from './pages/detail/tournament-view.component';
import { EditComponent } from './pages/edit/edit.component';

// Módulo de torneos
@NgModule({
  declarations: [
    ListComponent,
    CreateComponent,
    DetailComponent,
    TournamentViewComponent,
    EditComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    TournamentsRoutingModule
  ]
})
export class TournamentsModule { }
