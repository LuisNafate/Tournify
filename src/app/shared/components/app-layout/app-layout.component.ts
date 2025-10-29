import { Component, OnInit } from '@angular/core';
// 1. Importa todo lo necesario
import { RouterModule, Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { CommonModule } from '@angular/common'; 
import { filter, map, mergeMap } from 'rxjs/operators';

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
  
  public showSidebar: boolean = true;

  constructor(private router: Router, private activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      map(() => {
        let route = this.activatedRoute;
        while (route.firstChild) {
          route = route.firstChild;
        }
        return route;
      }),
      mergeMap(route => route.data)
    ).subscribe(data => {
      this.showSidebar = !data['hideSidebar'];
    });
  }
}