import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SectionHeadingComponent } from '../../shared/components/section-heading/section-heading.component';
import { TeamGridComponent } from '../home/components/team-grid/team-grid.component';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, SectionHeadingComponent, TeamGridComponent],
  template: `
    <div class="inner-hero">
      <div class="container">
        <h1>About Cloud Vantage</h1>
        <p>Architecting enterprise futures across Dubai, Chennai, and Madurai.</p>
      </div>
    </div>

    <section class="about-content">
      <div class="container layout">
        <div class="text-block">
          <h2>Our Story</h2>
          <p>Cloud Vantage Solutions was founded with a singular vision: to bridge the gap between high-level Oracle Cloud strategy and flawless, on-the-ground technical execution. With over two decades of deep industry experience, our founder, Jeevanantham R., established a consulting model that prioritizes architectural integrity above all else.</p>
          <p>Today, we operate a global delivery model. Our strategic headquarters in Dubai interfaces directly with global enterprises across Real Estate, Healthcare, and Logistics, while our state-of-the-art offshore delivery centers in Chennai and Madurai ensure round-the-clock development, integration, and managed services.</p>
        </div>
        
        <div class="mission-block">
          <div class="mission-card">
            <h3>Our Mission</h3>
            <p>"We help manage the most important asset of any company — its people."</p>
            <p class="sub">By deploying tailored Oracle Fusion HCM, ERP, and SCM solutions, we empower workforces and streamline complex operational realities.</p>
          </div>
        </div>
      </div>
    </section>

    <div style="background-color: var(--color-white); padding-top: 2rem;">
      <app-team-grid></app-team-grid>
    </div>
  `,
  styles: [`
    .inner-hero {
      background: linear-gradient(to right, var(--color-primary), #0c3866);
      padding: 120px 0 60px; /* Top padding clears the fixed header */
      color: var(--color-white);
      text-align: center;
      
      h1 { font-size: clamp(2.5rem, 4vw, 3.5rem); margin-bottom: 1rem; color: #fff; }
      p { font-size: 1.25rem; color: var(--color-accent); }
    }

    .about-content {
      padding: 6rem 0;
      background-color: var(--color-gray-50);
    }

    .layout {
      display: grid;
      grid-template-columns: 1fr;
      gap: 4rem;
      
      @media (min-width: 1024px) {
        grid-template-columns: 1.5fr 1fr;
        align-items: center;
      }
    }

    .text-block {
      h2 { font-size: 2.5rem; margin-bottom: 1.5rem; color: var(--color-primary); }
      p { color: var(--text-muted); font-size: 1.1rem; line-height: 1.8; margin-bottom: 1.5rem; }
    }

    .mission-card {
      background: var(--color-primary);
      color: #fff;
      padding: 3rem;
      border-radius: 8px;
      box-shadow: 0 20px 40px rgba(0,0,0,0.1);
      position: relative;
      overflow: hidden;
      
      &::before {
        content: '"';
        position: absolute;
        top: -20px;
        left: 20px;
        font-size: 8rem;
        color: rgba(255,255,255,0.05);
        font-family: serif;
      }

      h3 { color: var(--color-accent); font-size: 1.5rem; margin-bottom: 1.5rem; text-transform: uppercase; letter-spacing: 1px;}
      p { font-size: 1.5rem; font-weight: 600; line-height: 1.4; margin-bottom: 1.5rem; font-style: italic; }
      .sub { font-size: 1rem; font-weight: 400; color: #a0aec0; font-style: normal; }
    }
  `]
})
export class AboutComponent {}