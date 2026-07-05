import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-careers',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="inner-hero">
      <div class="container">
        <h1 class="reveal-up">Join Our Team</h1>
        <p class="reveal-up-delay-1">Build the future of enterprise cloud solutions with us.</p>
      </div>
    </div>
    
    <section class="container careers-content">
      <div class="intro">
        <h2>Why Cloud Vantage Solutions?</h2>
        <p>We are always looking for passionate Oracle functional consultants, technical architects, and developers to join our global delivery teams in Dubai, Chennai, and Madurai.</p>
      </div>
      
      <div class="jobs-list">
        <div class="job-card" *ngFor="let job of jobs">
          <div class="job-info">
            <h3>{{ job.title }}</h3>
            <span>📍 {{ job.location }} | 💼 {{ job.type }}</span>
          </div>
          <button class="btn-apply" (click)="openApplyModal(job.title)">Apply Now</button>
        </div>
      </div>
    </section>

    <!-- Job Application Modal -->
    <div class="modal-overlay" *ngIf="selectedJob()" (click)="closeApplyModal()">
      <div class="modal-content" (click)="$event.stopPropagation()">
        <button class="close-btn" (click)="closeApplyModal()">&times;</button>
        
        <div class="modal-header">
          <h2>Apply for Position</h2>
          <span class="job-badge">{{ selectedJob() }}</span>
        </div>
        <div class="divider"></div>

        <form [formGroup]="applyForm" (ngSubmit)="onApplySubmit()" class="modal-form">
          <div class="form-group">
            <label>Full Name *</label>
            <input type="text" formControlName="name" placeholder="John Doe">
          </div>

          <div class="form-group">
            <label>Email Address *</label>
            <input type="email" formControlName="email" placeholder="john@company.com">
          </div>

          <div class="form-group">
            <label>Resume Link (Google Drive / Dropbox) *</label>
            <input type="url" formControlName="resumeLink" placeholder="https://drive.google.com/file/d/...">
          </div>

          <button type="submit" [disabled]="applyForm.invalid" class="btn-submit-app">Submit Application</button>
          <p *ngIf="applied" class="success-msg">Thank you! Your application has been submitted.</p>
        </form>
      </div>
    </div>
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
      .btn-apply { background: var(--color-primary); color: #fff; padding: 10px 20px; border: none; border-radius: 4px; cursor: pointer; font-weight: bold; transition: 0.3s; &:hover { background: var(--color-accent); color: #fff; } }
    }

    /* Modal Styling */
    .modal-overlay {
      position: fixed;
      top: 0; left: 0; width: 100%; height: 100vh;
      background: rgba(15, 23, 42, 0.6);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      z-index: 2000;
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 20px;
      animation: fadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1);
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    .modal-content {
      background: #ffffff;
      width: 100%;
      max-width: 500px;
      border-radius: 20px;
      position: relative;
      overflow: hidden;
      padding: 40px 30px;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
      border: 1px solid rgba(255, 255, 255, 0.1);
      animation: slideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1);
    }

    @keyframes slideUp {
      from { transform: translateY(40px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }

    .close-btn {
      position: absolute;
      top: 15px; right: 20px;
      background: none; border: none;
      font-size: 2rem; color: #64748b;
      cursor: pointer; z-index: 10;
      transition: color 0.3s;
      &:hover { color: #0f172a; }
    }

    .modal-header h2 {
      font-size: 1.6rem; color: #0f172a; margin-bottom: 8px; font-weight: 700;
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
        margin-bottom: 1.5rem;
        label { display: block; margin-bottom: 0.5rem; font-weight: 600; color: #0f172a; }
        input { width: 100%; padding: 12px; border: 1px solid #cbd5e0; border-radius: 6px; font-family: inherit; &:focus { outline: none; border-color: #2563eb; } }
      }
      .btn-submit-app {
        width: 100%;
        background: #2563eb;
        color: #fff;
        border: none;
        padding: 14px;
        font-size: 1rem;
        font-weight: bold;
        border-radius: 6px;
        cursor: pointer;
        transition: 0.3s;
        box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
        &:hover:not(:disabled) { background: #3b82f6; transform: translateY(-1px); box-shadow: 0 6px 20px rgba(37, 99, 235, 0.4); }
        &:disabled { opacity: 0.5; cursor: not-allowed; box-shadow: none; }
      }
      .success-msg { color: green; margin-top: 1rem; text-align: center; font-weight: 500; }
    }
  `]
})
export class CareersComponent {
  private http = inject(HttpClient);
  private fb = inject(FormBuilder);

  jobs = [
    { title: 'Senior Oracle HCM Consultant', location: 'Chennai, India', type: 'Full-Time' },
    { title: 'Junior Oracle HCM Consultant', location: 'Chennai, India', type: 'Full-Time' },
    { title: 'Oracle Technical Developer (OIC/VBCS)', location: 'Madurai, India', type: 'Full-Time' }
  ];

  selectedJob = signal<string | null>(null);
  applied = false;

  applyForm: FormGroup = this.fb.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    resumeLink: ['', [Validators.required, Validators.pattern('https?://.+')]]
  });

  openApplyModal(jobTitle: string) {
    this.selectedJob.set(jobTitle);
    this.applied = false;
    this.applyForm.reset();
  }

  closeApplyModal() {
    this.selectedJob.set(null);
    this.applied = false;
  }

  onApplySubmit() {
    if (this.applyForm.valid) {
      const payload = {
        ...this.applyForm.value,
        jobTitle: this.selectedJob()
      };
      
      this.http.post(`${environment.apiUrl}/apply`, payload).subscribe({
        next: () => {
          this.applied = true;
          setTimeout(() => {
            this.closeApplyModal();
          }, 3000);
        },
        error: (err) => console.error("Error submitting job application:", err)
      });
    }
  }
}