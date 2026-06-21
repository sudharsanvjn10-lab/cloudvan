import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="inner-hero">
      <div class="container">
        <h1>Our Oracle Cloud Services</h1>
        <p>Comprehensive enterprise solutions tailored for your business.</p>
      </div>
    </div>

    <section class="services-content container">
      <div class="service-grid">
        <div class="service-card">
          <div class="icon">👥</div>
          <h2>Oracle Fusion HCM</h2>
          <p>Transform your HR operations. We help manage the most important asset of any company — its people, from hire to retire.</p>
        </div>
        <div class="service-card">
          <div class="icon">📊</div>
          <h2>Oracle ERP</h2>
          <p>Streamline enterprise resource planning with scalable financial, project management, and procurement solutions.</p>
        </div>
        <div class="service-card">
          <div class="icon">📦</div>
          <h2>Oracle SCM</h2>
          <p>Build resilient supply chains. Optimize inventory, logistics, and order management for peak efficiency.</p>
        </div>
        <div class="service-card">
          <div class="icon">📈</div>
          <h2>Oracle EPM</h2>
          <p>Drive agile planning. Align financial and operational strategies with powerful enterprise performance management.</p>
        </div>
        <div class="service-card">
          <div class="icon">🤝</div>
          <h2>Oracle CX</h2>
          <p>Elevate customer experiences. Connect data across marketing, sales, and service to build lasting relationships.</p>
        </div>
        <div class="service-card">
          <div class="icon">⚙️</div>
          <h2>Managed Services</h2>
          <p>Round-the-clock support, continuous integration, and system optimization from our offshore delivery centers.</p>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .inner-hero {
      background: linear-gradient(to right, var(--color-primary), #0c3866);
      padding: 120px 0 60px;
      color: #fff;
      text-align: center;
      h1 { font-size: clamp(2.5rem, 4vw, 3.5rem); margin-bottom: 1rem; color: #fff;}
      p { font-size: 1.25rem; color: var(--color-accent); }
    }
    .services-content { padding: 5rem 0; }
    .service-grid {
      display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem;
    }
    .service-card {
      background: #fff; padding: 2.5rem; border-radius: 8px; box-shadow: 0 4px 15px rgba(0,0,0,0.05); transition: transform 0.3s;
      &:hover { transform: translateY(-5px); box-shadow: 0 10px 25px rgba(0,0,0,0.1); border-bottom: 4px solid var(--color-accent); }
      .icon { font-size: 3rem; margin-bottom: 1rem; }
      h2 { color: var(--color-primary); margin-bottom: 1rem; font-size: 1.5rem; }
      p { color: var(--text-muted); line-height: 1.6; }
    }
  `]
})
export class ServicesComponent {}