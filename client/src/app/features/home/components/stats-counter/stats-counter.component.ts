import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CountUpDirective } from '../../../../shared/directives/count-up.directive';

@Component({
  selector: 'app-stats-counter',
  standalone: true,
  imports: [CommonModule, CountUpDirective],
  template: `
    <section class="stats-section">
      <div class="container">
        <div class="stats-grid">
          
          <div class="stat-item">
            <h2 class="stat-number" [appCountUp]="20" [suffix]="'+'">20+</h2>
            <p class="stat-label">Years in Operation</p>
          </div>

          <div class="stat-item">
            <h2 class="stat-number" [appCountUp]="30" [suffix]="'+'">30+</h2>
            <p class="stat-label">Successful Implementations</p>
          </div>

          <div class="stat-item">
            <h2 class="stat-number" [appCountUp]="10" [suffix]="'+'">10+</h2>
            <p class="stat-label">Countries Served</p>
          </div>

          <div class="stat-item">
            <h2 class="stat-number" [appCountUp]="5" [suffix]="'+'">5+</h2>
            <p class="stat-label">Cloud Offerings</p>
          </div>

        </div>
      </div>
    </section>
  `,
  styles: [`
    .stats-section {
      padding: 100px 0;
      background-color: var(--color-bg-surface, #FFFFFF); 
      position: relative;
      z-index: 2;
    }

    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 24px;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 40px 20px;
      text-align: center;
    }

    .stat-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      transition: transform var(--transition-fluid, 0.4s ease);
    }

    .stat-item:hover {
      transform: translateY(-4px);
    }

    .stat-number {
      font-size: clamp(3.5rem, 6vw, 5rem);
      font-weight: 700;
      color: var(--color-primary, #1D1D1F);
      margin-bottom: 8px;
      line-height: 1;
      letter-spacing: -0.04em;
      font-variant-numeric: tabular-nums;
    }

    .stat-label {
      font-size: 0.9rem;
      font-weight: 600;
      color: var(--color-text-muted, #86868B);
      text-transform: uppercase;
      letter-spacing: 0.1em;
      margin: 0;
    }

    @media (max-width: 768px) {
      .stats-section {
        padding: 60px 0;
      }
      .stats-grid {
        gap: 50px;
      }
    }
  `]
})
export class StatsCounterComponent {}
