import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListComponent } from './pages/list/list.component';
import { CreateComponent } from './pages/create/create.component';
import { DetailComponent } from './pages/detail/detail.component';
import { JoinComponent } from './pages/join/join.component';
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
  { path: 'detail/:id', component: DetailComponent },
  { path: 'join/:id', component: JoinComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TournamentsRoutingModule { }