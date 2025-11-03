import { Component, OnInit } from '@angular/core';
import { RouterModule, Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { CommonModule } from '@angular/common';
import { Observable, filter, map, mergeMap, combineLatest } from 'rxjs';
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
    // 5. Observable que nos dice si la RUTA actual quiere ocultar el sidebar
    const routeData$ = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      map(() => {
        let route = this.activatedRoute;
        while (route.firstChild) {
          route = route.firstChild;
        }
        return route;
      }),
      mergeMap(route => route.data),
      map(data => !data['hideSidebar']) // Emite 'true' si el sidebar debe mostrarse
    );

    // 6. Observable que nos dice si el USUARIO está logueado
    const isLoggedIn$ = this.authService.usuarioActual$.pipe(
      map(user => !!user) // Emite 'true' si hay un usuario
    );

    // 7. Combinamos ambas lógicas
    this.showSidebar$ = combineLatest([isLoggedIn$, routeData$]).pipe(
      map(([isLoggedIn, routeAllows]) => isLoggedIn && routeAllows)
    );
  }
}