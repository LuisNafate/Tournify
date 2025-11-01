
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EsportsRoutingModule } from './esports-routing.module';
import { GameSelectionComponent } from './pages/game-selection/game-selection.component';


@NgModule({
  declarations: [
    GameSelectionComponent
  ],
  imports: [
    CommonModule,
    EsportsRoutingModule
  ]
})
export class EsportsModule { }
