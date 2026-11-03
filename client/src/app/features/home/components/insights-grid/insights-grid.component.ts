import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { catchError, of } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { CardComponent } from '../../../../shared/components/card/card.component';
import { SectionHeadingComponent } from '../../../../shared/components/section-heading/section-heading.component';
import { FadeUpDirective } from '../../../../shared/directives/fade-up.directive';

export interface Insight {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  imageUrl: string;
}

@Component({
  selector: 'app-insights-grid',
  standalone: true,
  imports: [CommonModule, CardComponent, SectionHeadingComponent, FadeUpDirective],
  template: `
    <section class="insights-section">
      <div class="container">
        <app-section-heading 
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
export class InsightsGridComponent implements OnInit {
  private http = inject(HttpClient);
  insights = signal<Insight[]>([]);

  // Unique verified enterprise visuals with zero overlap across the application
  private fallbackData: Insight[] = [
    {
      id: '1',
      title: 'Maximizing ROI with Oracle Fusion HCM',
      excerpt: 'Discover proven strategies to optimize your human capital management deployment for long-term scalability and user adoption.',
      date: 'October 12, 2026',
      imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800&auto=format&fit=crop'
    },
    {
      id: '2',
      title: 'Migrating Legacy HRMS to Oracle Fusion HCM',
      excerpt: 'A comprehensive roadmap for enterprises transitioning from on-premise PeopleSoft / EBS HRMS systems to modern Oracle Cloud HCM.',
      date: 'September 28, 2026',
      imageUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800&auto=format&fit=crop'
    },
    {
      id: '3',
      title: 'Modernizing Employee Journeys with Redwood UI',
      excerpt: 'How Oracle Redwood UI and Visual Builder Studio enable streamlined employee self-service and personalized workforce experiences.',
      date: 'September 15, 2026',
      imageUrl: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=800&auto=format&fit=crop'
    }
  ];

  ngOnInit() {
    this.http.get<Insight[]>(`${environment.apiUrl}/insights`)
      .pipe(catchError(() => of(this.fallbackData)))
      .subscribe(data => this.insights.set(data));
  }
}
