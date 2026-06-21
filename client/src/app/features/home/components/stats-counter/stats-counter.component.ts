import { Component, ElementRef, OnInit, ViewChild, signal, inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';

interface Stat {
  label: string;
  target: number;
  suffix: string;
  current: number;
}

@Component({
  selector: 'app-stats-counter',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="stats-section" #statsContainer>
      <div class="container stats-grid">
        <div class="stat-card" *ngFor="let stat of stats()">
          <span class="number">{{ stat.current }}{{ stat.suffix }}</span>
          <span class="label">{{ stat.label }}</span>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .stats-section {
      background-color: var(--color-bg-light);
      padding: 4rem 0;
      border-bottom: 1px solid #e2e8f0;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 2rem;
      text-align: center;

      @media (min-width: 768px) {
        grid-template-columns: repeat(4, 1fr);
      }
    }

    .stat-card {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .number {
      font-size: clamp(2.5rem, 4vw, 3.5rem);
      font-weight: 700;
      color: var(--color-primary);
      line-height: 1;
    }

    .label {
      font-size: 1rem;
      color: var(--text-muted);
      text-transform: uppercase;
      letter-spacing: 1px;
      font-weight: 600;
    }
  `]
})
export class StatsCounterComponent implements OnInit {
  @ViewChild('statsContainer', { static: true }) statsContainer!: ElementRef;
  private platformId = inject(PLATFORM_ID);
  
  // PLACEHOLDER NUMBERS: Replace targets with verified Cloud Vantage metrics.
  // Using 20+ years based on Founder's experience profile.
  stats = signal<Stat[]>([
    { label: 'Years in Operation', target: 20, suffix: '+', current: 0 },
    { label: 'Successful Implementations', target: 150, suffix: '+', current: 0 },
    { label: 'Countries Served', target: 15, suffix: '', current: 0 },
    { label: 'Certified Consultants', target: 50, suffix: '+', current: 0 }
  ]);

  private hasAnimated = false;

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.setupObserver();
    }
  }

  private setupObserver() {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !this.hasAnimated) {
        this.animateStats();
        this.hasAnimated = true;
        observer.disconnect(); // Only animate once
      }
    }, { threshold: 0.5 }); // Trigger when 50% visible

    observer.observe(this.statsContainer.nativeElement);
  }

  private animateStats() {
    const duration = 2000; // 2 seconds
    const fps = 60;
    const steps = duration / (1000 / fps);

    let currentStep = 0;

    const interval = setInterval(() => {
      currentStep++;
      
      this.stats.update(currentStats => {
        return currentStats.map(stat => ({
          ...stat,
          // Calculate ease-out step
          current: Math.min(
            Math.round((stat.target / steps) * currentStep), 
            stat.target
          )
        }));
      });

      if (currentStep >= steps) {
        clearInterval(interval);
      }
    }, 1000 / fps);
  }
}