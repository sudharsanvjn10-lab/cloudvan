import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FadeUpDirective } from '../../../../shared/directives/fade-up.directive';

interface ServicePillar {
  id: string;
  title: string;
  icon: string;
  shortDesc: string;
  subLinks: string[];
  imageUrl: string;
}

@Component({
  selector: 'app-services-pillars',
  standalone: true,
  imports: [CommonModule, RouterModule, FadeUpDirective],
  template: `
    <section class="services-mega-section">
      <div class="container section-header">
        <h2>Our Oracle Cloud Expertise</h2>
        <p>Comprehensive fusion solutions tailored to elevate your enterprise architecture.</p>
        <div class="underline"></div>
      </div>

      <div class="container">
        <div class="cards-grid">
          <div *ngFor="let pillar of pillars; let i = index" class="glass-card" appFadeUp [delay]="i * 120">
            
            <div class="card-bg" [style.backgroundImage]="'url(' + pillar.imageUrl + ')'"></div>
            
            <div class="glass-overlay"></div>

            <div class="card-content">
              <div class="icon-wrapper">
                <span class="icon">{{ pillar.icon }}</span>
              </div>
              
              <h3>{{ pillar.title }}</h3>
              <p class="description">{{ pillar.shortDesc }}</p>
              
              <ul class="sub-links">
                <li *ngFor="let link of pillar.subLinks">
                  <span class="arrow">&rarr;</span> {{ link }}
                </li>
              </ul>
              
              <div class="spacer"></div>
              
              <a routerLink="/services" class="btn outline mt-4">Learn More</a>
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
      font-family: 'Inter', sans-serif;
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
        background: var(--color-accent, #00a8cc); 
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
      transform: scale(1.1); /* Slow zoom on image */
      opacity: 0.15;
    }

    /* --- Typography & Elements inside Card --- */
    .icon-wrapper {
      margin-bottom: 20px;
      .icon {
        font-size: 2.5rem;
        display: inline-block;
        transition: transform 0.4s ease;
      }
    }

    .glass-card:hover .icon {
      transform: scale(1.15) rotate(5deg); /* Playful icon bump */
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
          color: var(--color-accent, #00a8cc);
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
        background: var(--color-accent, #00a8cc); 
        border-color: var(--color-accent, #00a8cc);
        color: #ffffff; 
        box-shadow: 0 4px 15px rgba(0, 168, 204, 0.3);
      }
    }
    
    .mt-4 { margin-top: 1.5rem; }
  `]
})
export class ServicesPillarsComponent {
  pillars: ServicePillar[] = [
    {
      id: 'core-hr', title: 'Core HR & Global Workforce', icon: '👥',
      shortDesc: 'Establish enterprise workforce structures, person models, and automated employee journeys from hire to retire.',
      subLinks: ['Workforce Structures', 'Position & Job Management', 'Journeys & Onboarding', 'Health & Safety'],
      imageUrl: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=800&auto=format&fit=crop'
    },
    {
      id: 'payroll', title: 'Payroll & Compensation', icon: '💳',
      shortDesc: 'Automate localized multi-country payroll calculations, retroactive pay runs, Fast Formulas, and total rewards.',
      subLinks: ['Global Payroll Processing', 'Fast Formulas Architecture', 'Salary Basis & Cycles', 'Total Compensation Statements'],
      imageUrl: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?q=80&w=800&auto=format&fit=crop'
    },
    {
      id: 'absence', title: 'Time & Absence Management', icon: '⏱️',
      shortDesc: 'Simplify complex leave policies, shift scheduling, time card approvals, and automated accrual plan balances.',
      subLinks: ['Time Card Rule Templates', 'Accrual & Donation Plans', 'Shift & Roster Scheduling', 'Absence Approvals & Delegation'],
      imageUrl: 'https://images.unsplash.com/photo-1506784365847-bbad939e9335?q=80&w=800&auto=format&fit=crop'
    },
    {
      id: 'talent', title: 'Talent & Recruiting (ORC)', icon: '🎯',
      shortDesc: 'Attract top candidates with Oracle Recruiting Cloud, align employee goals, and optimize performance cycles.',
      subLinks: ['Oracle Recruiting Cloud (ORC)', 'Goal & Performance Reviews', 'Succession Planning', 'Oracle Learning Cloud'],
      imageUrl: 'https://images.unsplash.com/photo-1565688534245-05d6b5be184a?q=80&w=800&auto=format&fit=crop'
    },
    {
      id: 'redwood', title: 'Redwood UI & VBS Extensions', icon: '🎨',
      shortDesc: 'Design bespoke employee experiences utilizing Oracle Visual Builder Studio (VBS), JavaScript chains, and Business Rules.',
      subLinks: ['Visual Builder Studio (VBS)', 'Express & Advanced Business Rules', 'Custom Guided Journeys', 'Modern Redwood Pages'],
      imageUrl: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?q=80&w=800&auto=format&fit=crop'
    },
    {
      id: 'integrations', title: 'HDL & BI Reporting', icon: '⚡',
      shortDesc: 'High-volume data migration with HDL/HSDL, scheduled HCM Extracts, REST APIs, and deep OTBI/BI Publisher reporting.',
      subLinks: ['HCM Data Loader (HDL)', 'HCM Inbound/Outbound Extracts', 'REST/SOAP API Integrations', 'OTBI & BI Publisher Analytics'],
      imageUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=800&auto=format&fit=crop'
    }
  ];
}