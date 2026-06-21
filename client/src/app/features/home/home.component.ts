import { Component } from '@angular/core';
import { HeroCarouselComponent } from './components/hero-carousel/hero-carousel.component';
import { StatsCounterComponent } from './components/stats-counter/stats-counter.component';
import { ServicesPillarsComponent } from './components/services-pillars/services-pillars.component';
import { WhyCloudVantageComponent } from './components/why-cloud-vantage/why-cloud-vantage.component';
import { InsightsGridComponent } from './components/insights-grid/insights-grid.component';
import { ClientsLogosComponent } from './components/clients-logos/clients-logos.component';
import { TeamGridComponent } from './components/team-grid/team-grid.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    HeroCarouselComponent, 
    StatsCounterComponent, 
    ServicesPillarsComponent, 
    WhyCloudVantageComponent,
    InsightsGridComponent,
    ClientsLogosComponent,
    TeamGridComponent
  ],
  template: `
    <main class="home-page-wrapper">
      <app-hero-carousel></app-hero-carousel>
      <app-stats-counter></app-stats-counter>
      <app-services-pillars></app-services-pillars>
      <app-why-cloud-vantage></app-why-cloud-vantage>
      <app-insights-grid></app-insights-grid>
      <app-clients-logos></app-clients-logos>
      <app-team-grid></app-team-grid>
    </main>
  `
})
export class HomeComponent {}