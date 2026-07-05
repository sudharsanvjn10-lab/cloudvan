import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { environment } from '../../../environments/environment';

export interface ContactMessage {
  id: number;
  name: string;
  company?: string;
  email: string;
  phone: string;
  message: string;
  created_at: string;
}

export interface NewsletterSubscriber {
  id: number;
  email: string;
  created_at: string;
}

export interface JobApplication {
  id: number;
  name: string;
  email: string;
  resume_link: string;
  job_title: string;
  created_at: string;
}

export interface AdminUser {
  id: number;
  email: string;
  privilege: string;
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  template: `
    <div class="portal-container" [class.dashboard-mode]="isAuthenticated()">
      
      <!-- Login Card View -->
      <div class="login-card-wrapper" *ngIf="!isAuthenticated()">
        <div class="login-card">
          <div class="login-header">
            <div class="brand-branding">
              <div class="logo-wrapper">
                <img src="/assets/logo.png" alt="Cloud Vantage Logo" class="logo-img">
              </div>
              <div class="brand-text-block">
                <span class="brand-title">Cloud Vantage</span>
                <span class="brand-subtitle">Solutions</span>
              </div>
            </div>
            <h2>Internal Portal</h2>
            <p>Authorized Cloud Vantage personnel only.</p>
          </div>

          <form class="login-form" [formGroup]="loginForm" (ngSubmit)="onLoginSubmit()">
            <div class="form-group">
              <label for="email">Corporate Email</label>
              <input type="email" id="email" formControlName="email" placeholder="name@cloudvantage.com" required>
            </div>

            <div class="form-group">
              <label for="password">Password</label>
              <input type="password" id="password" formControlName="password" placeholder="••••••••" required>
            </div>

            <p *ngIf="loginError()" class="error-msg">{{ loginError() }}</p>

            <button type="submit" [disabled]="loginForm.invalid" class="btn-submit">Secure Login</button>
          </form>

          <div class="login-footer">
            <a routerLink="/" class="back-link">&larr; Back to Public Website</a>
          </div>
        </div>
      </div>

      <!-- Admin Dashboard Panel -->
      <div class="admin-dashboard" *ngIf="isAuthenticated()">
        <header class="dashboard-header">
          <div class="header-logo">
            <img src="/assets/logo.png" alt="Logo">
            <h1>Cloud Vantage Admin Portal</h1>
          </div>
          <div class="user-meta">
            <span class="user-email">{{ loggedInUserEmail() }} ({{ loggedInUserPrivilege() }})</span>
            <button class="btn-logout" (click)="onLogout()">Log Out</button>
          </div>
        </header>

        <nav class="tab-navigation">
          <button [class.active]="activeTab() === 'applications'" (click)="activeTab.set('applications')">
            Job Applications ({{ applications().length }})
          </button>
          <button [class.active]="activeTab() === 'messages'" (click)="activeTab.set('messages')">
            Contact Messages ({{ messages().length }})
          </button>
          <button [class.active]="activeTab() === 'subscribers'" (click)="activeTab.set('subscribers')">
            Newsletter Subscribers ({{ subscribers().length }})
          </button>
          <button [class.active]="activeTab() === 'users'" (click)="activeTab.set('users')" *ngIf="loggedInUserPrivilege() === 'SuperAdmin'">
            User Management ({{ users().length }})
          </button>
          <button [class.active]="activeTab() === 'security'" (click)="activeTab.set('security')">
            Security Settings
          </button>
        </nav>

        <main class="dashboard-content">
          
          <!-- Job Applications Table -->
          <div *ngIf="activeTab() === 'applications'" class="table-container">
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Applicant Name</th>
                  <th>Email</th>
                  <th>Target Position</th>
                  <th>Resume</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let app of applications()">
                  <td>{{ app.created_at | date:'short' }}</td>
                  <td><strong>{{ app.name }}</strong></td>
                  <td>{{ app.email }}</td>
                  <td><span class="badge-role">{{ app.job_title }}</span></td>
                  <td><a [href]="app.resume_link" target="_blank" class="resume-link">Open Resume &rarr;</a></td>
                  <td>
                    <button class="btn-delete" (click)="onDeleteApplication(app.id)">Delete</button>
                  </td>
                </tr>
                <tr *ngIf="applications().length === 0">
                  <td colspan="6" class="empty-row">No job applications submitted yet.</td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Contact Messages Table -->
          <div *ngIf="activeTab() === 'messages'" class="table-container">
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Sender</th>
                  <th>Contact Details</th>
                  <th>Company</th>
                  <th>Message</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let msg of messages()">
                  <td>{{ msg.created_at | date:'short' }}</td>
                  <td><strong>{{ msg.name }}</strong></td>
                  <td>
                    <div style="font-size:0.85rem;">{{ msg.email }}</div>
                    <div style="font-size:0.8rem; color:#64748b;">{{ msg.phone }}</div>
                  </td>
                  <td>{{ msg.company || 'N/A' }}</td>
                  <td class="message-cell">{{ msg.message }}</td>
                  <td>
                    <button class="btn-delete" (click)="onDeleteMessage(msg.id)">Delete</button>
                  </td>
                </tr>
                <tr *ngIf="messages().length === 0">
                  <td colspan="6" class="empty-row">No contact messages received yet.</td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Newsletter Subscribers Table -->
          <div *ngIf="activeTab() === 'subscribers'" class="table-container">
            <table>
              <thead>
                <tr>
                  <th>Date Subscribed</th>
                  <th>Email Address</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let sub of subscribers()">
                  <td>{{ sub.created_at | date:'short' }}</td>
                  <td><strong>{{ sub.email }}</strong></td>
                  <td>
                    <button class="btn-delete" (click)="onDeleteSubscriber(sub.id)">Delete</button>
                  </td>
                </tr>
                <tr *ngIf="subscribers().length === 0">
                  <td colspan="3" class="empty-row">No newsletter signups recorded yet.</td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- User Management Tab -->
          <div *ngIf="activeTab() === 'users'" class="user-management-grid">
            <div class="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Email Address</th>
                    <th>Privilege Role</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let user of users()">
                    <td><strong>{{ user.email }}</strong></td>
                    <td><span class="badge-role" [class.super]="user.privilege === 'SuperAdmin'">{{ user.privilege }}</span></td>
                    <td>
                      <button class="btn-delete" [disabled]="user.email === loggedInUserEmail()" (click)="onDeleteUser(user.id)">Delete</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- Create User Card Form -->
            <div class="action-card">
              <h3>Create New Admin Account</h3>
              <form [formGroup]="createUserForm" (ngSubmit)="onCreateUserSubmit()">
                <div class="form-group">
                  <label>Email *</label>
                  <input type="email" formControlName="email" placeholder="name@cloudvantage.com">
                </div>
                <div class="form-group">
                  <label>Password *</label>
                  <input type="password" formControlName="password" placeholder="••••••••">
                </div>
                <div class="form-group">
                  <label>Privilege Role *</label>
                  <select formControlName="privilege">
                    <option value="Admin">Admin</option>
                    <option value="SuperAdmin">SuperAdmin</option>
                  </select>
                </div>
                <p *ngIf="userCreateSuccess()" class="success-msg">User created successfully!</p>
                <p *ngIf="userCreateError()" class="error-msg">{{ userCreateError() }}</p>
                <button type="submit" [disabled]="createUserForm.invalid" class="btn-action">Create User</button>
              </form>
            </div>
          </div>

          <!-- Security Settings Tab -->
          <div *ngIf="activeTab() === 'security'" class="security-wrapper">
            <div class="action-card security-card">
              <h3>Change Password</h3>
              <p style="color:#64748b; font-size:0.9rem; margin-bottom:1.5rem;">Update credentials for the active account: <strong>{{ loggedInUserEmail() }}</strong></p>
              
              <form [formGroup]="changePasswordForm" (ngSubmit)="onChangePasswordSubmit()">
                <div class="form-group">
                  <label>New Password *</label>
                  <input type="password" formControlName="newPassword" placeholder="••••••••">
                </div>
                <p *ngIf="passwordChangeSuccess()" class="success-msg">Password updated successfully!</p>
                <p *ngIf="passwordChangeError()" class="error-msg">{{ passwordChangeError() }}</p>
                <button type="submit" [disabled]="changePasswordForm.invalid" class="btn-action">Update Password</button>
              </form>
            </div>
          </div>

        </main>
      </div>

    </div>
  `,
  styles: [`
    .portal-container {
      min-height: 100vh;
      background: #f1f5f9;
      font-family: 'Inter', sans-serif;
    }
    .portal-container.dashboard-mode {
      background: #f8fafc;
    }

    /* Login Card styles */
    .login-card-wrapper {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
      background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
    }

    .login-card {
      background: #ffffff;
      width: 100%;
      max-width: 420px;
      border-radius: 16px;
      padding: 40px 30px;
      box-shadow: 0 10px 25px rgba(0,0,0,0.15);
    }

    .login-header {
      text-align: center;
      margin-bottom: 30px;
      h2 { color: #0f172a; margin-top: 15px; margin-bottom: 5px; font-size: 1.5rem; font-weight: 700; }
      p { color: #64748b; font-size: 0.9rem; }
    }

    .brand-branding {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 12px;
      margin-bottom: 24px;
      border-bottom: 1px solid #f1f5f9;
      padding-bottom: 16px;
    }

    .logo-wrapper {
      width: 50px;
      height: 50px;
      flex-shrink: 0;
      img { width: 100%; height: 100%; object-fit: contain; }
    }

    .brand-text-block {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      line-height: 1.15;
      text-align: left;
    }

    .brand-title {
      font-size: 1.35rem;
      font-weight: 700;
      color: #0f172a;
      letter-spacing: -0.5px;
    }

    .brand-subtitle {
      font-size: 0.75rem;
      font-weight: 600;
      color: #3b82f6;
      letter-spacing: 0.5px;
      text-transform: none;
    }

    .login-form {
      .form-group {
        margin-bottom: 1.5rem;
        label { display: block; margin-bottom: 0.5rem; font-weight: 600; color: #0f172a; font-size: 0.9rem; }
        input { width: 100%; padding: 12px; border: 1px solid #cbd5e0; border-radius: 8px; font-family: inherit; font-size: 0.95rem; &:focus { outline: none; border-color: #2563eb; } }
      }
      .btn-submit {
        width: 100%; background: #2563eb; color: #fff; border: none; padding: 14px; font-size: 1rem; font-weight: bold; border-radius: 8px; cursor: pointer; transition: all 0.3s;
        box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
        &:hover:not(:disabled) { background: #3b82f6; transform: translateY(-1px); box-shadow: 0 6px 20px rgba(37, 99, 235, 0.4); }
        &:disabled { opacity: 0.6; cursor: not-allowed; box-shadow: none; }
      }
      .error-msg { color: #ef4444; font-size: 0.85rem; margin-bottom: 1rem; font-weight: 500; text-align: center; }
    }

    .login-footer { margin-top: 25px; text-align: center; padding-top: 15px; border-top: 1px solid #f1f5f9; }
    .back-link { color: #64748b; text-decoration: none; font-size: 0.9rem; font-weight: 500; transition: color 0.3s; &:hover { color: #0f172a; } }

    /* Admin Dashboard styles */
    .admin-dashboard {
      max-width: 1200px; margin: 0 auto; padding: 40px 20px;
    }

    .dashboard-header {
      display: flex; justify-content: space-between; align-items: center; margin-bottom: 40px;
      .header-logo {
        display: flex; align-items: center; gap: 15px;
        img { height: 50px; width: auto; object-fit: contain; }
        h1 { font-size: 1.5rem; color: #0f172a; margin: 0; font-weight: 700; }
      }
      .user-meta {
        display: flex; align-items: center; gap: 15px;
        .user-email { color: #475569; font-weight: 600; font-size: 0.95rem; }
      }
      .btn-logout { background: #ef4444; color: #fff; border: none; padding: 10px 20px; border-radius: 6px; font-weight: 600; cursor: pointer; transition: 0.3s; &:hover { background: #dc2626; transform: translateY(-1px); } }
    }

    .tab-navigation {
      display: flex; gap: 10px; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px; margin-bottom: 30px;
      button { background: transparent; border: none; padding: 10px 20px; font-size: 0.95rem; font-weight: 600; color: #64748b; cursor: pointer; border-radius: 6px; transition: all 0.3s; &:hover { color: #0f172a; background: #e2e8f0; } &.active { color: #2563eb; background: rgba(37, 99, 235, 0.1); } }
    }

    .dashboard-content {
      animation: fadeIn 0.4s ease-out;
    }

    .table-container {
      background: #ffffff; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.05); overflow: hidden; border: 1px solid #e2e8f0;
      table { width: 100%; border-collapse: collapse; text-align: left; }
      th { background: #f8fafc; color: #0f172a; font-weight: 600; padding: 15px; font-size: 0.9rem; border-bottom: 1px solid #e2e8f0; }
      td { padding: 15px; border-bottom: 1px solid #f1f5f9; color: #334155; font-size: 0.92rem; vertical-align: middle; }
      tr:last-child td { border-bottom: none; }
      .badge-role { background: rgba(37, 99, 235, 0.1); color: #2563eb; font-size: 0.8rem; font-weight: 600; padding: 4px 8px; border-radius: 4px; }
      .badge-role.super { background: rgba(16, 185, 129, 0.1); color: #10b981; }
      .resume-link { color: #2563eb; text-decoration: none; font-weight: 600; &:hover { text-decoration: underline; } }
      .message-cell { max-width: 350px; line-height: 1.5; color: #475569; word-wrap: break-word; }
      .empty-row { text-align: center; color: #94a3b8; padding: 40px; font-style: italic; }
      .btn-delete {
        background: #ef4444; color: #fff; border: none; padding: 6px 12px; font-size: 0.8rem; font-weight: 600; border-radius: 4px; cursor: pointer; transition: background 0.3s;
        &:hover:not(:disabled) { background: #dc2626; }
        &:disabled { opacity: 0.5; cursor: not-allowed; }
      }
    }

    /* User Management styles */
    .user-management-grid {
      display: grid; grid-template-columns: 1fr; gap: 30px;
      @media (min-width: 800px) { grid-template-columns: 3fr 2fr; }
    }

    .action-card {
      background: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0; padding: 30px; box-shadow: 0 4px 15px rgba(0,0,0,0.05);
      h3 { color: #0f172a; font-size: 1.25rem; font-weight: 700; margin-bottom: 20px; }
      .form-group {
        margin-bottom: 1.25rem;
        label { display: block; margin-bottom: 0.5rem; font-weight: 600; color: #0f172a; font-size: 0.85rem; }
        input, select { width: 100%; padding: 10px; border: 1px solid #cbd5e0; border-radius: 6px; font-family: inherit; font-size: 0.9rem; &:focus { outline: none; border-color: #2563eb; } }
      }
      .btn-action {
        width: 100%; background: #2563eb; color: #fff; border: none; padding: 12px; font-size: 0.95rem; font-weight: 600; border-radius: 6px; cursor: pointer; transition: 0.3s;
        &:hover:not(:disabled) { background: #3b82f6; transform: translateY(-1px); }
        &:disabled { opacity: 0.6; cursor: not-allowed; }
      }
      .success-msg { color: #10b981; font-size: 0.85rem; margin-bottom: 1rem; font-weight: 600; text-align: center; }
      .error-msg { color: #ef4444; font-size: 0.85rem; margin-bottom: 1rem; font-weight: 500; text-align: center; }
    }

    /* Security View */
    .security-wrapper {
      display: flex; justify-content: center;
    }
    .security-card {
      width: 100%; max-width: 500px;
    }
  `]
})
export class LoginComponent implements OnInit {
  private http = inject(HttpClient);
  private fb = inject(FormBuilder);

  loginForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  });

  createUserForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
    privilege: ['Admin', Validators.required]
  });

  changePasswordForm: FormGroup = this.fb.group({
    newPassword: ['', [Validators.required, Validators.minLength(6)]]
  });

  isAuthenticated = signal<boolean>(false);
  activeTab = signal<string>('applications');
  loginError = signal<string | null>(null);

  // User meta information
  loggedInUserEmail = signal<string>('');
  loggedInUserPrivilege = signal<string>('Admin');

  // Action status indicators
  userCreateSuccess = signal<boolean>(false);
  userCreateError = signal<string | null>(null);
  passwordChangeSuccess = signal<boolean>(false);
  passwordChangeError = signal<string | null>(null);

  // Dashboard Data Signals
  applications = signal<JobApplication[]>([]);
  messages = signal<ContactMessage[]>([]);
  subscribers = signal<NewsletterSubscriber[]>([]);
  users = signal<AdminUser[]>([]);

  ngOnInit() {
    const token = localStorage.getItem('admin_token');
    const savedEmail = localStorage.getItem('admin_email');
    const savedPrivilege = localStorage.getItem('admin_privilege');
    
    if (token && savedEmail && savedPrivilege) {
      this.isAuthenticated.set(true);
      this.loggedInUserEmail.set(savedEmail);
      this.loggedInUserPrivilege.set(savedPrivilege);
      this.fetchAdminData(token);
    }
  }

  onLoginSubmit() {
    if (this.loginForm.valid) {
      this.loginError.set(null);
      this.http.post<{ token: string, email: string, privilege: string }>(`${environment.apiUrl}/login`, this.loginForm.value).subscribe({
        next: (res) => {
          localStorage.setItem('admin_token', res.token);
          localStorage.setItem('admin_email', res.email);
          localStorage.setItem('admin_privilege', res.privilege);
          
          this.loggedInUserEmail.set(res.email);
          this.loggedInUserPrivilege.set(res.privilege);
          this.isAuthenticated.set(true);
          this.fetchAdminData(res.token);
        },
        error: (err: any) => {
          console.error("Login verification failed:", err);
          this.loginError.set(err.error?.error || 'Invalid corporate credentials');
        }
      });
    }
  }

  fetchAdminData(token: string) {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    this.http.get<{ contacts: ContactMessage[], subscribers: NewsletterSubscriber[], applications: JobApplication[], users: AdminUser[] }>(
      `${environment.apiUrl}/admin/data`,
      { headers }
    ).subscribe({
      next: (data) => {
        this.applications.set(data.applications || []);
        this.messages.set(data.contacts || []);
        this.subscribers.set(data.subscribers || []);
        this.users.set(data.users || []);
      },
      error: (err) => {
        console.error("Error querying administrative records:", err);
        this.onLogout();
      }
    });
  }

  onCreateUserSubmit() {
    if (this.createUserForm.valid) {
      this.userCreateSuccess.set(false);
      this.userCreateError.set(null);
      const token = localStorage.getItem('admin_token');
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`
      });
      
      this.http.post(`${environment.apiUrl}/admin/create-user`, this.createUserForm.value, { headers }).subscribe({
        next: () => {
          this.userCreateSuccess.set(true);
          this.createUserForm.reset({ privilege: 'Admin' });
          if (token) this.fetchAdminData(token);
          setTimeout(() => this.userCreateSuccess.set(false), 5000);
        },
        error: (err: any) => {
          console.error("Failed to create admin account:", err);
          this.userCreateError.set(err.error?.error || 'Failed to create user account');
        }
      });
    }
  }

  onChangePasswordSubmit() {
    if (this.changePasswordForm.valid) {
      this.passwordChangeSuccess.set(false);
      this.passwordChangeError.set(null);
      const token = localStorage.getItem('admin_token');
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`
      });
      
      const payload = {
        email: this.loggedInUserEmail(),
        newPassword: this.changePasswordForm.value.newPassword
      };

      this.http.post(`${environment.apiUrl}/admin/change-password`, payload, { headers }).subscribe({
        next: () => {
          this.passwordChangeSuccess.set(true);
          this.changePasswordForm.reset();
          setTimeout(() => this.passwordChangeSuccess.set(false), 5000);
        },
        error: (err: any) => {
          console.error("Failed to update credentials:", err);
          this.passwordChangeError.set(err.error?.error || 'Failed to update credentials');
        }
      });
    }
  }

  onDeleteApplication(id: number) {
    if (!confirm('Are you sure you want to delete this job application?')) return;
    const token = localStorage.getItem('admin_token');
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
    this.http.delete(`${environment.apiUrl}/admin/application/${id}`, { headers }).subscribe({
      next: () => {
        if (token) this.fetchAdminData(token);
      },
      error: (err) => console.error("Error deleting job application:", err)
    });
  }

  onDeleteMessage(id: number) {
    if (!confirm('Are you sure you want to delete this contact message?')) return;
    const token = localStorage.getItem('admin_token');
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
    this.http.delete(`${environment.apiUrl}/admin/contact/${id}`, { headers }).subscribe({
      next: () => {
        if (token) this.fetchAdminData(token);
      },
      error: (err) => console.error("Error deleting contact message:", err)
    });
  }

  onDeleteSubscriber(id: number) {
    if (!confirm('Are you sure you want to unsubscribe this email?')) return;
    const token = localStorage.getItem('admin_token');
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
    this.http.delete(`${environment.apiUrl}/admin/subscriber/${id}`, { headers }).subscribe({
      next: () => {
        if (token) this.fetchAdminData(token);
      },
      error: (err) => console.error("Error deleting subscriber:", err)
    });
  }

  onDeleteUser(id: number) {
    if (!confirm('Are you sure you want to delete this administrator account?')) return;
    const token = localStorage.getItem('admin_token');
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
    this.http.delete(`${environment.apiUrl}/admin/user/${id}`, { headers }).subscribe({
      next: () => {
        if (token) this.fetchAdminData(token);
      },
      error: (err) => console.error("Error deleting user:", err)
    });
  }

  onLogout() {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_email');
    localStorage.removeItem('admin_privilege');
    
    this.isAuthenticated.set(false);
    this.loggedInUserEmail.set('');
    this.loggedInUserPrivilege.set('Admin');
    
    this.applications.set([]);
    this.messages.set([]);
    this.subscribers.set([]);
    this.users.set([]);
  }
}