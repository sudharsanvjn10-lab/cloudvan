import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="inner-hero">
      <div class="container">
        <h1>Contact Us</h1>
        <p>Let's discuss how we can transform your business.</p>
      </div>
    </div>

    <section class="container contact-wrapper">
      <div class="contact-grid">
        
        <div class="form-section">
          <h2>Send us a Message</h2>
          <form [formGroup]="contactForm" (ngSubmit)="onSubmit()">
            
            <div class="form-group">
              <label>Name *</label>
              <input type="text" formControlName="name" placeholder="John Doe">
            </div>

            <div class="form-group">
              <label>Company / Organization</label>
              <input type="text" formControlName="company" placeholder="Your Company Name">
            </div>

            <div class="form-group">
              <label>Email *</label>
              <input type="email" formControlName="email" placeholder="john@company.com">
            </div>

            <div class="form-group">
              <label>Phone Number *</label>
              <input type="tel" formControlName="phone" placeholder="+1 234 567 8900">
            </div>

            <div class="form-group">
              <label>Message *</label>
              <textarea formControlName="message" rows="5" placeholder="How can we help you?"></textarea>
            </div>

            <button type="submit" [disabled]="contactForm.invalid" class="submit-btn">Send Message</button>
            <p *ngIf="submitted" class="success-msg">Thank you! Your message has been sent.</p>
          </form>
        </div>

        <div class="info-section">
          <h2>Our Offices</h2>
          
          <div class="office">
            <h3>🇦🇪 Dubai (Headquarters)</h3>
            <p>Business Bay, Dubai<br>United Arab Emirates</p>
          </div>
          
          <div class="office">
            <h3>🇮🇳 Chennai (Delivery Center)</h3>
            <p>OMR IT Expressway, Chennai<br>Tamil Nadu, India</p>
          </div>

          <div class="office">
            <h3>🇮🇳 Madurai (Delivery Center)</h3>
            <p>IT Park, Vadapalanji, Madurai<br>Tamil Nadu, India</p>
          </div>
          
          <div class="direct-contact">
            <p><strong>Email:</strong> info&#64;cloudvantagesolutions.com</p>
          </div>
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
    .contact-wrapper { padding: 5rem 0; }
    .contact-grid { display: grid; grid-template-columns: 1fr; gap: 4rem; @media (min-width: 900px) { grid-template-columns: 3fr 2fr; } }
    
    .form-section {
      background: #fff; padding: 2.5rem; border-radius: 8px; box-shadow: 0 4px 15px rgba(0,0,0,0.05);
      h2 { color: var(--color-primary); margin-bottom: 1.5rem; }
      .form-group { margin-bottom: 1.5rem; label { display: block; margin-bottom: 0.5rem; font-weight: 600; color: var(--color-primary); } input, textarea { width: 100%; padding: 12px; border: 1px solid #cbd5e0; border-radius: 4px; font-family: inherit; &:focus { outline: none; border-color: var(--color-accent); } } }
      .submit-btn { background: var(--color-primary); color: #fff; border: none; padding: 12px 24px; font-size: 1rem; font-weight: bold; border-radius: 4px; cursor: pointer; transition: 0.3s; &:hover:not(:disabled) { background: var(--color-accent); color: var(--color-primary); } &:disabled { opacity: 0.5; cursor: not-allowed; } }
      .success-msg { color: green; margin-top: 1rem; font-weight: 500; }
    }

    .info-section {
      h2 { color: var(--color-primary); margin-bottom: 1.5rem; }
      .office { margin-bottom: 2rem; h3 { font-size: 1.1rem; color: var(--color-primary); margin-bottom: 0.5rem; } p { color: var(--text-muted); line-height: 1.5; } }
      .direct-contact { margin-top: 3rem; padding-top: 2rem; border-top: 1px solid #e2e8f0; p { color: var(--color-primary); font-size: 1.1rem; } }
    }
  `]
})
export class ContactComponent {
  contactForm: FormGroup;
  submitted = false;

  constructor(private fb: FormBuilder) {
    // Added company and phone fields to the reactive form
    this.contactForm = this.fb.group({
      name: ['', Validators.required],
      company: [''], // Optional field
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required], // Required field
      message: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.contactForm.valid) {
      this.submitted = true;
      console.log('Contact Form Submitted:', this.contactForm.value);
      this.contactForm.reset();
      setTimeout(() => this.submitted = false, 5000);
    }
  }
}