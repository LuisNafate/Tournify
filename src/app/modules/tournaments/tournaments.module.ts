import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TournamentsRoutingModule } from './tournaments-routing.module';

import { ListComponent } from './pages/list/list.component';
import { CreateComponent } from './pages/create/create.component';
import { DetailComponent } from './pages/detail/detail.component';

// Módulo de torneos
@NgModule({
  declarations: [
    ListComponent,
    CreateComponent,
    DetailComponent
  ],
  imports: [
    CommonModule,
    TournamentsRoutingModule
  ]
})
export class TournamentsModule { }
