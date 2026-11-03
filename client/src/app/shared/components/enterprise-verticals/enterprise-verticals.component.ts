import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FadeUpDirective } from '../../directives/fade-up.directive';

interface IndustryCard {
  title: string;
  badge: string;
  description: string;
  iconSvg: string;
}

@Component({
  selector: 'app-enterprise-verticals',
  standalone: true,
  imports: [CommonModule, FadeUpDirective],
  template: `
    <section class="verticals-section">
      <div class="container text-center">
        <span class="section-tag">Industry Excellence</span>
        <h2 class="section-title">Trusted Across Global Enterprise Verticals</h2>
        <div class="title-underline"></div>
        <p class="section-subtitle">
          Delivering specialized Oracle® Fusion HCM Cloud solutions engineered to address high-compliance, multi-country workforce challenges.
        </p>

        <div class="cards-grid">
          <div *ngFor="let item of verticals; let i = index" class="vertical-card" appFadeUp [delay]="i * 80">
            <div class="icon-bubble" [innerHTML]="item.iconSvg"></div>
            <span class="badge">{{ item.badge }}</span>
            <h3 class="card-title">{{ item.title }}</h3>
            <p class="card-desc">{{ item.description }}</p>
          </div>
        </div>

        <div class="legal-notice">
          <p>
            * Cloud Vantage Solutions delivers independent consulting, implementation, and managed services specializing in Oracle® Fusion Cloud Human Capital Management (HCM). Oracle and Java are registered trademarks of Oracle Corporation and/or its affiliates.
          </p>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .verticals-section {
      background-color: #f8fafc;
      padding: 90px 24px;
      font-family: 'Inter', sans-serif;
    }

    .container {
      max-width: 1200px;
      margin: 0 auto;
    }

    .text-center {
      text-align: center;
    }

    .section-tag {
      display: inline-block;
      font-size: 0.85rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: var(--color-accent, #2563eb);
      background: rgba(37, 99, 235, 0.08);
      padding: 6px 14px;
      border-radius: 20px;
      margin-bottom: 12px;
    }

    .section-title {
      font-size: clamp(2rem, 3.5vw, 2.75rem);
      color: #0f172a;
      margin-bottom: 12px;
      font-weight: 700;
      letter-spacing: -0.02em;
    }

    .title-underline {
      width: 50px;
      height: 4px;
      background: var(--color-accent, #2563eb);
      margin: 0 auto 20px;
      border-radius: 2px;
    }

    .section-subtitle {
      font-size: 1.15rem;
      color: #475569;
      max-width: 720px;
      margin: 0 auto 50px;
      line-height: 1.6;
    }

    .cards-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 28px;
      text-align: left;

      @media (min-width: 640px) {
        grid-template-columns: repeat(2, 1fr);
      }
      @media (min-width: 1024px) {
        grid-template-columns: repeat(3, 1fr);
      }
    }

    .vertical-card {
      background: #ffffff;
      padding: 32px 28px;
      border-radius: 12px;
      border: 1px solid #e2e8f0;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.03);
      transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.3s ease, border-color 0.3s ease;
      position: relative;
      display: flex;
      flex-direction: column;

      &:hover {
        transform: translateY(-6px);
        box-shadow: 0 16px 32px -8px rgba(37, 99, 235, 0.12);
        border-color: rgba(37, 99, 235, 0.3);
      }
    }

    .icon-bubble {
      width: 52px;
      height: 52px;
      border-radius: 12px;
      background: rgba(37, 99, 235, 0.1);
      color: #2563eb;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 20px;

      ::ng-deep svg {
        width: 26px;
        height: 26px;
      }
    }

    .badge {
      align-self: flex-start;
      font-size: 0.75rem;
      font-weight: 600;
      color: #2563eb;
      background: #eff6ff;
      padding: 4px 10px;
      border-radius: 4px;
      margin-bottom: 12px;
      letter-spacing: 0.02em;
    }

    .card-title {
      font-size: 1.25rem;
      color: #0f172a;
      margin-bottom: 12px;
      font-weight: 700;
      line-height: 1.3;
    }

    .card-desc {
      font-size: 0.95rem;
      color: #64748b;
      line-height: 1.6;
      margin: 0;
      flex-grow: 1;
    }

    .legal-notice {
      margin-top: 50px;
      padding-top: 24px;
      border-top: 1px solid #e2e8f0;
      p {
        font-size: 0.8rem;
        color: #94a3b8;
        line-height: 1.5;
        max-width: 900px;
        margin: 0 auto;
      }
    }
  `]
})
export class EnterpriseVerticalsComponent {
  verticals: IndustryCard[] = [
    {
      title: 'Global Banking & Financial Services',
      badge: 'Multi-Country Payroll & SOX',
      description: 'Architecting resilient Oracle Fusion HCM deployments supporting strict audit trails, complex compensation structures, and high-frequency localized payroll runs.',
      iconSvg: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.5m-15 0V21" /></svg>'
    },
    {
      title: 'Healthcare & Life Sciences',
      badge: 'Workforce Scheduling & HIPAA',
      description: 'Streamlining round-the-clock clinical shift scheduling, license/credential verification, and automated talent onboarding for major hospital networks.',
      iconSvg: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" /></svg>'
    },
    {
      title: 'High-Tech & Professional Services',
      badge: 'Redwood Journeys & Talent',
      description: 'Deploying intuitive Redwood self-service experiences, agile performance appraisals, and career growth journeys for fast-growing global workforces.',
      iconSvg: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m0 0l2.699 2.7z" /></svg>'
    },
    {
      title: 'Manufacturing & Industrial Chains',
      badge: 'Time & Labor Automation',
      description: 'Automating complex shop-floor time collection, collective bargaining wage rules, and union overtime policies with real-time Oracle Time & Labor integration.',
      iconSvg: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M10.343 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.149.894c.07.424.384.764.78.93.398.164.855.142 1.205-.108l.737-.527a1.125 1.125 0 011.45.12l.773.774c.39.389.44 1.002.12 1.45l-.527.737c-.25.35-.272.806-.107 1.204.165.397.505.71.93.78l.893.15c.543.09.94.559.94 1.109v1.094c0 .55-.397 1.02-.94 1.11l-.894.149c-.424.07-.764.383-.929.78-.165.398-.143.854.107 1.204l.527.738c.32.447.27.1.06-.12l-.773.773a1.125 1.125 0 01-1.449.12l-.738-.527c-.35-.25-.806-.272-1.203-.107-.398.165-.71.505-.781.929l-.15.894c-.09.542-.56.94-1.11.94h-1.094c-.55 0-1.019-.398-1.11-.94l-.148-.894c-.071-.424-.384-.764-.781-.93-.398-.164-.854-.142-1.204.108l-.738.527c-.447.32-1.06.27-1.45-.12l-.773-.774a1.125 1.125 0 01-.12-1.45l.527-.737c.25-.35.272-.806.108-1.204-.165-.397-.506-.71-.93-.78l-.894-.15c-.542-.09-.94-.56-.94-1.109v-1.094c0-.55.398-1.02.94-1.11l.894-.149c.424-.07.765-.383.93-.78.165-.398.143-.854-.108-1.204l-.526-.738a1.125 1.125 0 01.12-1.45l.773-.773a1.125 1.125 0 011.45-.12l.737.527c.35.25.807.272 1.204.107.397-.165.71-.505.78-.929l.15-.894z" /><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>'
    },
    {
      title: 'Higher Education & Public Sector',
      badge: 'Position Budgeting & Tenure',
      description: 'Configuring multi-funded position management, faculty tenure contracts, and compliant public sector employee record keeping.',
      iconSvg: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" /></svg>'
    },
    {
      title: 'Specialized Fusion HCM Delivery Model',
      badge: 'ISO-Aligned Delivery Excellence',
      description: 'End-to-end implementation lifecycle: Fast Formulas, HDL automated migrations, OIC integration bridges, and quarterly release automated regression assurance.',
      iconSvg: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" /></svg>'
    }
  ];
}
