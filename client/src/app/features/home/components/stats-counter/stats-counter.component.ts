import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-stats-counter',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="stats-section">
      <div class="container">
        <div class="stats-grid">
          
          <div class="stat-item">
            <h2 class="stat-number">20+</h2>
            <p class="stat-label">Years in Operation</p>
          </div>

          <div class="stat-item">
            <h2 class="stat-number">30+</h2>
            <p class="stat-label">Successful Implementations</p>
          </div>

          <div class="stat-item">
            <h2 class="stat-number">10+</h2>
            <p class="stat-label">Countries Served</p>
          </div>

          <div class="stat-item">
            <h2 class="stat-number">5+</h2>
            <p class="stat-label">Cloud Offerings</p>
          </div>

        </div>
      </div>
    </section>
  `,
  styles: [`
    .stats-section {
      padding: 100px 0;
      /* Uses the pure white surface color from your new Apple theme */
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
      /* Creates a flexible 4-column layout that gracefully stacks on mobile */
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 40px 20px;
      text-align: center;
    }

    .stat-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      /* Subtle hover lift effect to match the rest of the site */
      transition: transform var(--transition-fluid, 0.4s ease);
    }

    .stat-item:hover {
      transform: translateY(-4px);
    }

    .stat-number {
      /* Massive, crisp numbers using clamp for perfect scaling on all devices */
      font-size: clamp(3.5rem, 6vw, 5rem);
      font-weight: 700;
      color: var(--color-primary, #1D1D1F);
      margin-bottom: 8px;
      line-height: 1;
      letter-spacing: -0.04em; /* Tighter tracking for large numbers looks premium */
    }

    .stat-label {
      font-size: 0.9rem;
      font-weight: 600;
      color: var(--color-text-muted, #86868B);
      text-transform: uppercase;
      letter-spacing: 0.1em; /* Wide spacing for small uppercase text */
      margin: 0;
    }

    /* Responsive adjustments for mobile */
    @media (max-width: 768px) {
      .stats-section {
        padding: 60px 0;
      }
      .stats-grid {
        gap: 50px;
      }
      .stat-number {
        margin-bottom: 4px;
      }
    }
  `]
})
export class StatsCounterComponent {}