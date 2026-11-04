import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CountUpDirective } from '../../../../shared/directives/count-up.directive';
import { ContentService } from '../../../../core/services/content.service';

@Component({
  selector: 'app-stats-counter',
  standalone: true,
  imports: [CommonModule, CountUpDirective],
  template: `
    <section class="stats-section">
      <div class="container">
        <div class="stats-grid">
          
          <div class="stat-item" *ngFor="let stat of stats">
            <h2 class="stat-number" [appCountUp]="stat.number" [suffix]="stat.suffix">{{ stat.number }}{{ stat.suffix }}</h2>
            <p class="stat-label">{{ stat.label }}</p>
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
      overflow: hidden;
    }

    /* Live shimmer line across the top of the stat band */
    .stats-section::before {
      content: '';
      position: absolute;
      top: 0; left: 0; right: 0;
      height: 2px;
      background: linear-gradient(90deg, transparent, var(--color-accent), var(--color-cyan), transparent);
      background-size: 200% 100%;
      animation: sheen 6s linear infinite;
    }

    @keyframes sheen {
      to { background-position: 200% 0; }
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
      color: var(--color-ink, #0f172a);
      font-family: var(--font-heading, 'Outfit', sans-serif);
      margin-bottom: 8px;
      line-height: 1;
      letter-spacing: -0.04em;
      font-variant-numeric: tabular-nums;
    }

    .stat-label {
      font-size: 0.9rem;
      font-weight: 600;
      color: var(--text-muted, #64748b);
      text-transform: uppercase;
      letter-spacing: 0.1em;
      margin: 0;
    }

    /* 2x2 on phones: four stacked stats used to fill a whole screen of scroll */
    @media (max-width: 768px) {
      .stats-section {
        padding: 56px 0;
      }
      .stats-grid {
        grid-template-columns: repeat(2, 1fr);
        gap: 36px 16px;
      }
      .stat-number {
        font-size: clamp(2.5rem, 12vw, 3.25rem);
      }
      .stat-label {
        font-size: 0.76rem;
        letter-spacing: 0.08em;
        line-height: 1.35;
      }
    }
  `]
})
export class StatsCounterComponent {
  private contentService = inject(ContentService);

  get stats() {
    return this.contentService.stats();
  }
}
