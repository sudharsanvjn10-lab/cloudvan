import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FadeUpDirective } from '../../../../shared/directives/fade-up.directive';
import { SpotlightDirective } from '../../../../shared/directives/spotlight.directive';
import { ContentService } from '../../../../core/services/content.service';

interface ServicePillar {
  id: string;
  title: string;
  shortDesc: string;
  subLinks: string[];
  imageUrl: string;
}

@Component({
  selector: 'app-services-pillars',
  standalone: true,
  imports: [CommonModule, RouterModule, FadeUpDirective, SpotlightDirective],
  template: `
    <section class="services-mega-section">
      <div class="container section-header">
        <h2>Our Oracle Cloud Expertise</h2>
        <p>Comprehensive fusion solutions tailored to elevate your enterprise architecture.</p>
        <div class="underline"></div>
      </div>

      <div class="container">
        <div class="cards-grid">
          <div *ngFor="let pillar of pillars; let i = index" class="glass-card" appFadeUp appSpotlight [delay]="i * 120">
            
            <div class="card-bg" [style.backgroundImage]="'url(' + pillar.imageUrl + ')'"></div>
            
            <div class="glass-overlay"></div>

            <div class="card-content">
              <div class="icon-wrapper">
                <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                     stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"
                     aria-hidden="true" [ngSwitch]="pillar.id">
                  <g *ngSwitchCase="'core-hr'">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                    <circle cx="9" cy="7" r="4"></circle>
                    <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                  </g>
                  <g *ngSwitchCase="'payroll'">
                    <rect x="2" y="5" width="20" height="14" rx="2"></rect>
                    <path d="M2 10h20"></path>
                  </g>
                  <g *ngSwitchCase="'absence'">
                    <circle cx="12" cy="12" r="9"></circle>
                    <path d="M12 7v5l3 2"></path>
                  </g>
                  <g *ngSwitchCase="'talent'">
                    <circle cx="12" cy="12" r="9"></circle>
                    <circle cx="12" cy="12" r="5"></circle>
                    <circle cx="12" cy="12" r="1"></circle>
                  </g>
                  <g *ngSwitchCase="'redwood'">
                    <rect x="3" y="3" width="18" height="18" rx="2"></rect>
                    <path d="M3 9h18"></path>
                    <path d="M9 21V9"></path>
                  </g>
                  <g *ngSwitchCase="'integrations'">
                    <path d="M13 2 3 14h8l-1 8 10-12h-8l1-8Z"></path>
                  </g>
                </svg>
              </div>
              
              <h3>{{ pillar.title }}</h3>
              <p class="description">{{ pillar.shortDesc }}</p>
              
              <ul class="sub-links">
                <li *ngFor="let link of pillar.subLinks">
                  <span class="arrow">&rarr;</span> {{ link }}
                </li>
              </ul>
              
              <div class="spacer"></div>
              
              <a [routerLink]="['/services']" [fragment]="pillar.id" class="btn outline mt-4">Learn More</a>
            </div>
            
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .services-mega-section {
      padding: 6rem 0;
      /* Dark background makes the glass effect visible and premium */
      background-color: var(--color-primary, #0F172A); 
      color: #ffffff;
      
    }

    .container {
      max-width: 1280px;
      margin: 0 auto;
      padding: 0 24px;
    }

    .section-header {
      margin-bottom: 4rem;
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;

      h2 { 
        font-size: clamp(2rem, 3vw, 2.5rem); 
        text-transform: uppercase; 
        color: #ffffff;
        margin-bottom: 0.5rem;
        letter-spacing: -0.02em;
      }
      p { 
        color: #94a3b8; 
        font-size: 1.125rem; 
        max-width: 600px; 
        margin-bottom: 1.5rem; 
      }
      .underline { 
        width: 60px; 
        height: 4px; 
        background: var(--color-accent, #2563eb); 
        border-radius: 2px;
      }
    }

    /* --- Grid Layout --- */
    .cards-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
      gap: 30px;
    }

    /* --- Glassmorphism Card Styling --- */
    .glass-card {
      position: relative;
      border-radius: 16px;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      /* The actual glass effect */
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255, 255, 255, 0.08);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      transition: transform 0.4s cubic-bezier(0.165, 0.84, 0.44, 1), 
                  border-color 0.4s, 
                  box-shadow 0.4s;
    }

    /* Faded background image layer */
    .card-bg {
      position: absolute;
      top: 0; left: 0; right: 0; bottom: 0;
      background-size: cover;
      background-position: center;
      opacity: 0.08; /* Kept very subtle so text stays readable */
      transition: transform 0.6s ease, opacity 0.6s ease;
      z-index: 1;
    }

    /* Gradient overlay to ensure the bottom of the card is always dark enough for the button */
    .glass-overlay {
      position: absolute;
      top: 0; left: 0; right: 0; bottom: 0;
      background: linear-gradient(to bottom, rgba(15, 23, 42, 0.1), rgba(15, 23, 42, 0.8));
      z-index: 2;
    }

    .card-content {
      position: relative;
      z-index: 3;
      padding: 40px 30px;
      display: flex;
      flex-direction: column;
      flex-grow: 1;
    }

    /* --- Hover Animations --- */
    .glass-card:hover {
      transform: translateY(-10px);
      border-color: rgba(0, 168, 204, 0.4); /* Glows with accent color */
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
      background: rgba(255, 255, 255, 0.05);
    }

    .glass-card:hover .card-bg {
      transform: scale(1.1);
      opacity: 0.15;
    }

    /* Cursor spotlight (driven by appSpotlight) */
    .glass-card::after {
      content: '';
      position: absolute;
      inset: 0;
      border-radius: inherit;
      pointer-events: none;
      z-index: 2;
      background: radial-gradient(340px circle at var(--mx, 50%) var(--my, 20%), rgba(147, 197, 253, 0.16), transparent 65%);
      opacity: 0;
      transition: opacity 0.45s ease;
    }

    .glass-card:hover::after {
      opacity: 1;
    }

    /* --- Typography & Elements inside Card --- */
    .icon-wrapper {
      width: 56px;
      height: 56px;
      margin-bottom: 22px;
      border-radius: 14px;
      display: grid;
      place-items: center;
      background: rgba(37, 99, 235, 0.14);
      border: 1px solid rgba(147, 197, 253, 0.22);
      transition: background 0.4s ease, border-color 0.4s ease;
    }

    .icon {
      width: 26px;
      height: 26px;
      display: block;
      color: var(--color-accent-soft, #93c5fd);
      transition: transform 0.4s ease;
    }

    .glass-card:hover .icon-wrapper {
      background: rgba(37, 99, 235, 0.22);
      border-color: rgba(147, 197, 253, 0.4);
    }

    .glass-card:hover .icon {
      transform: scale(1.08);
    }

    h3 {
      font-size: 1.4rem;
      margin-bottom: 12px;
      color: #ffffff;
      font-weight: 600;
    }

    .description {
      color: #cbd5e1;
      line-height: 1.6;
      font-size: 0.95rem;
      margin-bottom: 25px;
    }

    .sub-links {
      list-style: none;
      padding: 0;
      margin: 0;

      li {
        margin-bottom: 12px;
        color: #e2e8f0;
        font-size: 0.9rem;
        display: flex;
        align-items: center;
        transition: transform 0.3s ease, color 0.3s ease;
        cursor: default;

        .arrow {
          color: var(--color-accent, #2563eb);
          margin-right: 10px;
          font-weight: bold;
          transition: transform 0.3s ease;
        }
      }
    }

    .glass-card:hover .sub-links li {
      transform: translateX(4px); /* List nudges right slightly on card hover */
    }

    .spacer {
      flex-grow: 1;
      min-height: 30px;
    }

    /* --- Button Styling --- */
    .btn.outline {
      display: inline-block; 
      padding: 12px 24px; 
      font-weight: 600;
      border: 1px solid rgba(255, 255, 255, 0.3); 
      color: #ffffff;
      text-transform: uppercase; 
      letter-spacing: 1px; 
      font-size: 0.85rem;
      border-radius: 6px;
      text-align: center;
      text-decoration: none;
      width: max-content; 
      transition: all 0.3s ease;
      background: transparent;

      &:hover { 
        background: var(--color-accent, #2563eb); 
        border-color: var(--color-accent, #2563eb);
        color: #ffffff; 
        box-shadow: 0 4px 15px rgba(37, 99, 235, 0.3);
      }
    }
    
    .mt-4 { margin-top: 1.5rem; }
  `]
})
export class ServicesPillarsComponent {
  private contentService = inject(ContentService);

  get pillars(): ServicePillar[] {
    return this.contentService.services().map(s => ({
      id: s.id,
      title: s.title,
      shortDesc: s.leadDescription,
      subLinks: s.features ? s.features.slice(0, 4) : [],
      imageUrl: s.imageUrl
    }));
  }
}