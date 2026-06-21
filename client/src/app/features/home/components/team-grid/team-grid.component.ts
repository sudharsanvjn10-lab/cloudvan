import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { catchError, finalize, of } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { SectionHeadingComponent } from '../../../../shared/components/section-heading/section-heading.component';
import { FadeUpDirective } from '../../../../shared/directives/fade-up.directive';

export interface TeamMember {
  id: string; name: string; title: string; bio: string; photoUrl: string;
}

@Component({
  selector: 'app-team-grid',
  standalone: true,
  imports: [CommonModule, SectionHeadingComponent, FadeUpDirective],
  template: `
    <section class="team-section">
      <div class="container">
        <app-section-heading 
          title="Our Leadership" 
          subtitle="The architects behind our global enterprise delivery model."
          align="center" appFadeUp>
        </app-section-heading>

        <div class="team-grid">
          <ng-container *ngIf="isLoading()">
            <div class="team-card skeleton" *ngFor="let i of [1,2,3,4]">
              <div class="photo-wrapper pulse"></div>
              <div class="info">
                <div class="skel-text pulse title"></div>
                <div class="skel-text pulse subtitle"></div>
              </div>
            </div>
          </ng-container>

          <ng-container *ngIf="!isLoading()">
            <div class="team-card" *ngFor="let member of team()" appFadeUp>
              <div class="photo-wrapper">
                <img [src]="member.photoUrl" [alt]="member.name" class="photo" loading="lazy">
                <div class="bio-overlay"><p>{{ member.bio }}</p></div>
              </div>
              <div class="info">
                <h3>{{ member.name }}</h3>
                <p class="title">{{ member.title }}</p>
              </div>
            </div>
          </ng-container>
        </div>
      </div>
    </section>
  `,
  styles: [`
    /* Existing styles omitted for brevity, ensure you keep the CSS from Phase 5 here */
    .team-section { padding: 6rem 0; background-color: var(--color-gray-50); }
    .team-grid { display: grid; grid-template-columns: 1fr; gap: 3rem; max-width: 1000px; margin: 0 auto; @media (min-width: 768px) { grid-template-columns: repeat(2, 1fr); } @media (min-width: 1024px) { grid-template-columns: repeat(4, 1fr); gap: 2rem; } }
    .team-card { text-align: center; }
    .photo-wrapper { position: relative; width: 200px; height: 200px; margin: 0 auto 1.5rem; border-radius: 50%; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.1); @media (min-width: 1024px) { width: 180px; height: 180px; } }
    .photo { width: 100%; height: 100%; object-fit: cover; transition: transform 0.5s ease; }
    .bio-overlay { position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: rgba(10, 37, 64, 0.9); color: #fff; display: flex; flex-direction: column; justify-content: center; align-items: center; padding: 1.5rem; opacity: 0; transition: opacity 0.3s ease; p { font-size: 0.85rem; line-height: 1.4; margin-bottom: 1rem; } }
    .photo-wrapper:hover { .photo { transform: scale(1.1); } .bio-overlay { opacity: 1; } }
    .info { h3 { font-size: 1.2rem; margin-bottom: 0.25rem; color: var(--color-primary); } .title { color: var(--color-accent); font-weight: 600; font-size: 0.9rem; text-transform: uppercase; letter-spacing: 0.5px;} }

    /* SKELETON STYLES */
    .pulse { animation: pulseAnim 1.5s infinite ease-in-out; background-color: #e2e8f0; }
    .skel-text { height: 20px; border-radius: 4px; margin: 0 auto 10px; }
    .skel-text.title { width: 60%; margin-top: 1rem; }
    .skel-text.subtitle { width: 40%; height: 14px; background-color: #cbd5e0;}
    @keyframes pulseAnim { 0% { opacity: 0.6; } 50% { opacity: 1; } 100% { opacity: 0.6; } }
  `]
})
export class TeamGridComponent implements OnInit {
  private http = inject(HttpClient);
  team = signal<TeamMember[]>([]);
  isLoading = signal<boolean>(true);

  private fallbackData: TeamMember[] = [
    { id: '1', name: 'Jeevanantham R.', title: 'Founder & Director', bio: '20+ years expertise as an Oracle HCM Cloud Solution Architect driving global transformation.', photoUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=400&auto=format&fit=crop' },
    { id: '2', name: 'Mahendran P.', title: 'Delivery Head', bio: 'Spearheading offshore delivery centers to ensure precision and scale for enterprise clients.', photoUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=400&auto=format&fit=crop' }
  ];

  ngOnInit() {
    this.http.get<TeamMember[]>(`${environment.apiUrl}/team`)
      .pipe(
        catchError(() => of(this.fallbackData)),
        finalize(() => this.isLoading.set(false))
      )
      .subscribe(data => this.team.set(data));
  }
}