import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button [type]="type" [ngClass]="['btn', variant]">
      {{ label }}
    </button>
  `,
  styles: [`
    .btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: 12px 24px;
      font-family: 'Inter', sans-serif;
      font-weight: 600;
      font-size: 1rem;
      border: 2px solid transparent;
      border-radius: 4px;
      cursor: pointer;
      transition: all var(--transition-speed) ease;
    }
    
    .primary {
      background-color: var(--color-accent);
      color: var(--color-primary);
      &:hover {
        background-color: transparent;
        border-color: var(--color-accent);
        color: var(--color-accent);
      }
    }

    .outline {
      background-color: transparent;
      border-color: var(--color-accent);
      color: var(--color-accent);
      &:hover {
        background-color: var(--color-accent);
        color: var(--color-primary);
      }
    }
  `]
})
export class ButtonComponent {
  @Input() label: string = 'Click Here';
  @Input() variant: 'primary' | 'outline' = 'primary';
  @Input() type: 'button' | 'submit' = 'button';
}