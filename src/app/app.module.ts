import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common'; 
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './shared/components/navbar/navbar.component';
import { FooterComponent } from './shared/components/footer/footer.component';
import { SidebarComponent } from './shared/components/sidebar/sidebar.component';
import { AppLayoutComponent } from './shared/components/app-layout/app-layout.component';
import { LandingComponent } from './modules/home/pages/landing/landing.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    FooterComponent,
    LandingComponent
 
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CommonModule, 
    SidebarComponent,
    AppLayoutComponent
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }