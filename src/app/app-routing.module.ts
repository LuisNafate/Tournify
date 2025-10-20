import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Rutas principales con lazy loading
const routes: Routes = [
  { 
    path: '', 
    loadChildren: () => import('./modules/home/home.module').then(m => m.HomeModule) 
  },
  { 
    path: 'auth', 
    loadChildren: () => import('./modules/auth/auth.module').then(m => m.AuthModule) 
  },
  { 
    path: 'tournaments', 
    loadChildren: () => import('./modules/tournaments/tournaments.module').then(m => m.TournamentsModule) 
  },
  { 
    path: '**', 
    redirectTo: '' 
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
