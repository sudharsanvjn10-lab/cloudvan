import { Component, OnInit, HostListener, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { catchError, of } from 'rxjs';
import { environment } from '../../../environments/environment';
import { FadeUpDirective } from '../../shared/directives/fade-up.directive';

export interface JobPosition {
  id?: number | string;
  title: string;
  location: string;
  type: string;
}

@Component({
  selector: 'app-careers',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FadeUpDirective],
  template: `
    <div class="inner-hero">
      <div class="container">
        <h1 class="reveal-up">Join Our Team</h1>
        <p class="reveal-up-delay-1">Build the future of Oracle Fusion HCM enterprise solutions with us.</p>
      </div>
    </div>
    
    <section class="container careers-content">
      <div class="intro">
        <h2>Why Cloud Vantage Solutions?</h2>
        <p>We are always looking for passionate Oracle Fusion HCM functional consultants, technical developers, and Redwood UI specialists to join our global delivery teams in Chennai and Madurai.</p>
      </div>
      
      <div class="jobs-list">
        <div class="job-card" *ngFor="let job of jobs(); let i = index" appFadeUp [delay]="i * 120">
          <div class="job-info">
            <h3>{{ job.title }}</h3>
            <span>📍 {{ job.location }} | 💼 {{ job.type }}</span>
          </div>
          <button class="btn-apply" (click)="openApplyModal(job.title)">Apply Now</button>
        </div>
      </div>
    </section>

    <!-- Job Application Modal with Backdrop Blur & Escape Close -->
    <div class="modal-overlay" *ngIf="selectedJob()" (click)="closeApplyModal()">
      <div class="modal-content" (click)="$event.stopPropagation()">
        <button class="close-btn" (click)="closeApplyModal()" aria-label="Close application modal">&times;</button>
        
        <div class="modal-header">
          <h2>Apply for Position</h2>
          <span class="job-badge">{{ selectedJob() }}</span>
        </div>
        <div class="divider"></div>

        <form [formGroup]="applyForm" (ngSubmit)="onApplySubmit()" class="modal-form">
          <!-- Honeypot anti-spam field -->
          <input type="text" formControlName="website" style="display:none !important" tabindex="-1" autocomplete="off" aria-hidden="true">

          <div class="form-group">
            <label>Full Name *</label>
            <input type="text" formControlName="name" placeholder="John Doe">
          </div>

          <div class="form-group">
            <label>Corporate / Personal Email *</label>
            <input type="email" formControlName="email" placeholder="john@company.com">
          </div>

          <div class="form-group">
            <label>Secure Resume Link (Google Drive / Dropbox / LinkedIn HTTPS) *</label>
            <input type="url" formControlName="resumeLink" placeholder="https://drive.google.com/file/d/...">
            <small class="field-hint">Must start with https:// for security.</small>
          </div>

          <div *ngIf="errorMessage()" class="error-banner">
            ⚠️ {{ errorMessage() }}
          </div>

          <button type="submit" [disabled]="applyForm.invalid || isSubmitting()" class="btn-submit-app">
            <span *ngIf="!isSubmitting()">Submit Application</span>
            <span *ngIf="isSubmitting()" class="btn-loading">
              <span class="spinner-small"></span> Submitting...
            </span>
          </button>
          
          <p *ngIf="applied()" class="success-msg">Thank you! Your application has been submitted successfully.</p>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .inner-hero {
      background: linear-gradient(to right, var(--color-primary, #0b0f19), #0c3866);
      padding: 120px 0 60px; color: #fff; text-align: center;
      h1 { font-size: clamp(2.5rem, 4vw, 3.5rem); margin-bottom: 1rem; color: #fff;}
      p { font-size: 1.25rem; color: var(--color-accent, #3b82f6); }
    }
    .careers-content { padding: 5rem 0; max-width: 800px; margin: 0 auto; }
    .intro { text-align: center; margin-bottom: 3rem; h2 { color: var(--color-primary, #0b0f19); margin-bottom: 1rem;} p { color: var(--text-muted); font-size: 1.1rem; line-height: 1.6;} }
    .job-card {
      display: flex; justify-content: space-between; align-items: center; background: #fff; padding: 1.5rem 2rem; margin-bottom: 1rem; border-radius: 8px; border: 1px solid #e2e8f0;
      transition: transform 0.3s ease, box-shadow 0.3s ease;
      &:hover {
        transform: translateY(-3px);
        box-shadow: 0 8px 20px rgba(0, 0, 0, 0.06);
      }
      @media (max-width: 600px) { flex-direction: column; align-items: flex-start; gap: 1rem; }
      h3 { color: var(--color-primary, #0b0f19); margin-bottom: 0.5rem; font-size: 1.15rem; }
      span { color: #718096; font-size: 0.9rem; }
      .btn-apply { background: var(--color-primary, #0b0f19); color: #fff; padding: 10px 20px; border: none; border-radius: 6px; cursor: pointer; font-weight: 600; transition: 0.3s; &:hover { background: var(--color-accent, #2563eb); color: #fff; transform: translateY(-1px); } }
    }

    /* Modal Styling with Sleek Glassmorphism Backdrop */
    .modal-overlay {
      position: fixed;
      top: 0; left: 0; width: 100%; height: 100vh;
      background: rgba(15, 23, 42, 0.65);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      z-index: 2000;
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 20px;
      animation: fadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    .modal-content {
      background: #ffffff;
      width: 100%;
      max-width: 520px;
      border-radius: 16px;
      position: relative;
      overflow: hidden;
      padding: 36px 32px;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.35);
      border: 1px solid rgba(255, 255, 255, 0.2);
      animation: scaleUp 0.4s cubic-bezier(0.16, 1, 0.3, 1);
    }

    @keyframes scaleUp {
      from { transform: scale(0.95) translateY(20px); opacity: 0; }
      to { transform: scale(1) translateY(0); opacity: 1; }
    }

    .close-btn {
      position: absolute;
      top: 16px; right: 20px;
      background: none; border: none;
      font-size: 2rem; color: #64748b;
      cursor: pointer; z-index: 10;
      transition: color 0.2s;
      &:hover { color: #0f172a; }
    }

    .modal-header h2 {
      font-size: 1.5rem; color: #0f172a; margin-bottom: 8px; font-weight: 700;
    }

    .job-badge {
      display: inline-block;
      background: rgba(37, 99, 235, 0.1);
      color: #2563eb;
      font-weight: 600;
      font-size: 0.85rem;
      padding: 6px 12px;
      border-radius: 6px;
    }

    .divider {
      height: 1px; background: #e2e8f0; margin: 20px 0;
    }

    .modal-form {
      .form-group {
        margin-bottom: 1.25rem;
        label { display: block; margin-bottom: 0.4rem; font-weight: 600; color: #0f172a; font-size: 0.95rem; }
        input { width: 100%; padding: 12px; border: 1px solid #cbd5e0; border-radius: 6px; font-family: inherit; font-size: 0.95rem; &:focus { outline: none; border-color: #2563eb; } }
        .field-hint { display: block; margin-top: 4px; font-size: 0.8rem; color: #64748b; }
      }
      .btn-submit-app {
        width: 100%;
        background: #2563eb;
        color: #fff;
        border: none;
        padding: 13px;
        font-size: 1rem;
        font-weight: 600;
        border-radius: 6px;
        cursor: pointer;
        transition: 0.25s;
        box-shadow: 0 4px 12px rgba(37, 99, 235, 0.25);
        display: flex;
        align-items: center;
        justify-content: center;
        &:hover:not(:disabled) { background: #1d4ed8; transform: translateY(-1px); box-shadow: 0 6px 16px rgba(37, 99, 235, 0.35); }
        &:disabled { opacity: 0.6; cursor: not-allowed; box-shadow: none; }
      }
      .btn-loading { display: flex; align-items: center; gap: 8px; }
      .spinner-small {
        width: 16px; height: 16px; border: 2px solid rgba(255,255,255,0.3); border-top-color: #fff; border-radius: 50%;
        animation: spin 0.8s linear infinite;
      }
      .success-msg { color: #16a34a; margin-top: 1rem; text-align: center; font-weight: 600; }
      .error-banner {
        background: #fee2e2; border: 1px solid #f87171; color: #b91c1c; padding: 10px 14px; border-radius: 6px; margin-bottom: 1.25rem; font-size: 0.85rem;
      }
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }
  `]
})
export class CareersComponent implements OnInit {
  private http = inject(HttpClient);
  private fb = inject(FormBuilder);

