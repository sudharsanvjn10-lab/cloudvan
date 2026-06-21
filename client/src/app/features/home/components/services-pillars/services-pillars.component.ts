import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

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
  imports: [CommonModule, RouterModule],
  template: `
    <section class="services-mega-section">
      <div class="container section-header">
        <h2>Our Oracle Cloud Expertise</h2>
        <p>Comprehensive fusion solutions tailored to elevate your enterprise architecture.</p>
        <div class="underline"></div>
      </div>

      <div class="container">
        <div class="cards-grid">
          <div *ngFor="let pillar of pillars" class="glass-card">
            
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
      id: 'hcm', title: 'Oracle Fusion HCM', icon: '👥',
      shortDesc: 'Manage your most important asset — your people. End-to-end human capital management from hire to retire.',
      subLinks: ['Core HR & Payroll', 'Talent Management', 'Workforce Compensation', 'Recruiting Cloud'],
      imageUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=800&auto=format&fit=crop'
    },
    {
      id: 'erp', title: 'Oracle Fusion ERP', icon: '📊',
      shortDesc: 'Automate back-office operations, manage financial realities, and drive business model innovation.',
      subLinks: ['Financials Cloud', 'Project Management', 'Risk Management', 'Compliance'],
      imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800&auto=format&fit=crop'
    },
    {
      id: 'scm', title: 'Oracle Fusion SCM', icon: '🔗',
      shortDesc: 'Build resilient, agile, and sustainable supply chains tailored for modern global logistics.',
      subLinks: ['Inventory Management', 'Manufacturing', 'Order Management', 'Logistics'],
      imageUrl: 'https://images.unsplash.com/photo-1586528116311-ad8ed7450862?q=80&w=800&auto=format&fit=crop'
    },
    {
      id: 'epm', title: 'Oracle Fusion EPM', icon: '📈',
      shortDesc: 'Connect enterprise planning, accelerate financial close, and make better decisions faster.',
      subLinks: ['Enterprise Planning', 'Financial Consolidation', 'Profitability & Costing', 'Narrative Reporting'],
      imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800&auto=format&fit=crop'
    },
    {
      id: 'cx', title: 'Oracle Fusion CX', icon: '🤝',
      shortDesc: 'Transform customer experiences with connected data, intelligent insights, and tailored engagements.',
      subLinks: ['Sales Cloud', 'Service Cloud', 'Marketing Cloud', 'Commerce Cloud'],
      imageUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=800&auto=format&fit=crop'
    }
  ];
}