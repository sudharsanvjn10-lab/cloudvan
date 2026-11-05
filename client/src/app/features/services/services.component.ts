import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { FadeUpDirective } from '../../shared/directives/fade-up.directive';

interface DetailedService {
  id: string;
  moduleCode: string;
  title: string;
  statusBadge: string;
  leadDescription: string;
  paragraph: string;
  features: string[];
  imageUrl: string;
}

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [CommonModule, RouterModule, FadeUpDirective],
  template: `
    <header class="services-header">
      <div class="container">
        <span class="header-badge reveal-up">Enterprise Oracle Practice</span>
        <h1 class="reveal-up-delay-1">Our Oracle Cloud Services</h1>
        <p class="reveal-up-delay-1">Comprehensive enterprise solutions tailored exclusively for Oracle Fusion HCM Cloud.</p>
      </div>
    </header>

    <!-- Sticky Module Quick-Jump Bar -->
    <nav class="sticky-subnav" aria-label="Service Modules Sub-Navigation">
      <div class="container subnav-container">
        <span class="subnav-label">Jump to:</span>
        <div class="subnav-pills">
          <button 
            *ngFor="let s of detailedServices"
            type="button"
            class="subnav-pill"
            [class.active]="activeModuleId === s.id"
            (click)="scrollToModule(s.id)">
            {{ s.title.split('&')[0].trim() }}
          </button>
        </div>
      </div>
    </nav>

    <div class="services-content">
      <section 
        appFadeUp 
        class="service-row" 
        *ngFor="let service of detailedServices; let isEven = even"
        [class.reversed]="isEven"
        [id]="service.id">
        
        <div class="container row-inner">
          
          <div class="text-block">
            <div class="module-meta">
              <span class="module-code">{{ service.moduleCode }}</span>
              <div class="icon-box">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" [ngSwitch]="service.id">
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
            </div>
            
            <h2>{{ service.title }}</h2>
            <p class="lead-text">{{ service.leadDescription }}</p>
            <p class="detailed-paragraph">{{ service.paragraph }}</p>
            
            <div class="feature-list-wrapper">
              <h3>Key Capabilities:</h3>
              <div class="features-grid">
                <div class="feature-card" *ngFor="let feature of service.features">
                  <div class="check-badge">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </div>
                  <span class="feature-text">{{ feature }}</span>
                </div>
              </div>
            </div>
            
            <a routerLink="/contact" class="btn-primary mt-4">
              <span>Consult with our Experts</span>
              <svg class="btn-arrow" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </a>
          </div>

          <div class="image-block">
            <div class="image-frame-container">
              <!-- Floating Corner Status Pill -->
              <div class="floating-status-pill">
                <span class="status-indicator"></span>
                <span>{{ service.statusBadge }}</span>
              </div>

              <div class="image-wrapper">
                <img 
                  [src]="service.imageUrl" 
                  [alt]="service.title" 
                  loading="lazy" 
                  (error)="onImgError($event, service.id)">
              </div>
            </div>
          </div>

        </div>
      </section>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      background-color: var(--color-white, #FFFFFF); 
      color: var(--text-main, #0f172a); 
      
      min-height: 100vh;
    }

    .container {
      max-width: 1280px;
      margin: 0 auto;
      padding: 0 24px;
    }

    /* --- Header Section --- */
    .services-header {
      padding: 130px 0 60px; 
      text-align: center;
      background: linear-gradient(135deg, var(--color-primary-dark, #070b19) 0%, var(--color-primary, #0b0f19) 50%, #1e3a8a 100%);
      color: #ffffff;
      position: relative;
    }

    .header-badge {
      display: inline-block;
      font-size: 0.8rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      color: #38bdf8;
      background: rgba(56, 189, 248, 0.12);
      border: 1px solid rgba(56, 189, 248, 0.3);
      padding: 6px 16px;
      border-radius: 999px;
      margin-bottom: 16px;
    }

    .services-header h1 {
      font-size: clamp(2.5rem, 5vw, 4rem);
      margin-bottom: 15px;
      color: #ffffff;
      letter-spacing: -0.03em;
      font-weight: 700;
    }

    .services-header p {
      font-size: 1.2rem;
      color: #94a3b8;
      max-width: 800px;
      margin: 0 auto;
      line-height: 1.6;
    }

    /* --- Sticky Sub-Navigation Bar --- */
    .sticky-subnav {
      position: sticky;
      top: 72px; /* Sits cleanly below sticky header */
      z-index: 900;
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      border-bottom: 1px solid #e2e8f0;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.04);
      padding: 12px 0;
      transition: all 0.3s ease;
    }

    .subnav-container {
      display: flex;
      align-items: center;
      gap: 16px;
      overflow-x: auto;
      scrollbar-width: none;
      &::-webkit-scrollbar { display: none; }
    }

    .subnav-label {
      font-size: 0.85rem;
      font-weight: 700;
      color: #64748b;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      flex-shrink: 0;
    }

    .subnav-pills {
      display: flex;
      align-items: center;
      gap: 10px;
      flex-shrink: 0;
    }

    .subnav-pill {
      background: #f1f5f9;
      border: 1px solid #e2e8f0;
      padding: 8px 16px;
      border-radius: 20px;
      font-size: 0.875rem;
      font-weight: 600;
      color: #334155;
      cursor: pointer;
      white-space: nowrap;
      transition: all 0.2s ease;

      &:hover {
        background: #e2e8f0;
        color: #0f172a;
      }

      &.active {
        background: #2563eb;
        border-color: #2563eb;
        color: #ffffff;
        box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
      }
    }

    /* --- Alternating Row Layout --- */
    .service-row {
      padding: 90px 0;
      border-bottom: 1px solid #f1f5f9;
      scroll-margin-top: 130px; /* Accounts for sticky headers when jumping */
    }

    .row-inner {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 50px;
    }

    @media (min-width: 1024px) {
      .row-inner {
        flex-direction: row;
        justify-content: space-between;
      }
      
      .text-block, .image-block {
        flex: 1;
        width: 50%;
      }

      .service-row.reversed .row-inner {
        flex-direction: row-reverse;
      }

      .text-block { padding-right: 50px; }
      .service-row.reversed .text-block { padding-right: 0; padding-left: 50px; }
    }

    /* --- Text Block --- */
    .module-meta {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 16px;
    }

    .module-code {
      font-size: 0.75rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      color: #2563eb;
      background: #eff6ff;
      border: 1px solid #bfdbfe;
      padding: 4px 10px;
      border-radius: 6px;
    }

    .icon-box {
      width: 44px;
      height: 44px;
      background: #eff6ff;
      border: 1px solid #bfdbfe;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #2563eb;
      svg { width: 22px; height: 22px; display: block; }
    }

    .text-block h2 {
      font-size: clamp(1.8rem, 3vw, 2.4rem);
      margin-bottom: 16px;
      color: #0f172a;
      letter-spacing: -0.02em;
      font-weight: 700;
      line-height: 1.25;
    }

    .lead-text {
      font-size: 1.15rem;
      color: #2563eb;
      margin-bottom: 16px;
      line-height: 1.6;
      font-weight: 600;
    }

    .detailed-paragraph {
      font-size: 1rem;
      color: #64748b;
      margin-bottom: 28px;
      line-height: 1.7;
    }

    /* --- Key Capabilities 2-Column Mini-Cards --- */
    .feature-list-wrapper h3 {
      font-size: 1rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      color: #0f172a;
      margin-bottom: 16px;
    }

    .features-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 12px;

      @media (min-width: 640px) {
        grid-template-columns: 1fr 1fr;
      }
    }

    .feature-card {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 10px;
      padding: 12px 14px;
      display: flex;
      align-items: center;
      gap: 10px;
      transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);

      &:hover {
        background: #ffffff;
        border-color: #93c5fd;
        transform: translateY(-2px);
        box-shadow: 0 8px 18px -4px rgba(37, 99, 235, 0.12);
      }
    }

    .check-badge {
      width: 24px;
      height: 24px;
      border-radius: 50%;
      background: #dbeafe;
      color: #2563eb;
      flex-shrink: 0;
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }

    .feature-text {
      font-size: 0.9rem;
      font-weight: 600;
      color: #1e293b;
      line-height: 1.35;
    }

    /* --- CTA Button --- */
    .btn-primary {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      padding: 14px 28px;
      background: #2563eb;
      color: #ffffff;
      text-decoration: none;
      font-weight: 600;
      border-radius: 8px;
      transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
      box-shadow: 0 4px 14px rgba(37, 99, 235, 0.25);

      &:hover {
        background: #1d4ed8;
        transform: translateY(-2px);
        box-shadow: 0 8px 24px rgba(37, 99, 235, 0.35);

        .btn-arrow {
          transform: translateX(4px);
        }
      }
    }

    .btn-arrow {
      transition: transform 0.25s ease;
    }
    
    .mt-4 { margin-top: 2rem; }

    /* --- Multi-Layered Image Framing --- */
    .image-frame-container {
      position: relative;
      background: linear-gradient(145deg, #ffffff, #f1f5f9);
      padding: 14px;
      border-radius: 20px;
      border: 1px solid #e2e8f0;
      box-shadow: 0 20px 40px -15px rgba(15, 23, 42, 0.08);
      transition: transform 0.4s ease, box-shadow 0.4s ease;

      &:hover {
        transform: translateY(-4px);
        box-shadow: 0 28px 50px -15px rgba(37, 99, 235, 0.14);
      }
    }

    .floating-status-pill {
      position: absolute;
      top: 24px;
      right: 24px;
      z-index: 10;
      display: inline-flex;
      align-items: center;
      gap: 8px;
      background: rgba(15, 23, 42, 0.85);
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
      border: 1px solid rgba(255, 255, 255, 0.18);
      color: #ffffff;
      padding: 6px 14px;
      border-radius: 999px;
      font-size: 0.8rem;
      font-weight: 600;
      box-shadow: 0 4px 14px rgba(0, 0, 0, 0.2);
    }

    .status-indicator {
      width: 7px;
      height: 7px;
      border-radius: 50%;
      background: #10b981;
      box-shadow: 0 0 8px #10b981;
    }

    .image-wrapper {
      position: relative;
      border-radius: 12px;
      overflow: hidden;
      aspect-ratio: 16/10;
      background-color: #070b19;
      background-image: linear-gradient(135deg, #070b19 0%, #1e3a8a 100%);
    }

    .image-wrapper img {
      width: 100%;
      height: 100%;
      display: block;
      object-fit: cover;
      transition: transform 0.5s ease;
    }

    .image-frame-container:hover .image-wrapper img {
      transform: scale(1.03);
    }
  `]
})
export class ServicesComponent implements OnInit {
  private route = inject(ActivatedRoute);

