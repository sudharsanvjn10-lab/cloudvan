import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { catchError, of } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { CardComponent } from '../../../../shared/components/card/card.component';
import { SectionHeadingComponent } from '../../../../shared/components/section-heading/section-heading.component';

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
  imports: [CommonModule, CardComponent, SectionHeadingComponent],
  template: `
    <section class="insights-section">
      <div class="container">
        <app-section-heading 
          title="Latest Insights" 
          subtitle="Expert perspectives on Oracle Cloud, digital transformation, and enterprise strategy."
          align="center">
        </app-section-heading>

        <div class="grid-layout">
          <div *ngFor="let insight of insights()" class="grid-item">
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

  // Fallback data ensuring the UI renders flawlessly before Phase 6
  private fallbackData: Insight[] = [
    {
      id: '1',
      title: 'Maximizing ROI with Oracle Fusion HCM',
      excerpt: 'Discover strategies to optimize your human capital management deployment for long-term scalability.',
      date: 'October 12, 2026',
      imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=600&auto=format&fit=crop'
    },
    {
      id: '2',
      title: 'Migrating Legacy ERP to the Cloud',
      excerpt: 'A comprehensive roadmap for enterprises transitioning from on-premise systems to Oracle Cloud infrastructure.',
      date: 'September 28, 2026',
      imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=600&auto=format&fit=crop'
    },
    {
      id: '3',
      title: 'Supply Chain Resilience in Modern Logistics',
      excerpt: 'How Oracle Fusion SCM modules are helping global logistics firms navigate complex supply network disruptions.',
      date: 'September 15, 2026',
      imageUrl: 'https://images.unsplash.com/photo-1586528116311-ad8ed7450862?q=80&w=600&auto=format&fit=crop'
    }
  ];

  ngOnInit() {
    this.http.get<Insight[]>(`${environment.apiUrl}/insights`)
      .pipe(catchError(() => of(this.fallbackData)))
      .subscribe(data => this.insights.set(data));
  }
}