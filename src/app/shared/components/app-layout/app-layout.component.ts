import { Component, OnInit } from '@angular/core';
import { RouterModule, Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { CommonModule } from '@angular/common';
import { Observable, filter, map, mergeMap, combineLatest, startWith } from 'rxjs';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-app-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    SidebarComponent
  ],
  templateUrl: './app-layout.component.html',
  styleUrls: ['./app-layout.component.css']
})
export class AppLayoutComponent implements OnInit {
  
  // 3. AÑADE el '!' aquí
  public showSidebar$!: Observable<boolean>;

  constructor(
    private router: Router, 
    private activatedRoute: ActivatedRoute,
    private authService: AuthService
  ) {} // El constructor se queda vacío

  ngOnInit(): void {
    // Observable que detecta cambios de ruta
    const routeData$ = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      startWith(new NavigationEnd(0, this.router.url, this.router.url)),
      map(() => {
        let route = this.activatedRoute;
        while (route.firstChild) {
          route = route.firstChild;
        }
        return route;
      }),
      mergeMap(route => route.data),
      map(data => !data['hideSidebar']),
      startWith(true) // Por defecto mostrar sidebar
    );

    // Observable que detecta si hay usuario logueado
    const isLoggedIn$ = this.authService.usuarioActual$.pipe(
      map(user => {
        const isLogged = !!user;
        console.log('AppLayout - Usuario logueado:', isLogged, user?.role);
        return isLogged;
      }),
      startWith(!!this.authService.usuarioActualValue) // Inicializar con valor actual
    );

    // Combinar ambas lógicas
    this.showSidebar$ = combineLatest([isLoggedIn$, routeData$]).pipe(
      map(([isLoggedIn, routeAllows]) => {
        const shouldShow = isLoggedIn && routeAllows && !this.isPublicRoute(this.router.url);
        console.log('AppLayout - Mostrar sidebar:', shouldShow, { isLoggedIn, routeAllows, url: this.router.url });
        return shouldShow;
      })
    );
  }

  private isPublicRoute(url: string): boolean {
    const publicRoutes = ['/login', '/register', '/landing', '/auth/login', '/auth/register', '/'];
    return publicRoutes.some(route => url === route || url.startsWith(route + '?'));
  }
}