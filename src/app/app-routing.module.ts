import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingComponent } from './modules/home/pages/landing/landing.component'; 
import { AppLayoutComponent } from './shared/components/app-layout/app-layout.component'; 
import { AuthGuard } from './core/guards/auth.guard'; // 1. Importar el Guard

// Rutas principales con lazy loading
const routes: Routes = [

  { 
    path: '', 
    component: LandingComponent 
  },
  { 
    path: 'auth', 
    loadChildren: () => import('./modules/auth/auth.module').then(m => m.AuthModule) 
  },

  {
    path: '',
    component: AppLayoutComponent, 
    
    canActivate: [AuthGuard], 
    
    children: [
      {
        path: 'dashboard',
        loadChildren: () => import('./modules/home/home.module').then(m => m.HomeModule)
      },
      { 
        path: 'tournaments', 
        loadChildren: () => import('./modules/tournaments/tournaments.module').then(m => m.TournamentsModule) 
      }
      // ... futuras rutas protegidas irían aquí
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