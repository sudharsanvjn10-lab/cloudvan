import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="inner-hero">
      <div class="container">
        <h1 class="reveal-up">Contact Us</h1>
        <p class="reveal-up-delay-1">Let's discuss how our Oracle Fusion HCM expertise can transform your organization.</p>
      </div>
    </div>

    <section class="container contact-wrapper">
      <div class="contact-grid">
        
        <div class="form-section">
          <h2>Send us a Message</h2>
          <form [formGroup]="contactForm" (ngSubmit)="onSubmit()">
            
            <!-- Honeypot anti-bot field -->
            <input type="text" formControlName="website" style="display:none !important" tabindex="-1" autocomplete="off" aria-hidden="true">

            <div class="form-group">
              <label for="contact-name">Name *</label>
              <input id="contact-name" type="text" formControlName="name" placeholder="John Doe">
            </div>

            <div class="form-group">
              <label for="contact-company">Company / Organization</label>
              <input id="contact-company" type="text" formControlName="company" placeholder="Your Company Name">
            </div>

            <div class="form-group">
              <label for="contact-email">Corporate Email *</label>
              <input id="contact-email" type="email" formControlName="email" placeholder="john@company.com">
            </div>

            <div class="form-group">
              <label for="contact-phone">Phone Number *</label>
              <input id="contact-phone" type="tel" formControlName="phone" placeholder="+1 234 567 8900">
            </div>

            <div class="form-group">
              <label for="contact-message">Message *</label>
              <textarea id="contact-message" formControlName="message" rows="5" placeholder="How can we help you with Oracle Fusion HCM?"></textarea>
            </div>

            <div *ngIf="errorMessage()" class="error-banner">
              ⚠️ {{ errorMessage() }}
            </div>

            <button type="submit" [disabled]="contactForm.invalid || isSubmitting()" class="submit-btn">
              <span *ngIf="!isSubmitting()">Send Message</span>
              <span *ngIf="isSubmitting()" class="btn-loading">
                <span class="spinner-small"></span> Sending...
              </span>
            </button>

            <p *ngIf="submitted()" class="success-msg">Thank you! Your message has been received. Our Oracle HCM team will be in touch shortly.</p>
            <p *ngIf="deliveryWarning()" class="delivery-warning" style="color: #b45309; margin-top: 0.5rem; font-size: 0.9rem; font-weight: 500;">⚠️ {{ deliveryWarning() }}</p>
          </form>
        </div>

        <div class="info-section">
          <h2>Our Offices</h2>

          <div class="office registered-office">
            <h3>Madurai (Offshore Development Centre)</h3>
            <p>Madurai - 625 402, Tamil Nadu, India</p>
          </div>
          
          <div class="office registered-office">
            <h3>Chennai (Delivery Center)</h3>
            <p>Pallikaranai, Chennai - 600117<br>Tamil Nadu, India</p>
          </div>

          <div class="direct-contact">
            <p><strong>Email:</strong> info&#64;cloudvantagesolutions.com</p>
          </div>

          <div class="direct-contact">
            <p><strong>Mobile:</strong> +91 99400 98685</p>
          </div>

        </div>
      </div>
    </section>
  `,
  styles: [`
    .contact-wrapper { padding: 5rem 0; }
    .contact-grid { display: grid; grid-template-columns: 1fr; gap: 4rem; @media (min-width: 900px) { grid-template-columns: 3fr 2fr; } }
    
    .form-section {
      background: #fff; padding: 2.5rem; border-radius: 8px; box-shadow: 0 4px 15px rgba(0,0,0,0.05);
      h2 { color: var(--color-primary, #0b0f19); margin-bottom: 1.5rem; }
      .form-group { margin-bottom: 1.5rem; label { display: block; margin-bottom: 0.5rem; font-weight: 600; color: var(--color-primary, #0b0f19); } input, textarea { width: 100%; padding: 12px 14px; border: 1px solid var(--color-line, #e2e8f0); border-radius: 8px; font-family: inherit; transition: border-color 0.2s, box-shadow 0.2s; &:focus { outline: none; border-color: var(--color-accent, #2563eb); box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.15); } } }
      .submit-btn { 
        background: var(--color-accent, #2563eb); 
        color: #fff; 
        border: none; 
        padding: 12px 28px; 
        font-size: 1rem; 
        font-weight: bold; 
        border-radius: 6px; 
        cursor: pointer; 
        transition: 0.3s; 
        display: inline-flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 8px 20px -6px rgba(37, 99, 235, 0.5);
        &:hover:not(:disabled) { background: var(--color-accent-hover, #3b82f6); } 
        &:disabled { opacity: 0.6; cursor: not-allowed; } 
      }
      .btn-loading { display: flex; align-items: center; gap: 8px; }
      .spinner-small {
        width: 16px; height: 16px; border: 2px solid rgba(255,255,255,0.3); border-top-color: #fff; border-radius: 50%;
        animation: spin 0.8s linear infinite;
      }
      .success-msg { color: #16a34a; margin-top: 1rem; font-weight: 600; }
      .error-banner {
        background: #fee2e2; border: 1px solid #f87171; color: #b91c1c; padding: 12px 16px; border-radius: 6px; margin-bottom: 1.5rem; font-size: 0.9rem;
      }
    }

    .info-section {
      h2 { color: var(--color-primary, #0b0f19); margin-bottom: 1.5rem; }
      .office { 
        margin-bottom: 2rem; 
        padding: 1.5rem; 
        background: #ffffff; 
        border-radius: 8px; 
        border: 1px solid #e2e8f0; 
        box-shadow: 0 2px 8px rgba(0,0,0,0.04);
        h3 { font-size: 1.1rem; color: var(--color-primary, #0b0f19); margin-bottom: 0.5rem; } 
        p { color: #64748b; line-height: 1.6; } 
      }
      .direct-contact { margin-top: 1.5rem; padding-top: 1rem; border-top: 1px solid #e2e8f0; p { color: var(--color-primary, #0b0f19); font-size: 1.05rem; } }
      .contact-link { color: var(--color-accent, #2563eb); text-decoration: none; font-weight: 500; transition: color 0.2s; &:hover { color: #1d4ed8; text-decoration: underline; } }
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }
  `]
})
export class ContactComponent {
  private http = inject(HttpClient);
  private fb = inject(FormBuilder);
  
  contactForm: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.pattern(/\S+/), Validators.maxLength(100)]],
    company: ['', [Validators.maxLength(100)]],
    email: ['', [Validators.required, Validators.email, Validators.maxLength(100)]],
    phone: ['', [Validators.required, Validators.pattern(/^[+]?[0-9\s\-()]{7,25}$/), Validators.maxLength(30)]],
    message: ['', [Validators.required, Validators.pattern(/\S+/), Validators.minLength(10), Validators.maxLength(3000)]],
    website: [''] // Honeypot anti-spam
  });
  
  submitted = signal(false);
  isSubmitting = signal(false);
  errorMessage = signal<string | null>(null);
  deliveryWarning = signal<string | null>(null);

  onSubmit() {
    if (this.contactForm.valid && !this.isSubmitting()) {
      this.isSubmitting.set(true);
      this.errorMessage.set(null);
      this.deliveryWarning.set(null);
      this.http.post<{ success: boolean; message?: string; emailDelivered?: boolean }>(`${environment.apiUrl}/contact`, this.contactForm.value).subscribe({
        next: (res) => {
          this.isSubmitting.set(false);
          this.submitted.set(true);
          if (res && res.emailDelivered === false) {
            this.deliveryWarning.set('Message saved to our records. Note: Automated email notification is temporarily offline.');
          }
          this.contactForm.reset();
          setTimeout(() => {
            this.submitted.set(false);
            this.deliveryWarning.set(null);
          }, 8000);
        },
        error: (err) => {
          this.isSubmitting.set(false);
          console.error("Error submitting contact details:", err);
          this.errorMessage.set('Failed to deliver message. Please reach us directly at info@cloudvantagesolutions.com.');
        }
      });
    }
  }
}
