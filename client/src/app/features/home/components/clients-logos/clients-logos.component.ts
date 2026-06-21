import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-clients-logos',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="clients-section">
      <div class="container">
        <div class="clients-header">
          <h2>Empowering Global Industries</h2>
          <p>Delivering tailored Oracle solutions across complex, high-compliance sectors.</p>
        </div>

        <div class="industry-chips">
          <span class="chip" *ngFor="let industry of industries">{{ industry }}</span>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .clients-section {
      padding: 5rem 0;
      background-color: var(--color-primary);
      color: var(--color-white);
      text-align: center;
    }
    .clients-header {
      margin-bottom: 3rem;
      h2 { font-size: 2rem; color: var(--color-white); margin-bottom: 0.5rem; }
      p { color: #a0aec0; font-size: 1.1rem; }
    }
    .industry-chips {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 1rem;
      max-width: 900px;
      margin: 0 auto;
    }
    .chip {
      background: rgba(255,255,255,0.1);
      border: 1px solid rgba(255,255,255,0.2);
      padding: 12px 24px;
      border-radius: 50px;
      font-weight: 600;
      letter-spacing: 0.5px;
      transition: all 0.3s ease;
      cursor: default;

      &:hover {
        background: var(--color-accent);
        color: var(--color-primary);
        border-color: var(--color-accent);
        transform: translateY(-3px);
      }
    }
  `]
})
export class ClientsLogosComponent {
  industries = [
    'Real Estate', 'Investment', 'Pharmacy', 'Oil & Gas', 
    'Automotive', 'Drilling', 'Construction', 'Logistics', 
    'Science', 'Health'
  ];
}