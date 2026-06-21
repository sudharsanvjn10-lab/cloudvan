import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-section-heading',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="section-heading" [ngClass]="align">
      <h2>{{ title }}</h2>
      <p *ngIf="subtitle" class="subtitle">{{ subtitle }}</p>
      <div class="underline"></div>
    </div>
  `,
  styles: [`
    .section-heading {
      margin-bottom: 3rem;
      
      &.center {
        text-align: center;
        .underline { margin: 0 auto; }
      }
      
      &.left {
        text-align: left;
      }

      h2 {
        margin-bottom: 0.5rem;
        text-transform: uppercase;
        letter-spacing: 1px;
      }

      .subtitle {
        color: var(--text-muted);
        font-size: 1.125rem;
        margin-bottom: 1rem;
      }

      .underline {
        width: 60px;
        height: 4px;
        background-color: var(--color-accent);
      }
    }
  `]
})
export class SectionHeadingComponent {
  @Input() title!: string;
  @Input() subtitle?: string;
  @Input() align: 'left' | 'center' = 'center';
}