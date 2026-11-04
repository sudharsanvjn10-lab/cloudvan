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
    <app-insights-grid [showHeading]="false"></app-insights-grid>
  `,
  styles: [`

  `]
})
export class InsightsComponent {}