  ngOnInit() {
    this.route.fragment.subscribe(fragment => {
      if (fragment) {
        setTimeout(() => this.scrollToModule(fragment), 120);
      }
    });
  }
  activeModuleId: string = 'core-hr';
  
  detailedServices: DetailedService[] = [
    {
      id: 'core-hr',
      moduleCode: 'MODULE 01',
      title: 'Core HR & Global Human Resources',
      statusBadge: '100% Redwood Compatible',
      leadDescription: 'Architect a single source of truth for global workforce structures, person models, and automated employee journeys.',
      paragraph: 'Oracle Fusion Cloud Core HR allows organizations to manage their global workforce from hire to retire with unparalleled clarity. Our certified functional consultants configure robust enterprise structures, position trees, and compliance rules. We ensure seamless employee and manager self-service, localized compliance across international borders, and integrated guided journeys that simplify everyday HR interactions.',
      features: [
        'Global Workforce Structures', 
        'Position & Organization Trees', 
        'Employee & Manager Self-Service', 
        'Guided Journeys & Onboarding', 
        'Health & Safety Incidents', 
        'Workforce Predictions & Modeling'
      ],
      imageUrl: 'assets/images/photo-1497215728101-856f4ea42174.webp'
    },
    {
      id: 'payroll',
      moduleCode: 'MODULE 02',
      title: 'Oracle Fusion Payroll & Compensation',
      statusBadge: '99.98% Calculation Accuracy',
      leadDescription: 'Automate localized multi-country payroll calculations, retroactive processing, and strategic total compensation.',
      paragraph: 'Ensure accurate, on-time, and fully compliant compensation for your workforce with Oracle Fusion Global Payroll. We design complex Fast Formulas, setup retroactive pay processes, and integrate seamlessly with third-party banking networks. Our compensation experts tailor merit cycles, bonus distribution, and salary basis architectures to retain top performers.',
      features: [
        'Global Payroll Processing', 
        'Fast Formulas Engineering', 
        'Retroactive Pay Processing', 
        'Salary Basis & Merit Review Cycles', 
        'Total Compensation Statements', 
        'Costing & GL Journal Mapping'
      ],
      imageUrl: 'assets/images/photo-1554224155-8d04cb21cd6c.webp'
    },
    {
      id: 'absence',
      moduleCode: 'MODULE 03',
      title: 'Time & Labor and Absence Management',
      statusBadge: 'Automated Shift Roster Sync',
      leadDescription: 'Streamline shift scheduling, multi-tier approvals, complex leave accruals, and regulatory compliance.',
      paragraph: 'Manage diverse employee schedules, attendance capture, and localized leave rules effortlessly. We configure customized time card layouts, rule templates, and accrual plans tailored to collective bargaining agreements or regional statutory regulations. Integrated approval workflows and delegation matrices ensure management decisions remain frictionless.',
      features: [
        'Custom Time Card Layouts', 
        'Time Entry Validation Rule Sets', 
        'Accrual & Compensatory Plans', 
        'Leave Donation Schemes', 
        'Shift Roster Generation', 
        'Manager Delegation Approvals'
      ],
      imageUrl: 'assets/images/photo-1506784365847-bbad939e9335.webp'
    },
    {
      id: 'talent',
      moduleCode: 'MODULE 04',
      title: 'Talent Management & Recruiting (ORC)',
      statusBadge: 'AI-Powered Candidate Match',
      leadDescription: 'Attract high-caliber talent, align employee objectives, and cultivate future leaders with intelligent HCM.',
      paragraph: 'From candidate sourcing with Oracle Recruiting Cloud (ORC) to goal alignment and succession planning, we build interconnected talent ecosystems. Foster employee growth with continuous feedback, AI-assisted candidate matching, talent review calibration meetings, and integrated Oracle Learning Cloud courses.',
      features: [
        'Oracle Recruiting Cloud (ORC)', 
        'Automated Candidate Screening', 
        'Continuous Goal Management', 
        'Annual & Mid-Year Performance', 
        'Talent Review & 9-Box Calibration', 
        'Succession & Learning Paths'
      ],
      imageUrl: 'assets/images/photo-1565688534245-05d6b5be184a.webp'
    },
    {
      id: 'redwood',
      moduleCode: 'MODULE 05',
      title: 'Redwood UI & Visual Builder Studio (VBS)',
      statusBadge: 'Sub-Second Page Telemetry',
      leadDescription: 'Customize and elevate your Oracle HCM user interface using Redwood design standards and VBS business rules.',
      paragraph: 'Transform your user experience with Oracle Redwood UI. Our technical team leverages Oracle Visual Builder Studio (VBS) to build bespoke page extensions, configure Express & Advanced Business Rules, and create intuitive guided workflows that fit your exact corporate identity while maintaining 100% upgrade safety.',
      features: [
        'VBS Page Extensions', 
        'Express & Advanced Business Rules', 
        'Custom Fields & Dynamic Layouts', 
        'Guided Journeys Personalization', 
        'JavaScript Action Chains', 
        'Zero Upgrade-Impact Extensibility'
      ],
      imageUrl: 'assets/images/photo-1581291518857-4e27b48ff24e.webp'
    },
    {
      id: 'integrations',
      moduleCode: 'MODULE 06',
      title: 'HCM Integrations & BI Reporting',
      statusBadge: 'Real-Time HDL & OIC Pipeline',
      leadDescription: 'Execute robust data migrations, automated outbound extracts, and actionable enterprise BI analytics.',
      paragraph: 'Bridge Oracle Fusion HCM with your entire IT landscape. We engineer high-throughput data loads via HCM Data Loader (HDL/HSDL), automated payroll and benefits outbound files using HCM Extracts, real-time REST API orchestrations via OIC, and executive dashboards with OTBI & BI Publisher.',
      features: [
        'HCM Data Loader (HDL/HSDL) Scripts', 
        'Inbound & Outbound HCM Extracts', 
        'Oracle Integration Cloud (OIC) Flows', 
        'Real-Time REST & SOAP Services', 
        'OTBI Subject Area Analytics', 
        'Pixel-Perfect BI Publisher Reports'
      ],
      imageUrl: 'assets/images/photo-1558494949-ef010cbdcc31.webp'
    }
  ];

