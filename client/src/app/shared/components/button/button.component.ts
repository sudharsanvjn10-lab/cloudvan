import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button [type]="type" [ngClass]="['btn', variant]">
      <span class="btn-content">{{ label }}</span>
    </button>
  `,
  styles: [`
    .btn {
      position: relative;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: 12px 26px;
      font-family: var(--font-sans);
      font-weight: 600;
      font-size: 1rem;
      border: 2px solid transparent;
      border-radius: 6px;
      cursor: pointer;
      overflow: hidden;
      transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.25s ease, background-color 0.25s ease, border-color 0.25s ease;
      will-change: transform;

      /* Diagonal sheen element */
      &::after {
        content: '';
        position: absolute;
        top: -50%;
        left: -60%;
        width: 30%;
        height: 200%;
        background: linear-gradient(
          to right,
          rgba(255, 255, 255, 0) 0%,
          rgba(255, 255, 255, 0.3) 50%,
          rgba(255, 255, 255, 0) 100%
        );
        transform: rotate(30deg);
        transition: transform 0.6s ease;
        pointer-events: none;
      }

      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 18px rgba(37, 99, 235, 0.25);

        &::after {
          transform: translateX(350%) rotate(30deg);
        }
      }

      &:active {
        transform: translateY(0);
        box-shadow: 0 2px 6px rgba(37, 99, 235, 0.2);
      }
    }

    .btn-content {
      position: relative;
      z-index: 1;
    }
    
    .primary {
      background-color: var(--color-accent, #2563eb);
      color: #ffffff;
      border-color: var(--color-accent, #2563eb);
      &:hover {
        background-color: var(--color-accent-hover, #3b82f6);
        border-color: var(--color-accent-hover, #3b82f6);
      }
    }

    .outline {
      background-color: transparent;
      border-color: var(--color-accent, #2563eb);
      color: var(--color-accent, #2563eb);
      &:hover {
        background-color: var(--color-accent, #2563eb);
        color: #ffffff;
      }
    }
  `]
})
export class ButtonComponent {
  @Input() label: string = 'Click Here';
  @Input() variant: 'primary' | 'outline' = 'primary';
  @Input() type: 'button' | 'submit' = 'button';
}
