import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingComponent } from './modules/home/pages/landing/landing.component'; // Importamos Landing
import { AppLayoutComponent } from './shared/components/app-layout/app-layout.component'; // Importamos el Layout


const routes: Routes = [
  //  RUTAS PÚBLICAS 
  { 
    path: '', 
    component: LandingComponent 
  },
  { 
    path: 'auth', 
    loadChildren: () => import('./modules/auth/auth.module').then(m => m.AuthModule) 
  },

  //  RUTAS "APP" 
  {
    path: '',
    component: AppLayoutComponent, 
  
    children: [
      {
        path: 'dashboard',
        loadChildren: () => import('./modules/home/home.module').then(m => m.HomeModule)
      },
      { 
        path: 'tournaments', 
        loadChildren: () => import('./modules/tournaments/tournaments.module').then(m => m.TournamentsModule) 
      }
      // ... aquí irían futuras rutas como 'profile', 'teams', etc.
    ]
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