import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InsightsGridComponent } from '../home/components/insights-grid/insights-grid.component';

@Component({
  selector: 'app-insights',
  standalone: true,
  imports: [CommonModule, InsightsGridComponent],
  template: `
    <div class="inner-hero">
      <div class="container">
        <h1>Latest Insights</h1>
        <p>Industry trends, Oracle updates, and technical deep-dives.</p>
      </div>
    </div>
    <div style="padding: 4rem 0; background: var(--color-gray-50);">
      <app-insights-grid></app-insights-grid>
    </div>
  `,
  styles: [`
    .inner-hero {
      background: linear-gradient(to right, var(--color-primary), #0c3866);
      padding: 120px 0 60px; color: #fff; text-align: center;
      h1 { font-size: clamp(2.5rem, 4vw, 3.5rem); margin-bottom: 1rem; color: #fff;}
      p { font-size: 1.25rem; color: var(--color-accent); }
    }
  `]
})
export class InsightsComponent {}