  scrollToModule(moduleId: string) {
    this.activeModuleId = moduleId;
    if (typeof document !== 'undefined') {
      const el = document.getElementById(moduleId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }

  onImgError(event: Event, moduleId: string) {
    const img = event.target as HTMLImageElement;
    // Elegant bespoke SVG fallback tailored to Oracle Fusion HCM module
    img.src = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="375" viewBox="0 0 600 375" fill="none"><rect width="600" height="375" fill="%23070b19"/><rect x="40" y="40" width="520" height="295" rx="12" fill="%230f172a" stroke="%231e3a8a" stroke-width="2"/><text x="70" y="100" fill="%2360a5fa" font-family="sans-serif" font-size="20" font-weight="bold">Oracle Fusion HCM Cloud</text><text x="70" y="140" fill="%2394a3b8" font-family="sans-serif" font-size="16">${moduleId.toUpperCase()} Architecture</text><line x1="70" y1="170" x2="530" y2="170" stroke="%23334155" stroke-width="1.5"/><rect x="70" y="200" width="130" height="80" rx="8" fill="%231e293b"/><text x="90" y="235" fill="%2338bdf8" font-family="sans-serif" font-size="22" font-weight="bold">99.9%</text><text x="90" y="260" fill="%2394a3b8" font-family="sans-serif" font-size="12">Availability</text><rect x="220" y="200" width="130" height="80" rx="8" fill="%231e293b"/><text x="240" y="235" fill="%2310b981" font-family="sans-serif" font-size="22" font-weight="bold">Redwood</text><text x="240" y="260" fill="%2394a3b8" font-family="sans-serif" font-size="12">VBS Verified</text><rect x="370" y="200" width="160" height="80" rx="8" fill="%231e293b"/><text x="390" y="235" fill="%23f59e0b" font-family="sans-serif" font-size="22" font-weight="bold">Enterprise</text><text x="390" y="260" fill="%2394a3b8" font-family="sans-serif" font-size="12">Cloud Security</text></svg>`;
  }
}