  private fallbackJobs: JobPosition[] = [
    { id: 1, title: 'Senior Oracle Fusion HCM Functional Consultant (Core HR & Payroll)', location: 'Chennai, India', type: 'Full-Time' },
    { id: 2, title: 'Oracle Fusion HCM Technical Developer (HDL, Fast Formulas & OTBI)', location: 'Chennai, India', type: 'Full-Time' },
    { id: 3, title: 'Redwood UI & VBS Specialist (Oracle HCM Extensions)', location: 'Madurai, India', type: 'Full-Time' },
    { id: 4, title: 'Oracle Recruiting Cloud (ORC) & Talent Specialist', location: 'Madurai, India', type: 'Full-Time' }
  ];

  jobs = signal<JobPosition[]>(this.fallbackJobs);
  selectedJob = signal<string | null>(null);
  applied = signal(false);
  isSubmitting = signal(false);
  errorMessage = signal<string | null>(null);

  applyForm: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.pattern(/\S+/), Validators.maxLength(100)]],
    email: ['', [Validators.required, Validators.email, Validators.maxLength(100)]],
    resumeLink: ['', [Validators.required, Validators.pattern(/^https:\/\/[^\s<>]+$/), Validators.maxLength(500)]],
    website: [''] // Honeypot anti-spam
  });

  @HostListener('document:keydown.escape')
  onEscape() {
    if (this.selectedJob()) {
      this.closeApplyModal();
    }
  }

  ngOnInit() {
    this.http.get<JobPosition[]>(`${environment.apiUrl}/jobs`)
      .pipe(catchError(() => of(this.fallbackJobs)))
      .subscribe(data => {
        if (data && data.length > 0) {
          this.jobs.set(data);
        }
      });
  }

  openApplyModal(jobTitle: string) {
    this.selectedJob.set(jobTitle);
    this.applied.set(false);
    this.errorMessage.set(null);
    this.applyForm.reset();
    if (typeof document !== 'undefined') {
      document.body.style.overflow = 'hidden';
    }
  }

  closeApplyModal() {
    this.selectedJob.set(null);
    this.applied.set(false);
    this.errorMessage.set(null);
    if (typeof document !== 'undefined') {
      document.body.style.overflow = '';
    }
  }

  onApplySubmit() {
    if (this.applyForm.valid && !this.isSubmitting()) {
      this.isSubmitting.set(true);
      this.errorMessage.set(null);

      const payload = {
        ...this.applyForm.value,
        jobTitle: this.selectedJob()
      };
      
      this.http.post(`${environment.apiUrl}/apply`, payload).subscribe({
        next: () => {
          this.isSubmitting.set(false);
          this.applied.set(true);
          setTimeout(() => {
            this.closeApplyModal();
          }, 2500);
        },
        error: (err) => {
          this.isSubmitting.set(false);
          console.error("Error submitting job application:", err);
          this.errorMessage.set('Submission failed. Please email your resume directly to info@cloudvantagesolutions.com.');
        }
      });
    }
  }
}
