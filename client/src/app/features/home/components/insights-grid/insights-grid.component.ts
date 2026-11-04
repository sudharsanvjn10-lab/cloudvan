import { Component, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardComponent } from '../../../../shared/components/card/card.component';
import { SectionHeadingComponent } from '../../../../shared/components/section-heading/section-heading.component';
import { FadeUpDirective } from '../../../../shared/directives/fade-up.directive';
import { ContentService, Insight } from '../../../../core/services/content.service';

export type { Insight };

@Component({
  selector: 'app-insights-grid',
  standalone: true,
  imports: [CommonModule, CardComponent, SectionHeadingComponent, FadeUpDirective],
  template: `
    <section class="insights-section">
      <div class="container">
        <app-section-heading 
          *ngIf="showHeading"
          title="Latest Insights" 
          subtitle="Expert perspectives on Oracle Cloud, digital transformation, and enterprise strategy."
          align="center">
        </app-section-heading>

        <div class="grid-layout">
          <div *ngFor="let insight of insights(); let i = index" class="grid-item" appFadeUp [delay]="i * 120">
            <app-card 
              [title]="insight.title"
              [excerpt]="insight.excerpt"
              [date]="insight.date"
              [imageUrl]="insight.imageUrl">
            </app-card>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .insights-section {
      padding: 6rem 0;
      background-color: var(--color-white);
    }
    .grid-layout {
      display: grid;
      grid-template-columns: 1fr;
      gap: 2rem;
      @media (min-width: 768px) { grid-template-columns: repeat(2, 1fr); }
      @media (min-width: 1024px) { grid-template-columns: repeat(3, 1fr); }
    }
  `]
})
export class InsightsGridComponent {
  private contentService = inject(ContentService);
  insights = this.contentService.insights;

  /* The /insights page already has a hero title, so it hides this heading to avoid a duplicate. */
  @Input() showHeading = true;
}
