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
      
      <section class="trust-section">
        <div class="container text-center">
          <h2 class="section-title">Trusted by Global Leaders</h2>
          <div class="title-underline"></div>
          <p class="section-subtitle">We collaborate with top enterprises and strategic partners to deliver unparalleled Oracle Cloud solutions.</p>
          
          <div class="trust-grid">
            <div class="trust-image-wrapper">
              <h3 class="trust-heading">Our Valued Clients</h3>
              <div class="image-box">
                <img src="/assets/clients.png" alt="Cloud Vantage Clients" loading="lazy">
              </div>
            </div>

            <div class="trust-image-wrapper">
              <h3 class="trust-heading">Our Strategic Partners</h3>
              <div class="image-box">
                <img src="/assets/partners.png" alt="Cloud Vantage Partners" loading="lazy">
              </div>
            </div>
          </div>
        </div>
      </section>

      <app-insights-grid></app-insights-grid>
      
      <app-clients-logos></app-clients-logos>
      
      <app-team-grid></app-team-grid>
    </main>
  `,
  styles: [`
    /* --- Trust Section (Clients & Partners) --- */
    .trust-section {
      background-color: #f8fafc; /* Soft light background to blend with the images */
      padding: 80px 24px;
      font-family: 'Inter', sans-serif;
    }

    .container {
      max-width: 1200px;
      margin: 0 auto;
    }

    .text-center {
      text-align: center;
    }

    .section-title {
      font-size: 2.5rem;
      color: #0f172a; /* Dark text for contrast */
      margin-bottom: 10px;
      font-weight: 700;
      letter-spacing: -0.02em;
    }

    .title-underline {
      width: 60px;
      height: 4px;
      background-color: var(--color-accent, #00a8cc);
      margin: 0 auto 20px;
      border-radius: 2px;
    }

    .section-subtitle {
      font-size: 1.15rem;
      color: #475569;
      max-width: 700px;
      margin: 0 auto 50px;
      line-height: 1.6;
    }

    /* Grid Layout */
    .trust-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 40px;
      max-width: 1200px;
      margin: 0 auto;
    }

    @media (min-width: 992px) {
      .trust-grid {
        grid-template-columns: 1fr 1fr; /* Side-by-side on large screens */
        gap: 60px;
      }
    }

    /* Image Wrappers & Headings */
    .trust-image-wrapper {
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .trust-heading {
      font-size: 1.5rem;
      color: #1e293b;
      margin-bottom: 24px;
      font-weight: 600;
    }

    .image-box {
      width: 100%;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05); /* Soft shadow to make images pop */
      background: #ffffff;
      transition: transform 0.3s ease, box-shadow 0.3s ease;
    }

    .image-box:hover {
      transform: translateY(-5px);
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
    }

    .image-box img {
      width: 100%;
      height: auto;
      display: block;
      object-fit: contain;
    }
  `]
})
export class HomeComponent {}