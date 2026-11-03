import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <article class="card">
      <div class="card-image" *ngIf="imageUrl" [style.backgroundImage]="'url(' + imageUrl + ')'"></div>
      <div class="card-content">
        <span class="date" *ngIf="date">{{ date }}</span>
        <h3>{{ title }}</h3>
        <p>{{ excerpt }}</p>
        <a *ngIf="link" [routerLink]="link" class="read-more">Read More &rarr;</a>
        <a *ngIf="!link" routerLink="/insights" class="read-more">Read Insight &rarr;</a>
      </div>
    </article>
  `,
  styles: [`
    .card {
      background: #fff;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 4px 6px rgba(0,0,0,0.05);
      transition: transform var(--transition-speed, 0.4s) ease, box-shadow var(--transition-speed, 0.4s) ease;
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
      background-color: var(--color-primary, #0b0f19);
      background-image: linear-gradient(135deg, #0b0f19 0%, #1e40af 100%);
    }

    .card-content {
      padding: 24px;
      display: flex;
      flex-direction: column;
      flex-grow: 1;

      .date {
        font-size: 0.875rem;
        color: var(--text-muted, #64748b);
        margin-bottom: 8px;
        display: block;
      }

      h3 {
        font-size: 1.25rem;
        margin-bottom: 12px;
        color: var(--color-primary, #0b0f19);
      }

      p {
        color: var(--text-muted, #64748b);
        margin-bottom: 24px;
        flex-grow: 1;
        line-height: 1.6;
      }

      .read-more {
        color: var(--color-accent, #2563eb);
        font-weight: 600;
        text-decoration: none;
        margin-top: auto;
        display: inline-flex;
        align-items: center;
        transition: color 0.2s ease;
        &:hover {
          color: #1d4ed8;
          text-decoration: underline;
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
  @Input() link?: string;
}
