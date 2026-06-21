import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <article class="card">
      <div class="card-image" *ngIf="imageUrl" [style.backgroundImage]="'url(' + imageUrl + ')'"></div>
      <div class="card-content">
        <span class="date" *ngIf="date">{{ date }}</span>
        <h3>{{ title }}</h3>
        <p>{{ excerpt }}</p>
        <a href="#" class="read-more">Read More &rarr;</a>
      </div>
    </article>
  `,
  styles: [`
    .card {
      background: #fff;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 4px 6px rgba(0,0,0,0.05);
      transition: transform var(--transition-speed) ease, box-shadow var(--transition-speed) ease;
      display: flex;
      flex-direction: column;
      height: 100%;

      &:hover {
        transform: translateY(-8px);
        box-shadow: 0 12px 24px rgba(0,0,0,0.1);
      }
    }

    .card-image {
      height: 200px;
      background-size: cover;
      background-position: center;
      background-color: var(--color-bg-light); // Fallback
    }

    .card-content {
      padding: 24px;
      display: flex;
      flex-direction: column;
      flex-grow: 1;

      .date {
        font-size: 0.875rem;
        color: var(--text-muted);
        margin-bottom: 8px;
        display: block;
      }

      h3 {
        font-size: 1.25rem;
        margin-bottom: 12px;
      }

      p {
        color: var(--text-muted);
        margin-bottom: 24px;
        flex-grow: 1;
      }

      .read-more {
        color: var(--color-primary);
        font-weight: 600;
        margin-top: auto;
        &:hover {
          color: var(--color-accent);
        }
      }
    }
  `]
})
export class CardComponent {
  @Input() title!: string;
  @Input() excerpt!: string;
  @Input() imageUrl?: string;
  @Input() date?: string;
}