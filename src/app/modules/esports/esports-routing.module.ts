
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GameSelectionComponent } from './pages/game-selection/game-selection.component';

const routes: Routes = [
  {
    path: '',
    component: GameSelectionComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EsportsRoutingModule { }
