import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListComponent } from './pages/list/list.component';
import { CreateComponent } from './pages/create/create.component';
import { DetailComponent } from './pages/detail/detail.component';

// Rutas del módulo tournaments
const routes: Routes = [
  { path: 'list', component: ListComponent },
  { 
    path: 'create', 
    component: CreateComponent,
    data: { hideSidebar: true } 
  },
  { path: 'detail/:id', component: DetailComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TournamentsRoutingModule { }