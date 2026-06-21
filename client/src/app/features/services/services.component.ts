import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <section class="services-section">
      <div class="container">
        
        <div class="section-header">
          <h2>Our Oracle Cloud Services</h2>
          <p>Comprehensive enterprise solutions tailored for your business.</p>
        </div>

        <div class="cards-grid">
          
          <div class="service-card">
            <div class="icon-box">👥</div>
            <h3>Oracle Fusion HCM</h3>
            <p>Manage your most important asset — your people. End-to-end human capital management from hire to retire.</p>
            <ul>
              <li><span class="bullet">→</span> Core HR & Payroll</li>
              <li><span class="bullet">→</span> Talent Management</li>
              <li><span class="bullet">→</span> Workforce Compensation</li>
            </ul>
            <div class="spacer"></div>
            <a routerLink="/services/fusion/hcm" class="btn-learn">
              LEARN MORE <span class="arrow">→</span>
            </a>
          </div>

          <div class="service-card">
            <div class="icon-box">📊</div>
            <h3>Oracle Fusion ERP</h3>
            <p>Automate back-office operations, manage financial realities, and drive business model innovation.</p>
            <ul>
              <li><span class="bullet">→</span> Financials Cloud</li>
              <li><span class="bullet">→</span> Project Management</li>
              <li><span class="bullet">→</span> Risk Management</li>
            </ul>
            <div class="spacer"></div>
            <a routerLink="/services/fusion/erp" class="btn-learn">
              LEARN MORE <span class="arrow">→</span>
            </a>
          </div>

          <div class="service-card">
            <div class="icon-box">🔗</div>
            <h3>Oracle Fusion SCM</h3>
            <p>Build a resilient, adaptable supply chain that drives innovation and growth across logistics.</p>
            <ul>
              <li><span class="bullet">→</span> Inventory Management</li>
              <li><span class="bullet">→</span> Manufacturing</li>
              <li><span class="bullet">→</span> Order Management</li>
            </ul>
            <div class="spacer"></div>
            <a routerLink="/services/fusion/scm" class="btn-learn">
              LEARN MORE <span class="arrow">→</span>
            </a>
          </div>

          <div class="service-card">
            <div class="icon-box">📈</div>
            <h3>Oracle Fusion EPM</h3>
            <p>Drive agile planning. Align financial and operational strategies with powerful performance management.</p>
            <ul>
              <li><span class="bullet">→</span> Planning & Budgeting</li>
              <li><span class="bullet">→</span> Financial Consolidation</li>
              <li><span class="bullet">→</span> Data Management</li>
            </ul>
            <div class="spacer"></div>
            <a routerLink="/services/fusion/epm" class="btn-learn">
              LEARN MORE <span class="arrow">→</span>
            </a>
          </div>

          <div class="service-card">
            <div class="icon-box">🤝</div>
            <h3>Oracle Fusion CX</h3>
            <p>Elevate customer experiences. Connect data across marketing, sales, and service to build lasting relationships.</p>
            <ul>
              <li><span class="bullet">→</span> Sales Automation</li>
              <li><span class="bullet">→</span> Service Cloud</li>
              <li><span class="bullet">→</span> Marketing Solutions</li>
            </ul>
            <div class="spacer"></div>
            <a routerLink="/services/fusion/cx" class="btn-learn">
              LEARN MORE <span class="arrow">→</span>
            </a>
          </div>

        </div>
      </div>
    </section>
  `,
  styles: [`
    /* --- Base Section --- */
    .services-section {
      padding: 100px 0;
      background-color: var(--color-primary, #001f3f);
      color: #ffffff;
      font-family: 'Inter', sans-serif;
    }

    .container {
      max-width: 1280px;
      margin: 0 auto;
      padding: 0 24px;
    }

    .section-header {
      text-align: center;
      margin-bottom: 60px;
    }

    .section-header h2 {
      font-size: clamp(2rem, 4vw, 2.75rem);
      margin-bottom: 16px;
      font-weight: 700;
      letter-spacing: -0.5px;
    }

    .section-header p {
      font-size: 1.15rem;
      color: var(--color-accent, #00a8cc);
      max-width: 600px;
      margin: 0 auto;
    }

    /* --- Grid Layout --- */
    .cards-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(340px, 1fr));
      gap: 32px;
    }

    /* --- Premium Card Styling --- */
    .service-card {
      background: rgba(255, 255, 255, 0.02);
      border: 1px solid rgba(255, 255, 255, 0.06);
      border-radius: 16px;
      padding: 40px 32px;
      display: flex;
      flex-direction: column;
      position: relative;
      overflow: hidden;
      z-index: 1;
      transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
    }

    /* Subtle background gradient that activates on hover */
    .service-card::before {
      content: '';
      position: absolute;
      top: 0; left: 0; right: 0; bottom: 0;
      background: linear-gradient(135deg, rgba(0, 168, 204, 0.1) 0%, transparent 100%);
      opacity: 0;
      z-index: -1;
      transition: opacity 0.4s ease;
    }

    /* --- Ultimate Hover Effects --- */
    .service-card:hover {
      transform: translateY(-8px);
      border-color: rgba(0, 168, 204, 0.5); /* Brand colored border */
      background: rgba(255, 255, 255, 0.04);
      /* Glowing cyan shadow */
      box-shadow: 0 20px 40px rgba(0, 168, 204, 0.15), 
                  0 1px 3px rgba(0, 0, 0, 0.2); 
    }

    .service-card:hover::before {
      opacity: 1;
    }

    /* --- Interactive Icon Box --- */
    .icon-box {
      width: 64px;
      height: 64px;
      border-radius: 14px;
      background: rgba(0, 168, 204, 0.1);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 2rem;
      margin-bottom: 24px;
      border: 1px solid rgba(0, 168, 204, 0.2);
      transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    }

    .service-card:hover .icon-box {
      background: var(--color-accent, #00a8cc);
      color: #fff;
      transform: scale(1.1) rotate(5deg);
      box-shadow: 0 10px 20px rgba(0, 168, 204, 0.3);
    }

    /* --- Typography & Content --- */
    .service-card h3 {
      font-size: 1.5rem;
      margin-bottom: 16px;
      font-weight: 600;
      color: #ffffff;
    }

    .service-card p {
      color: #94a3b8;
      line-height: 1.6;
      margin-bottom: 24px;
      font-size: 0.95rem;
    }

    .service-card ul {
      list-style: none;
      padding: 0;
      margin: 0;
    }

    .service-card li {
      margin-bottom: 12px;
      color: #cbd5e1;
      font-size: 0.9rem;
      font-weight: 500;
      display: flex;
      align-items: center;
      transition: transform 0.3s ease, color 0.3s ease;
    }

    .bullet {
      color: var(--color-accent, #00a8cc);
      margin-right: 10px;
      font-weight: bold;
      transition: transform 0.3s;
    }

    .service-card:hover li {
      color: #ffffff;
      transform: translateX(4px);
    }

    /* --- Spacer pushes button to bottom --- */
    .spacer {
      flex-grow: 1;
      min-height: 40px;
    }

    /* --- Button Styling --- */
    .btn-learn {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 14px 24px;
      background: transparent;
      border: 1px solid rgba(0, 168, 204, 0.5);
      color: var(--color-accent, #00a8cc);
      text-decoration: none;
      border-radius: 8px;
      font-weight: 600;
      font-size: 0.85rem;
      letter-spacing: 0.5px;
      transition: all 0.3s ease;
      width: 100%;
    }

    .arrow {
      margin-left: 8px;
      transition: transform 0.3s ease;
    }

    .service-card:hover .btn-learn {
      background: var(--color-accent, #00a8cc);
      border-color: var(--color-accent, #00a8cc);
      color: #ffffff;
    }

    .service-card:hover .arrow {
      transform: translateX(4px);
    }
  `]
})
export class ServicesComponent {}