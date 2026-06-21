import { Component, signal } from '@angular/core';
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

      <div class="pillars-container" (mouseleave)="resetPillar()">
        <div 
          *ngFor="let pillar of pillars; let i = index" 
          class="pillar" 
          [class.expanded]="activePillar() === i"
          (mouseenter)="setActivePillar(i)"
          (focus)="setActivePillar(i)"
          tabindex="0"
          [attr.aria-expanded]="activePillar() === i"
        >
          <div class="bg-image" [style.backgroundImage]="'url(' + pillar.imageUrl + ')'"></div>
          <div class="overlay"></div>

          <div class="pillar-content">
            <div class="icon-title-wrapper">
              <span class="icon">{{ pillar.icon }}</span>
              <h3>{{ pillar.title }}</h3>
            </div>
            
            <div class="expanded-content">
              <p>{{ pillar.shortDesc }}</p>
              <ul class="sub-links">
                <li *ngFor="let link of pillar.subLinks">
                  <a routerLink="/services" class="hover-link">&rarr; {{ link }}</a>
                </li>
              </ul>
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
      background-color: var(--color-white);
    }

    .section-header {
      margin-bottom: 3rem;
      h2 { font-size: clamp(2rem, 3vw, 2.5rem); text-transform: uppercase; }
      p { color: var(--text-muted); font-size: 1.125rem; max-width: 600px; margin-bottom: 1rem; }
      .underline { width: 60px; height: 4px; background: var(--color-accent); }
    }

    .pillars-container {
      display: flex;
      flex-direction: column;
      width: 100%;
      height: auto;
      min-height: 600px;
      
      @media (min-width: 1024px) {
        flex-direction: row;
      }
    }

    .pillar {
      flex: 1;
      position: relative;
      overflow: hidden;
      background: var(--color-primary);
      border-right: 1px solid rgba(255,255,255,0.1);
      transition: flex 0.6s cubic-bezier(0.25, 1, 0.5, 1);
      cursor: pointer;
      min-height: 120px;

      &:last-child { border-right: none; }

      @media (min-width: 1024px) {
        border-right: 1px solid rgba(255,255,255,0.1);
        border-bottom: none;
      }

      &.expanded {
        flex: 3;
        .bg-image { opacity: 0.4; transform: scale(1.05); }
        .expanded-content { opacity: 1; visibility: visible; transform: translateY(0); transition-delay: 0.2s; }
        .icon { color: var(--color-accent); transform: scale(1.1); }
      }
    }

    .bg-image {
      position: absolute;
      top: 0; left: 0; width: 100%; height: 100%;
      background-size: cover;
      background-position: center;
      opacity: 0;
      transition: opacity 0.6s, transform 6s linear;
      z-index: 1;
    }

    .overlay {
      position: absolute;
      top: 0; left: 0; width: 100%; height: 100%;
      background: linear-gradient(to bottom, rgba(10,37,64,0.9), rgba(10,37,64,1));
      z-index: 2;
    }

    .pillar-content {
      position: relative;
      z-index: 3;
      padding: 2rem;
      height: 100%;
      display: flex;
      flex-direction: column;
      color: var(--color-bg-light);
    }

    .icon-title-wrapper {
      display: flex;
      align-items: center;
      gap: 1rem;
      margin-bottom: 2rem;
      white-space: nowrap;

      .icon {
        font-size: 2rem;
        color: var(--color-bg-light);
        transition: color 0.3s, transform 0.3s;
      }
      h3 {
        margin: 0;
        color: #fff;
        font-size: 1.25rem;
      }

      @media (min-width: 1024px) {
        flex-direction: column;
        align-items: flex-start;
      }
    }

    .expanded-content {
      opacity: 0;
      visibility: hidden;
      transform: translateY(20px);
      transition: all 0.4s ease;
      display: flex;
      flex-direction: column;
      flex-grow: 1;
      min-width: 280px;

      p { margin-bottom: 1.5rem; color: #e2e8f0; line-height: 1.5; }
      
      .sub-links {
        list-style: none;
        padding: 0;
        margin-bottom: auto;
        
        li { margin-bottom: 0.75rem; }
        .hover-link {
          color: #fff;
          font-weight: 600;
          transition: color 0.3s, padding-left 0.3s;
          &:hover { color: var(--color-accent); padding-left: 8px; }
        }
      }
    }

    /* Local Button Outline */
    .btn.outline {
      display: inline-block; padding: 10px 20px; font-weight: 600;
      border: 2px solid var(--color-accent); color: var(--color-accent);
      text-transform: uppercase; letter-spacing: 1px; font-size: 0.875rem;
      width: max-content; transition: 0.3s;
      &:hover { background: var(--color-accent); color: var(--color-primary); }
    }
    .mt-4 { margin-top: 1.5rem; }
  `]
})
export class ServicesPillarsComponent {
  // Default to the first pillar being expanded on desktop
  activePillar = signal<number>(0);

  // PLACEHOLDER NOTE: I am using emoji icons for immediate visual feedback. 
  // In production, swap these for SVGs or an icon library like FontAwesome.
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

  setActivePillar(index: number) {
    this.activePillar.set(index);
  }

  resetPillar() {
    // Optional: Return to pillar 0 when mouse leaves the whole section
    // this.activePillar.set(0); 
  }
}