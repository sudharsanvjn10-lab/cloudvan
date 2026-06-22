import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-careers',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="inner-hero">
      <div class="container">
        <h1>Join Our Team</h1>
        <p>Build the future of enterprise cloud solutions with us.</p>
      </div>
    </div>
    
    <section class="container careers-content">
      <div class="intro">
        <h2>Why Cloud Vantage?</h2>
        <p>We are always looking for passionate Oracle functional consultants, technical architects, and developers to join our global delivery teams in Dubai, Chennai, and Madurai.</p>
      </div>
      
      <div class="jobs-list">
        <div class="job-card">
          <div class="job-info">
            <h3>Senior Oracle HCM Consultant</h3>
            <span>📍 Chennai, India | 💼 Full-Time</span>
          </div>
          <button class="btn-apply">Apply Now</button>
        </div>
        <div class="job-card">
          <div class="job-info">
            <h3>Junior Oracle HCM Consultant</h3>
            <span>📍 Chennai, India | 💼 Full-Time</span>
          </div>
          <button class="btn-apply">Apply Now</button>
        </div>
        <div class="job-card">
          <div class="job-info">
            <h3>Oracle Technical Developer (OIC/VBCS)</h3>
            <span>📍 Madurai, India | 💼 Full-Time</span>
          </div>
          <button class="btn-apply">Apply Now</button>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .inner-hero {
      background: linear-gradient(to right, var(--color-primary), #0c3866);
      padding: 120px 0 60px; color: #fff; text-align: center;
      h1 { font-size: clamp(2.5rem, 4vw, 3.5rem); margin-bottom: 1rem; color: #fff;}
      p { font-size: 1.25rem; color: var(--color-accent); }
    }
    .careers-content { padding: 5rem 0; max-width: 800px; margin: 0 auto; }
    .intro { text-align: center; margin-bottom: 3rem; h2 { color: var(--color-primary); margin-bottom: 1rem;} p { color: var(--text-muted); font-size: 1.1rem; line-height: 1.6;} }
    .job-card {
      display: flex; justify-content: space-between; align-items: center; background: #fff; padding: 1.5rem 2rem; margin-bottom: 1rem; border-radius: 8px; border: 1px solid #e2e8f0;
      @media (max-width: 600px) { flex-direction: column; align-items: flex-start; gap: 1rem; }
      h3 { color: var(--color-primary); margin-bottom: 0.5rem; }
      span { color: #718096; font-size: 0.9rem; }
      .btn-apply { background: var(--color-primary); color: #fff; padding: 10px 20px; border: none; border-radius: 4px; cursor: pointer; font-weight: bold; transition: 0.3s; &:hover { background: var(--color-accent); color: var(--color-primary); } }
    }
  `]
})
export class CareersComponent {}