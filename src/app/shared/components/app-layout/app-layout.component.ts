import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar.component'; 

@Component({
  selector: 'app-app-layout',
  standalone: true, 
  imports: [
    RouterModule,     
    SidebarComponent  
  ],
  templateUrl: './app-layout.component.html',
  styleUrls: ['./app-layout.component.css']
})
export class AppLayoutComponent {
  // ...
}