import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface DetailedService {
  id: string;
  title: string;
  icon: string;
  leadDescription: string;
  paragraph: string;
  features: string[];
  imageUrl: string;
}

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <header class="services-header">
      <div class="container">
        <h1>Our Oracle Cloud Services</h1>
        <p>Comprehensive enterprise solutions tailored for your business.</p>
      </div>
    </header>

    <div class="services-content">
      <section 
        class="service-row" 
        *ngFor="let service of detailedServices; let isEven = even"
        [class.reversed]="isEven"
        [id]="service.id">
        
        <div class="container row-inner">
          
          <div class="text-block">
            <div class="icon-box">{{ service.icon }}</div>
            <h2>{{ service.title }}</h2>
            <p class="lead-text">{{ service.leadDescription }}</p>
            <p class="detailed-paragraph">{{ service.paragraph }}</p>
            
            <div class="feature-list-wrapper">
              <h3>Key Capabilities:</h3>
              <ul class="feature-list">
                <li *ngFor="let feature of service.features">
                  <span class="check-mark">✓</span> {{ feature }}
                </li>
              </ul>
            </div>
            
            <a routerLink="/contact" class="btn-primary mt-4">Consult with our Experts</a>
          </div>

          <div class="image-block">
            <div class="image-wrapper">
              <img [src]="service.imageUrl" [alt]="service.title" loading="lazy">
            </div>
          </div>

        </div>
      </section>
    </div>
  `,
  styles: [`
    /* --- Base Page Styling (Light Theme Body) --- */
    :host {
      display: block;
      background-color: var(--color-white, #FFFFFF); 
      color: var(--color-text-main, #1D1D1F); 
      font-family: 'Inter', sans-serif;
      min-height: 100vh;
    }

    .container {
      max-width: 1280px;
      margin: 0 auto;
      padding: 0 24px;
    }

    /* --- Header Section (Matched Rich Blue Banner) --- */
    .services-header {
      /* Padding explicitly tuned to match the About & Insights pages */
      padding: 120px 0 60px; 
      text-align: center;
      /* Exact rich blue gradient used in the other banners */
      background: linear-gradient(to right, #001c3d, #003366); 
    }

    .services-header h1 {
      font-size: clamp(2.5rem, 5vw, 4rem);
      margin-bottom: 15px;
      color: #ffffff; /* White text */
      letter-spacing: -0.02em;
      font-weight: 700;
    }

    .services-header p {
      font-size: 1.15rem;
      /* Bright blue accent text matching the Insights page */
      color: #3b82f6; 
      max-width: 800px;
      margin: 0 auto;
      line-height: 1.6;
      font-weight: 500;
    }

    /* --- Alternating Row Layout (Z-Pattern) --- */
    .service-row {
      padding: 100px 0;
      border-bottom: 1px solid rgba(0, 0, 0, 0.05);
    }

    .row-inner {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 60px;
    }

    /* Desktop: Side-by-side layout */
    @media (min-width: 1024px) {
      .row-inner {
        flex-direction: row;
        justify-content: space-between;
      }
      
      .text-block, .image-block {
        flex: 1;
        width: 50%;
      }

      /* Reverse the order for even rows to create the Z-pattern */
      .service-row.reversed .row-inner {
        flex-direction: row-reverse;
      }

      .text-block { padding-right: 60px; }
      .service-row.reversed .text-block { padding-right: 0; padding-left: 60px; }
    }

    /* --- Text Content Styling --- */
    .icon-box {
      font-size: 3rem;
      margin-bottom: 20px;
      background: rgba(0, 102, 204, 0.05); 
      width: 80px;
      height: 80px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 20px;
      border: 1px solid rgba(0, 102, 204, 0.1);
    }

    .text-block h2 {
      font-size: 2.2rem;
      margin-bottom: 20px;
      color: var(--color-primary, #1D1D1F);
      letter-spacing: -0.02em;
    }

    .lead-text {
      font-size: 1.2rem;
      color: var(--color-accent, #0066CC);
      font-weight: 500;
      margin-bottom: 20px;
      line-height: 1.5;
    }

    .detailed-paragraph {
      font-size: 1.05rem;
      color: var(--color-text-muted, #555555);
      line-height: 1.8;
      margin-bottom: 30px;
    }

    /* --- Feature List --- */
    .feature-list-wrapper h3 {
      font-size: 1.1rem;
      color: var(--color-primary, #1D1D1F);
      margin-bottom: 15px;
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    .feature-list {
      list-style: none;
      padding: 0;
      margin: 0 0 30px 0;
      display: grid;
      grid-template-columns: 1fr;
      gap: 12px;
    }

    @media (min-width: 600px) {
      .feature-list { grid-template-columns: 1fr 1fr; }
    }

    .feature-list li {
      color: var(--color-text-main, #1D1D1F);
      font-size: 1rem;
      display: flex;
      align-items: flex-start;
    }

    .check-mark {
      color: var(--color-accent, #0066CC);
      font-weight: bold;
      margin-right: 12px;
    }

    /* --- Image Styling --- */
    .image-wrapper {
      position: relative;
      border-radius: 24px;
      overflow: hidden;
      box-shadow: 0 20px 40px rgba(0,0,0,0.08);
      transform: perspective(1000px) rotateY(-5deg);
      transition: transform 0.5s ease, box-shadow 0.5s ease;
    }

    .service-row.reversed .image-wrapper {
      transform: perspective(1000px) rotateY(5deg);
    }

    .image-wrapper:hover {
      transform: perspective(1000px) rotateY(0deg) translateY(-10px);
      box-shadow: 0 30px 50px rgba(0,0,0,0.12);
    }

    .image-wrapper img {
      width: 100%;
      height: auto;
      display: block;
      object-fit: cover;
      aspect-ratio: 4/3;
    }

    /* --- Button --- */
    .btn-primary {
      display: inline-block;
      padding: 14px 28px;
      background: var(--color-accent, #0066CC);
      color: #ffffff;
      text-decoration: none;
      font-weight: 600;
      border-radius: 8px;
      transition: all 0.3s ease;
    }

    .btn-primary:hover {
      background: var(--color-accent-hover, #0077ED);
      transform: translateY(-2px);
      box-shadow: 0 10px 20px rgba(0, 102, 204, 0.2);
    }
    
    .mt-4 { margin-top: 1.5rem; }
  `]
})
export class ServicesComponent {
  
  detailedServices: DetailedService[] = [
    {
      id: 'hcm', 
      title: 'Oracle Fusion HCM', 
      icon: '👥',
      leadDescription: 'Manage your most important asset — your people. End-to-end human capital management from hire to retire.',
      paragraph: 'Empower your workforce with Oracle Fusion Cloud Human Capital Management (HCM). Our implementation strategy ensures that your HR teams can natively connect every human resource process. This provides a consistent experience across devices, enables one source of truth for HR data to improve decision-making, and empowers you with market-leading innovation to address your needs today and into the future.',
      features: ['Core HR & Payroll', 'Talent Management', 'Workforce Compensation', 'Recruiting Cloud', 'Time & Labor', 'Performance Management'],
      imageUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1200&auto=format&fit=crop'
    },
    {
      id: 'erp', 
      title: 'Oracle Fusion ERP', 
      icon: '📊',
      leadDescription: 'Automate back-office operations, manage financial realities, and drive business model innovation.',
      paragraph: 'Oracle Fusion Cloud Enterprise Resource Planning (ERP) is a complete, modern, cloud ERP suite that provides your teams with advanced capabilities. We help you implement AI to automate manual processes that slow your teams down, deploy analytics to react to market shifts in real time, and utilize automatic updates to stay current and gain a competitive advantage.',
      features: ['Financials Cloud', 'Project Management', 'Risk Management', 'Compliance', 'Procurement', 'Revenue Management'],
      imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1200&auto=format&fit=crop'
    },
    {
      id: 'scm', 
      title: 'Oracle Fusion SCM', 
      icon: '🔗',
      leadDescription: 'Build resilient, agile, and sustainable supply chains tailored for modern global logistics.',
      paragraph: 'Build a resilient and sustainable supply chain. Oracle Fusion Cloud Supply Chain & Manufacturing (SCM) connects your supply network with an integrated suite of cloud business applications designed and built to outpace change. We help you orchestrate your operations, optimize logistics, and ensure your manufacturing processes remain lean, agile, and cost-effective.',
      features: ['Inventory Management', 'Manufacturing', 'Order Management', 'Logistics', 'Product Lifecycle', 'Supply Chain Planning'],
      imageUrl: 'https://images.unsplash.com/photo-1586528116311-ad8ed7450862?q=80&w=1200&auto=format&fit=crop'
    },
    {
      id: 'epm', 
      title: 'Oracle Fusion EPM', 
      icon: '📈',
      leadDescription: 'Connect enterprise planning, accelerate financial close, and make better decisions faster.',
      paragraph: 'Navigate uncertainty with Oracle Fusion Cloud Enterprise Performance Management (EPM). We help finance teams model and plan across finance, HR, supply chain, and sales, streamline the financial close process, and drive better decisions. Gain the agility to adapt to any business scenario and outpace your competition with real-time strategic foresight.',
      features: ['Enterprise Planning', 'Financial Consolidation', 'Profitability & Costing', 'Narrative Reporting', 'Account Reconciliation', 'Tax Reporting'],
      imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop'
    },
    {
      id: 'cx', 
      title: 'Oracle Fusion CX', 
      icon: '🤝',
      leadDescription: 'Transform customer experiences with connected data, intelligent insights, and tailored engagements.',
      paragraph: 'Oracle Fusion Cloud Customer Experience (CX) connects data across advertising, marketing, sales, commerce, and service to provide a seamless customer journey. Our experts help you build comprehensive profiles of your customers, track every interaction, and deliver personalized experiences that drive brand loyalty and accelerate revenue growth.',
      features: ['Sales Cloud', 'Service Cloud', 'Marketing Cloud', 'Commerce Cloud', 'Customer Data Platform', 'Loyalty & Rewards'],
      imageUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=1200&auto=format&fit=crop'
    }
  ];
}