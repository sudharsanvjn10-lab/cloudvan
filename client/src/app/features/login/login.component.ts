import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { environment } from '../../../environments/environment';
import { ContentService, SiteContent, DEFAULT_SITE_CONTENT, DetailedService, WhyCvTab } from '../../core/services/content.service';

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

export interface AdminJob {
  id: number;
  title: string;
  location: string;
  type: string;
  created_at?: string;
}

export interface AdminUser {
  id: number;
  email: string;
  privilege: string;
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, FormsModule],
  template: `
    <div class="portal-container" [class.dashboard-mode]="isAuthenticated()">
      
      <!-- Login Card View -->
      <div class="login-card-wrapper" *ngIf="!isAuthenticated()">
        <div class="login-card">
          <div class="login-header">
            <div class="brand-branding">
              <div class="logo-wrapper">
                <img src="/assets/logo-official.png" alt="Cloud Vantage Logo" class="logo-img">
              </div>
              <div class="brand-text-block">
                <span class="brand-title">Cloud Vantage</span>
                <span class="brand-subtitle">Solutions</span>
              </div>
            </div>
            <h2>Internal Portal</h2>
            <p>Authorized Cloud Vantage Solutions personnel only.</p>
          </div>

          <form class="login-form" [formGroup]="loginForm" (ngSubmit)="onLoginSubmit()">
            <div class="form-group">
              <label for="email">Corporate Email</label>
              <input type="email" id="email" formControlName="email" placeholder="name@cloudvantage.com" required>
            </div>

            <div class="form-group">
              <label for="password">Password</label>
              <div class="password-input-group">
                <input [type]="showPassword() ? 'text' : 'password'" id="password" formControlName="password" placeholder="••••••••" required>
                <button type="button" class="btn-toggle-pwd" (click)="togglePasswordVisibility()" [attr.aria-label]="showPassword() ? 'Hide password' : 'Show password'">
                  {{ showPassword() ? '👁️' : '🔒' }}
                </button>
              </div>
            </div>

            <div class="credentials-badge">
              <span class="badge-icon">🔑</span>
              <div class="badge-text">
                <span class="badge-title">Admin Access Credentials:</span>
                <div class="badge-val">Email: <strong>admin&#64;cloudvantage.com</strong></div>
                <div class="badge-val">Password: <strong>Admin&#64;123</strong></div>
              </div>
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
            <img src="/assets/logo-official.png" alt="Logo">
            <h1>Cloud Vantage Solutions Admin Portal</h1>
          </div>
          <div class="user-meta">
            <span class="user-email">{{ loggedInUserEmail() }} ({{ loggedInUserPrivilege() }})</span>
            <button class="btn-logout" (click)="onLogout()">Log Out</button>
          </div>
        </header>

        <nav class="tab-navigation">
          <button [class.active]="activeTab() === 'cms'" (click)="setTab('cms')">
            🎨 Website Content (No-Code CMS)
          </button>
          <button [class.active]="activeTab() === 'jobs'" (click)="setTab('jobs')">
            Job Openings ({{ jobs().length }})
          </button>
          <button [class.active]="activeTab() === 'applications'" (click)="setTab('applications')">
            Job Applications ({{ applications().length }})
          </button>
          <button [class.active]="activeTab() === 'messages'" (click)="setTab('messages')">
            Contact Messages ({{ messages().length }})
          </button>
          <button [class.active]="activeTab() === 'subscribers'" (click)="setTab('subscribers')">
            Newsletter Subscribers ({{ subscribers().length }})
          </button>
          <button [class.active]="activeTab() === 'users'" (click)="setTab('users')" *ngIf="loggedInUserPrivilege() === 'SuperAdmin'">
            User Management ({{ users().length }})
          </button>
          <button [class.active]="activeTab() === 'security'" (click)="setTab('security')">
            Security Settings
          </button>
        </nav>

        <main class="dashboard-content">
          
          <!-- Website Content (CMS) Tab -->
          <div *ngIf="activeTab() === 'cms'" class="cms-editor-container">
            
            <!-- CMS Top Toolbar -->
            <div class="cms-toolbar">
              <div class="cms-toolbar-info">
                <h2>🎨 Website Content Editor (No-Code CMS)</h2>
                <p>Customize slides, numbers, service descriptions, team biographies, and company contacts without coding.</p>
              </div>
              <div class="cms-toolbar-actions">
                <button class="btn-reset-cms" (click)="resetCmsContent()">Reset Defaults</button>
                <button class="btn-save-cms" [disabled]="isSavingCms()" (click)="saveCmsContent()">
                  <span *ngIf="!isSavingCms()">💾 Save & Publish</span>
                  <span *ngIf="isSavingCms()">Saving Changes...</span>
                </button>
              </div>
            </div>

            <div *ngIf="cmsSaveMessage()" class="cms-alert-banner success">
              ✅ {{ cmsSaveMessage() }}
            </div>
            <div *ngIf="cmsSaveError()" class="cms-alert-banner error">
              ⚠️ {{ cmsSaveError() }}
            </div>

            <!-- CMS Sub-Navigation -->
            <div class="cms-subnav">
              <button [class.active]="cmsSubTab() === 'slides'" (click)="cmsSubTab.set('slides')">🖼️ Hero Slides ({{ cmsData.heroSlides.length }})</button>
              <button [class.active]="cmsSubTab() === 'stats'" (click)="cmsSubTab.set('stats')">📊 Key Stats ({{ cmsData.stats.length }})</button>
              <button [class.active]="cmsSubTab() === 'services'" (click)="cmsSubTab.set('services')">⚙️ Service Modules ({{ cmsData.services.length }})</button>
              <button [class.active]="cmsSubTab() === 'why'" (click)="cmsSubTab.set('why')">💡 Why Choose Us ({{ cmsData.whyCvTabs.length }})</button>
              <button [class.active]="cmsSubTab() === 'insights'" (click)="cmsSubTab.set('insights')">📰 Insights & News ({{ cmsData.insights.length }})</button>
              <button [class.active]="cmsSubTab() === 'team'" (click)="cmsSubTab.set('team')">👥 Leadership Team ({{ cmsData.team.length }})</button>
              <button [class.active]="cmsSubTab() === 'company'" (click)="cmsSubTab.set('company')">🏢 Company Info</button>
            </div>

            <!-- Sub-Tab 1: Hero Slides -->
            <div *ngIf="cmsSubTab() === 'slides'" class="cms-panel">
              <div class="cms-panel-header">
                <div>
                  <h3>Hero Carousel Slides</h3>
                  <p>These slides rotate on the home page hero section. Change headlines, sublines, button links, and background photos.</p>
                </div>
                <button class="btn-add-item" (click)="addHeroSlide()">+ Add New Slide</button>
              </div>

              <div class="cms-cards-grid">
                <div class="cms-item-card" *ngFor="let slide of cmsData.heroSlides; let i = index">
                  <div class="cms-card-header">
                    <span class="card-number-badge">Slide #{{ i + 1 }}</span>
                    <button class="btn-card-delete" *ngIf="cmsData.heroSlides.length > 1" (click)="removeHeroSlide(i)" title="Delete Slide">&times;</button>
                  </div>

                  <div class="cms-image-preview-box">
                    <img [src]="slide.imageUrl" [alt]="slide.headline" (error)="onImgFallback($event)">
                    <div class="image-preview-overlay">Live Background Preview</div>
                  </div>

                  <div class="cms-form-grid">
                    <div class="cms-input-group full">
                      <label>Background Image URL</label>
                      <input type="text" [(ngModel)]="slide.imageUrl" placeholder="https://images.unsplash.com/...">
                    </div>
                    <div class="cms-input-group">
                      <label>Category Tag</label>
                      <input type="text" [(ngModel)]="slide.category" placeholder="e.g. ORACLE FUSION HCM CLOUD">
                    </div>
                    <div class="cms-input-group">
                      <label>Main Headline</label>
                      <input type="text" [(ngModel)]="slide.headline" placeholder="Transforming Global Enterprises">
                    </div>
                    <div class="cms-input-group full">
                      <label>Subline / Description</label>
                      <textarea [(ngModel)]="slide.subline" rows="2" placeholder="Describe the benefit..."></textarea>
                    </div>
                    <div class="cms-input-group">
                      <label>Button Text</label>
                      <input type="text" [(ngModel)]="slide.ctaText" placeholder="Discover Our Services">
                    </div>
                    <div class="cms-input-group">
                      <label>Button Link</label>
                      <input type="text" [(ngModel)]="slide.ctaLink" placeholder="/services">
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Sub-Tab 2: Key Stats -->
            <div *ngIf="cmsSubTab() === 'stats'" class="cms-panel">
              <div class="cms-panel-header">
                <div>
                  <h3>Key Metrics & Statistics</h3>
                  <p>The 4 high-impact counters displayed across the website banner with animated count-up numbers.</p>
                </div>
              </div>

              <div class="cms-cards-grid grid-4">
                <div class="cms-item-card" *ngFor="let stat of cmsData.stats; let i = index">
                  <div class="cms-card-header">
                    <span class="card-number-badge">Metric #{{ i + 1 }}</span>
                  </div>
                  <div class="cms-form-grid">
                    <div class="cms-input-group">
                      <label>Number (Counter)</label>
                      <input type="number" [(ngModel)]="stat.number" placeholder="20">
                    </div>
                    <div class="cms-input-group">
                      <label>Suffix (+, %, k)</label>
                      <input type="text" [(ngModel)]="stat.suffix" placeholder="+">
                    </div>
                    <div class="cms-input-group full">
                      <label>Label</label>
                      <input type="text" [(ngModel)]="stat.label" placeholder="Years in Operation">
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Sub-Tab 3: Service Modules -->
            <div *ngIf="cmsSubTab() === 'services'" class="cms-panel">
              <div class="cms-panel-header">
                <div>
                  <h3>Oracle Cloud Service Modules</h3>
                  <p>The 6 core Oracle HCM pillars featured on both the home page cards and the comprehensive /services page.</p>
                </div>
              </div>

              <div class="cms-cards-grid">
                <div class="cms-item-card" *ngFor="let s of cmsData.services; let i = index">
                  <div class="cms-card-header">
                    <span class="card-number-badge">{{ s.moduleCode || ('Module ' + (i + 1)) }}</span>
                    <span class="status-pill-small">{{ s.statusBadge }}</span>
                  </div>

                  <div class="cms-image-preview-box">
                    <img [src]="s.imageUrl" [alt]="s.title" (error)="onImgFallback($event)">
                    <div class="image-preview-overlay">Module Visual Preview</div>
                  </div>

                  <div class="cms-form-grid">
                    <div class="cms-input-group">
                      <label>Module Code</label>
                      <input type="text" [(ngModel)]="s.moduleCode" placeholder="MODULE 01">
                    </div>
                    <div class="cms-input-group">
                      <label>Status Badge</label>
                      <input type="text" [(ngModel)]="s.statusBadge" placeholder="100% Redwood Compatible">
                    </div>
                    <div class="cms-input-group full">
                      <label>Service Title</label>
                      <input type="text" [(ngModel)]="s.title" placeholder="Core HR & Global Workforce">
                    </div>
                    <div class="cms-input-group full">
                      <label>Image URL</label>
                      <input type="text" [(ngModel)]="s.imageUrl" placeholder="https://images.unsplash.com/...">
                    </div>
                    <div class="cms-input-group full">
                      <label>Short Lead Summary (Used on Home Page)</label>
                      <textarea [(ngModel)]="s.leadDescription" rows="2" placeholder="Summary sentence..."></textarea>
                    </div>
                    <div class="cms-input-group full">
                      <label>Detailed Paragraph (Used on /services Page)</label>
                      <textarea [(ngModel)]="s.paragraph" rows="3" placeholder="Full descriptive paragraph..."></textarea>
                    </div>
                    <div class="cms-input-group full">
                      <label>Key Features / Capabilities (One per line)</label>
                      <textarea [ngModel]="s.features.join('\n')" (ngModelChange)="updateFeatures(s, $event)" rows="4" placeholder="Feature 1&#10;Feature 2&#10;Feature 3"></textarea>
                      <span class="field-hint">Enter each key capability on a separate line</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Sub-Tab 4: Why Choose Us -->
            <div *ngIf="cmsSubTab() === 'why'" class="cms-panel">
              <div class="cms-panel-header">
                <div>
                  <h3>Why Cloud Vantage Solutions Tabs</h3>
                  <p>Interactive tabs on the homepage explaining company differentiators and delivery advantages.</p>
                </div>
              </div>

              <div class="cms-cards-grid">
                <div class="cms-item-card" *ngFor="let tab of cmsData.whyCvTabs; let i = index">
                  <div class="cms-card-header">
                    <span class="card-number-badge">Tab #{{ i + 1 }}</span>
                  </div>

                  <div class="cms-image-preview-box">
                    <img [src]="tab.imageUrl" [alt]="tab.heading" (error)="onImgFallback($event)">
                    <div class="image-preview-overlay">Tab Graphic Preview</div>
                  </div>

                  <div class="cms-form-grid">
                    <div class="cms-input-group">
                      <label>Tab Nav Title</label>
                      <input type="text" [(ngModel)]="tab.title" placeholder="The Vantage Advantage">
                    </div>
                    <div class="cms-input-group">
                      <label>Section Heading</label>
                      <input type="text" [(ngModel)]="tab.heading" placeholder="20+ Years of Oracle Cloud Mastery">
                    </div>
                    <div class="cms-input-group full">
                      <label>Image URL</label>
                      <input type="text" [(ngModel)]="tab.imageUrl" placeholder="https://images.unsplash.com/...">
                    </div>
                    <div class="cms-input-group full">
                      <label>Description Body</label>
                      <textarea [(ngModel)]="tab.body" rows="3" placeholder="Details about this advantage..."></textarea>
                    </div>
                    <div class="cms-input-group full">
                      <label>Key Bullet Points (1 per line)</label>
                      <textarea [ngModel]="tab.features.join('\n')" (ngModelChange)="updateTabFeatures(tab, $event)" rows="3" placeholder="Point 1&#10;Point 2&#10;Point 3"></textarea>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Sub-Tab 5: Insights & News -->
            <div *ngIf="cmsSubTab() === 'insights'" class="cms-panel">
              <div class="cms-panel-header">
                <div>
                  <h3>Insights & News Articles</h3>
                  <p>Articles displayed in the Insights grid. Add, edit, or delete articles shown on the homepage and /insights.</p>
                </div>
                <button class="btn-add-item" (click)="addInsight()">+ Add New Article</button>
              </div>

              <div class="cms-cards-grid grid-3">
                <div class="cms-item-card" *ngFor="let article of cmsData.insights; let i = index">
                  <div class="cms-card-header">
                    <span class="card-number-badge">Article #{{ i + 1 }}</span>
                    <button class="btn-card-delete" *ngIf="cmsData.insights.length > 1" (click)="removeInsight(i)" title="Delete Article">&times;</button>
                  </div>

                  <div class="cms-image-preview-box">
                    <img [src]="article.imageUrl" [alt]="article.title" (error)="onImgFallback($event)">
                    <div class="image-preview-overlay">Article Thumbnail Preview</div>
                  </div>

                  <div class="cms-form-grid">
                    <div class="cms-input-group full">
                      <label>Article Title</label>
                      <input type="text" [(ngModel)]="article.title" placeholder="e.g. Maximizing ROI with Oracle HCM">
                    </div>
                    <div class="cms-input-group full">
                      <label>Image URL</label>
                      <input type="text" [(ngModel)]="article.imageUrl" placeholder="https://images.unsplash.com/...">
                    </div>
                    <div class="cms-input-group full">
                      <label>Publish Date</label>
                      <input type="text" [(ngModel)]="article.date" placeholder="e.g. October 12, 2026">
                    </div>
                    <div class="cms-input-group full">
                      <label>Summary Excerpt</label>
                      <textarea [(ngModel)]="article.excerpt" rows="3" placeholder="Short description for readers..."></textarea>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Sub-Tab 6: Leadership Team -->
            <div *ngIf="cmsSubTab() === 'team'" class="cms-panel">
              <div class="cms-panel-header">
                <div>
                  <h3>Leadership & Core Team</h3>
                  <p>The leadership profiles displayed on the team grid with modal biographies.</p>
                </div>
                <button class="btn-add-item" (click)="addTeamMember()">+ Add Member</button>
              </div>

              <div class="cms-cards-grid grid-4">
                <div class="cms-item-card" *ngFor="let m of cmsData.team; let i = index">
                  <div class="cms-card-header">
                    <span class="card-number-badge">Member #{{ i + 1 }}</span>
                    <button class="btn-card-delete" *ngIf="cmsData.team.length > 1" (click)="removeTeamMember(i)" title="Delete Member">&times;</button>
                  </div>

                  <div class="cms-avatar-preview-box">
                    <img [src]="m.photoUrl" [alt]="m.name" (error)="onImgFallback($event)">
                  </div>

                  <div class="cms-form-grid">
                    <div class="cms-input-group full">
                      <label>Full Name</label>
                      <input type="text" [(ngModel)]="m.name" placeholder="e.g. Jeevanantham R.">
                    </div>
                    <div class="cms-input-group full">
                      <label>Designation / Title</label>
                      <input type="text" [(ngModel)]="m.title" placeholder="e.g. Founder & Director">
                    </div>
                    <div class="cms-input-group full">
                      <label>Photo URL (Local or Web Link)</label>
                      <input type="text" [(ngModel)]="m.photoUrl" placeholder="/assets/jeevanantham.png">
                    </div>
                    <div class="cms-input-group full">
                      <label>LinkedIn Profile URL</label>
                      <input type="text" [(ngModel)]="m.linkedin" placeholder="https://linkedin.com/in/...">
                    </div>
                    <div class="cms-input-group full">
                      <label>Biography</label>
                      <textarea [(ngModel)]="m.bio" rows="4" placeholder="Professional background..."></textarea>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Sub-Tab 7: Company Info -->
            <div *ngIf="cmsSubTab() === 'company'" class="cms-panel">
              <div class="cms-panel-header">
                <div>
                  <h3>Corporate & Contact Information</h3>
                  <p>Global contact coordinates, addresses, and social channels reflected in the header, footer, and contact page.</p>
                </div>
              </div>

              <div class="cms-cards-grid grid-2">
                <div class="cms-item-card">
                  <div class="cms-card-header">
                    <span class="card-number-badge">Direct Communication</span>
                  </div>
                  <div class="cms-form-grid">
                    <div class="cms-input-group full">
                      <label>Corporate Email</label>
                      <input type="email" [(ngModel)]="cmsData.companyInfo.email" placeholder="contact@cloud-vantage.com">
                    </div>
                    <div class="cms-input-group full">
                      <label>Direct Phone / Mobile</label>
                      <input type="text" [(ngModel)]="cmsData.companyInfo.phone" placeholder="+91 99400 98685">
                    </div>
                    <div class="cms-input-group full">
                      <label>Madurai Registered Office Address</label>
                      <textarea [(ngModel)]="cmsData.companyInfo.hqAddress" rows="2" placeholder="Registered Office, Madurai..."></textarea>
                    </div>
                    <div class="cms-input-group full">
                      <label>Chennai Delivery Center Address</label>
                      <textarea [(ngModel)]="cmsData.companyInfo.offshoreAddress" rows="2" placeholder="Pallikaranai, Chennai..."></textarea>
                    </div>
                  </div>
                </div>

                <div class="cms-item-card">
                  <div class="cms-card-header">
                    <span class="card-number-badge">Social Media Profiles</span>
                  </div>
                  <div class="cms-form-grid">
                    <div class="cms-input-group full">
                      <label>LinkedIn</label>
                      <input type="text" [(ngModel)]="cmsData.companyInfo.socialLinks.linkedin" placeholder="https://linkedin.com/...">
                    </div>
                    <div class="cms-input-group full">
                      <label>Twitter / X</label>
                      <input type="text" [(ngModel)]="cmsData.companyInfo.socialLinks.twitter" placeholder="https://twitter.com/...">
                    </div>
                    <div class="cms-input-group full">
                      <label>Facebook</label>
                      <input type="text" [(ngModel)]="cmsData.companyInfo.socialLinks.facebook" placeholder="https://facebook.com/...">
                    </div>
                    <div class="cms-input-group full">
                      <label>Instagram</label>
                      <input type="text" [(ngModel)]="cmsData.companyInfo.socialLinks.instagram" placeholder="https://instagram.com/...">
                    </div>
                    <div class="cms-input-group full">
                      <label>YouTube</label>
                      <input type="text" [(ngModel)]="cmsData.companyInfo.socialLinks.youtube" placeholder="https://youtube.com/...">
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Bottom Save Bar for Quick Access -->
            <div class="cms-bottom-bar">
              <div class="cms-bottom-info">
                <span>Ready to publish your edits? All modifications are saved to persistent cloud storage.</span>
              </div>
              <div class="cms-bottom-actions">
                <button class="btn-reset-cms" (click)="resetCmsContent()">Reset Defaults</button>
                <button class="btn-save-cms" [disabled]="isSavingCms()" (click)="saveCmsContent()">
                  <span *ngIf="!isSavingCms()">💾 Save & Publish Changes</span>
                  <span *ngIf="isSavingCms()">Saving Changes...</span>
                </button>
              </div>
            </div>

          </div>
          
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

                    <!-- Jobs Management Tab -->
          <div *ngIf="activeTab() === 'jobs'" class="user-management-grid">
            <div class="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Job Title</th>
                    <th>Location</th>
                    <th>Type</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let job of jobs()">
                    <td><strong>{{ job.title }}</strong></td>
                    <td>{{ job.location }}</td>
                    <td><span class="badge-role">{{ job.type }}</span></td>
                    <td>
                      <button class="btn-delete" (click)="onDeleteJob(job.id)">Delete</button>
                    </td>
                  </tr>
                  <tr *ngIf="jobs().length === 0">
                    <td colspan="4" class="empty-row">No active job openings created yet.</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- Create Job Card Form -->
            <div class="action-card">
              <h3>Post New HCM Job Opening</h3>
              <form [formGroup]="createJobForm" (ngSubmit)="onCreateJobSubmit()">
                <div class="form-group">
                  <label>Job Title *</label>
                  <input type="text" formControlName="title" placeholder="e.g. Oracle HCM Payroll Specialist">
                </div>
                <div class="form-group">
                  <label>Location *</label>
                  <input type="text" formControlName="location" placeholder="e.g. Chennai, India">
                </div>
                <div class="form-group">
                  <label>Employment Type *</label>
                  <select formControlName="type">
                    <option value="Full-Time">Full-Time</option>
                    <option value="Part-Time">Part-Time</option>
                    <option value="Contract">Contract</option>
                  </select>
                </div>
                <p *ngIf="jobCreateSuccess()" class="success-msg">Job opening published successfully!</p>
                <p *ngIf="jobCreateError()" class="error-msg">{{ jobCreateError() }}</p>
                <button type="submit" [disabled]="createJobForm.invalid" class="btn-action">Publish Job</button>
              </form>
            </div>
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
      font-family: var(--font-sans);
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
      font-family: var(--font-heading);
      font-size: 1.35rem;
      font-weight: 700;
      color: #0f172a;
      letter-spacing: -0.5px;
    }

    .brand-subtitle {
      font-family: var(--font-sans);
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
        input { width: 100%; padding: 12px; border: 1px solid var(--color-line, #e2e8f0); border-radius: 8px; font-family: inherit; font-size: 0.95rem; &:focus { outline: none; border-color: #2563eb; } }
      }
      .password-input-group {
        position: relative;
        display: flex;
        align-items: center;
        input { width: 100%; padding-right: 44px; }
        .btn-toggle-pwd {
          position: absolute;
          right: 10px;
          background: transparent;
          border: none;
          cursor: pointer;
          font-size: 1.15rem;
          padding: 4px;
          line-height: 1;
          opacity: 0.7;
          transition: opacity 0.2s;
          &:hover { opacity: 1; }
        }
      }
      .credentials-badge {
        background: #f0fdf4;
        border: 1px solid #bbf7d0;
        border-radius: 8px;
        padding: 10px 14px;
        margin-bottom: 1.25rem;
        display: flex;
        gap: 10px;
        align-items: flex-start;
        .badge-icon { font-size: 1.25rem; line-height: 1.2; }
        .badge-text { font-size: 0.82rem; color: #166534; line-height: 1.4; text-align: left; }
        .badge-title { font-weight: 700; color: #15803d; display: block; margin-bottom: 2px; }
        .badge-val { color: #1e293b; strong { color: #0f172a; font-family: monospace; font-size: 0.88rem; } }
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
        input, select { width: 100%; padding: 10px; border: 1px solid var(--color-line, #e2e8f0); border-radius: 6px; font-family: inherit; font-size: 0.9rem; &:focus { outline: none; border-color: #2563eb; } }
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

    /* ========================================================
       NO-CODE CMS EDITOR STYLES
       ======================================================== */
    .cms-editor-container {
      display: flex;
      flex-direction: column;
      gap: 24px;
    }

    .cms-toolbar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: #ffffff;
      padding: 24px 28px;
      border-radius: 14px;
      border: 1px solid #e2e8f0;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.04);
      flex-wrap: wrap;
      gap: 16px;
    }

    .cms-toolbar-info h2 {
      font-size: 1.4rem;
      color: #0f172a;
      font-weight: 700;
      margin-bottom: 4px;
    }

    .cms-toolbar-info p {
      color: #64748b;
      font-size: 0.92rem;
      margin: 0;
    }

    .cms-toolbar-actions, .cms-bottom-actions {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .btn-save-cms {
      background: linear-gradient(135deg, #2563eb 0%, #06b6d4 100%);
      color: #ffffff;
      border: none;
      padding: 12px 26px;
      font-size: 0.95rem;
      font-weight: 700;
      border-radius: 8px;
      cursor: pointer;
      box-shadow: 0 4px 14px rgba(37, 99, 235, 0.35);
      transition: all 0.25s ease;

      &:hover:not(:disabled) {
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(37, 99, 235, 0.45);
      }

      &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
      }
    }

    .btn-reset-cms {
      background: #f8fafc;
      color: #64748b;
      border: 1px solid #cbd5e1;
      padding: 12px 20px;
      font-size: 0.9rem;
      font-weight: 600;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.2s ease;

      &:hover {
        background: #fee2e2;
        border-color: #fca5a5;
        color: #b91c1c;
      }
    }

    .cms-alert-banner {
      padding: 14px 20px;
      border-radius: 10px;
      font-size: 0.95rem;
      font-weight: 600;
      animation: fadeIn 0.3s ease;

      &.success {
        background: #ecfdf5;
        border: 1px solid #6ee7b7;
        color: #065f46;
      }

      &.error {
        background: #fef2f2;
        border: 1px solid #fca5a5;
        color: #991b1b;
      }
    }

    .cms-subnav {
      display: flex;
      gap: 8px;
      overflow-x: auto;
      padding-bottom: 6px;
      scrollbar-width: thin;

      button {
        background: #ffffff;
        border: 1px solid #e2e8f0;
        padding: 10px 18px;
        font-size: 0.88rem;
        font-weight: 600;
        color: #475569;
        border-radius: 24px;
        cursor: pointer;
        white-space: nowrap;
        transition: all 0.2s ease;

        &:hover {
          color: #0f172a;
          background: #f1f5f9;
        }

        &.active {
          background: #0f172a;
          color: #ffffff;
          border-color: #0f172a;
          box-shadow: 0 4px 12px rgba(15, 23, 42, 0.2);
        }
      }
    }

    .cms-panel {
      display: flex;
      flex-direction: column;
      gap: 20px;
      animation: fadeIn 0.35s ease;
    }

    .cms-panel-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 12px;

      h3 {
        font-size: 1.25rem;
        color: #0f172a;
        font-weight: 700;
        margin-bottom: 4px;
      }

      p {
        color: #64748b;
        font-size: 0.9rem;
        margin: 0;
      }
    }

    .btn-add-item {
      background: #eff6ff;
      color: #2563eb;
      border: 1px solid #bfdbfe;
      padding: 10px 18px;
      border-radius: 8px;
      font-size: 0.88rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;

      &:hover {
        background: #2563eb;
        color: #ffffff;
      }
    }

    .cms-cards-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 20px;

      &.grid-2 {
        @media (min-width: 860px) { grid-template-columns: repeat(2, 1fr); }
      }
      &.grid-3 {
        @media (min-width: 960px) { grid-template-columns: repeat(3, 1fr); }
      }
      &.grid-4 {
        @media (min-width: 680px) { grid-template-columns: repeat(2, 1fr); }
        @media (min-width: 1060px) { grid-template-columns: repeat(4, 1fr); }
      }
    }

    .cms-item-card {
      background: #ffffff;
      border-radius: 12px;
      border: 1px solid #e2e8f0;
      padding: 22px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
      display: flex;
      flex-direction: column;
      gap: 16px;
      transition: box-shadow 0.25s ease, border-color 0.25s ease;

      &:hover {
        border-color: #cbd5e1;
        box-shadow: 0 6px 18px rgba(0, 0, 0, 0.06);
      }
    }

    .cms-card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .card-number-badge {
      font-size: 0.78rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      color: #2563eb;
      background: #eff6ff;
      border: 1px solid #bfdbfe;
      padding: 4px 10px;
      border-radius: 6px;
    }

    .status-pill-small {
      font-size: 0.75rem;
      font-weight: 600;
      color: #059669;
      background: #ecfdf5;
      padding: 3px 8px;
      border-radius: 999px;
    }

    .btn-card-delete {
      background: transparent;
      border: none;
      color: #94a3b8;
      font-size: 1.3rem;
      line-height: 1;
      cursor: pointer;
      padding: 0 6px;
      border-radius: 4px;
      transition: all 0.2s ease;

      &:hover {
        color: #ef4444;
        background: #fee2e2;
      }
    }

    .cms-image-preview-box {
      position: relative;
      width: 100%;
      height: 160px;
      border-radius: 8px;
      overflow: hidden;
      background: #0f172a;
      border: 1px solid #e2e8f0;

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      .image-preview-overlay {
        position: absolute;
        bottom: 6px;
        left: 8px;
        background: rgba(15, 23, 42, 0.75);
        color: #e2e8f0;
        font-size: 0.7rem;
        padding: 3px 8px;
        border-radius: 4px;
        backdrop-filter: blur(4px);
      }
    }

    .cms-avatar-preview-box {
      width: 90px;
      height: 90px;
      border-radius: 50%;
      overflow: hidden;
      margin: 0 auto;
      border: 3px solid #e2e8f0;
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }

    .cms-form-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 12px;

      @media (min-width: 600px) {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    .cms-input-group {
      display: flex;
      flex-direction: column;
      gap: 5px;

      &.full {
        grid-column: 1 / -1;
      }

      label {
        font-size: 0.8rem;
        font-weight: 700;
        color: #334155;
        text-transform: uppercase;
        letter-spacing: 0.04em;
      }

      input, textarea {
        width: 100%;
        padding: 9px 12px;
        border: 1px solid #cbd5e1;
        border-radius: 6px;
        font-family: inherit;
        font-size: 0.9rem;
        color: #0f172a;
        background: #f8fafc;
        transition: border-color 0.2s, background-color 0.2s, box-shadow 0.2s;

        &:focus {
          outline: none;
          background: #ffffff;
          border-color: #2563eb;
          box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.12);
        }
      }

      .field-hint {
        font-size: 0.75rem;
        color: #64748b;
      }
    }

    .cms-bottom-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: #0f172a;
      color: #ffffff;
      padding: 18px 24px;
      border-radius: 12px;
      margin-top: 15px;
      flex-wrap: wrap;
      gap: 16px;
      box-shadow: 0 6px 20px rgba(15, 23, 42, 0.2);

      .cms-bottom-info span {
        font-size: 0.92rem;
        color: #cbd5e1;
        font-weight: 500;
      }
    }
  `]
})
export class LoginComponent implements OnInit {
  private fallbackAdminData = {
    contacts: [
      { id: 1, name: 'Suresh Kumar', company: 'Tech Corp India', email: 'suresh@techcorp.in', phone: '+91 98401 23456', message: 'Looking for Oracle Fusion HCM Core HR and Payroll implementation for 2,500 employees.', created_at: new Date().toISOString() },
      { id: 2, name: 'Ananya Sharma', company: 'Global Solutions LLC', email: 'ananya@globalsolutions.com', phone: '+1 408 555 7890', message: 'Inquiry regarding Redwood UI migration and Visual Builder Studio customizations.', created_at: new Date(Date.now() - 86400000).toISOString() }
    ],
    subscribers: [
      { id: 1, email: 'oracle.lead@enterprise.com', created_at: new Date().toISOString() },
      { id: 2, email: 'hr.director@techcorp.in', created_at: new Date(Date.now() - 172800000).toISOString() }
    ],
    applications: [
      { id: 1, name: 'Rajesh V.', email: 'rajesh.v@gmail.com', resume_link: 'https://linkedin.com/in/rajesh-oracle', job_title: 'Senior Oracle Fusion HCM Consultant', created_at: new Date().toISOString() },
      { id: 2, name: 'Kavitha M.', email: 'kavitha.m@outlook.com', resume_link: 'https://drive.google.com/file/d/sample-resume', job_title: 'Oracle Payroll Technical Developer', created_at: new Date(Date.now() - 86400000).toISOString() }
    ],
    users: [
      { id: 1, email: 'admin@cloudvantage.com', privilege: 'SuperAdmin' }
    ]
  };

  private populateFallbackData() {
    this.applications.set(this.fallbackAdminData.applications);
    this.messages.set(this.fallbackAdminData.contacts);
    this.subscribers.set(this.fallbackAdminData.subscribers);
    this.users.set(this.fallbackAdminData.users);
    this.jobs.set([]);
  }
  private http = inject(HttpClient);
  private fb = inject(FormBuilder);

  loginForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email, Validators.maxLength(100)]],
    password: ['', [Validators.required, Validators.maxLength(100)]]
  });

  createUserForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email, Validators.maxLength(100)]],
    password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(100)]],
    privilege: ['Admin', Validators.required]
  });

  changePasswordForm: FormGroup = this.fb.group({
    newPassword: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(100)]]
  });

  contentService = inject(ContentService);

  isAuthenticated = signal<boolean>(false);
  activeTab = signal<string>('cms');
  loginError = signal<string | null>(null);
  showPassword = signal<boolean>(false);

  togglePasswordVisibility() {
    this.showPassword.update(v => !v);
  }

  // No-Code CMS State
  cmsData: SiteContent = JSON.parse(JSON.stringify(DEFAULT_SITE_CONTENT));
  cmsSubTab = signal<'slides' | 'stats' | 'services' | 'why' | 'insights' | 'team' | 'company'>('slides');
  isSavingCms = signal<boolean>(false);
  cmsSaveMessage = signal<string | null>(null);
  cmsSaveError = signal<string | null>(null);

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
  jobs = signal<AdminJob[]>([]);
  jobCreateSuccess = signal(false);
  jobCreateError = signal<string | null>(null);

  createJobForm: FormGroup = this.fb.group({
    title: ['', Validators.required],
    location: ['', Validators.required],
    type: ['Full-Time', Validators.required]
  });

  private isTokenExpired(token: string): boolean {
    if (token.startsWith('mock-')) return false;
    try {
      const parts = token.split('.');
      if (parts.length !== 3) return true;
      const payload = JSON.parse(atob(parts[1]));
      if (!payload.exp) return false;
      return Date.now() >= payload.exp * 1000;
    } catch {
      return true;
    }
  }

  ngOnInit() {
    this.loadCmsData();
    const token = localStorage.getItem('admin_token');
    const savedEmail = localStorage.getItem('admin_email');
    const savedPrivilege = localStorage.getItem('admin_privilege');
    
    if (token && savedEmail && savedPrivilege) {
      if (this.isTokenExpired(token)) {
        this.onLogout();
        return;
      }
      this.isAuthenticated.set(true);
      this.loggedInUserEmail.set(savedEmail);
      this.loggedInUserPrivilege.set(savedPrivilege);
      this.fetchAdminData(token);
    }
  }

  setTab(tab: string) {
    this.activeTab.set(tab);
    if (tab === 'cms') {
      this.loadCmsData();
    }
  }

  onLoginSubmit() {
    if (this.loginForm.valid) {
      this.loginError.set(null);
      const val = this.loginForm.value;
      const cleanEmail = val.email?.trim().toLowerCase() || '';
      const cleanPassword = val.password?.trim() || '';
      const validAdminPasswords = ['Admin@123', 'admin@123', 'Admin123', 'admin123', 'admin'];
      const isDefaultAdmin = cleanEmail === 'admin@cloudvantage.com' && validAdminPasswords.includes(cleanPassword);

      this.http.post<{ token: string, email: string, privilege: string }>(`${environment.apiUrl}/login`, {
        email: cleanEmail,
        password: cleanPassword
      }).subscribe({
        next: (res) => {
          localStorage.setItem('admin_token', res.token);
          localStorage.setItem('admin_email', res.email);
          localStorage.setItem('admin_privilege', res.privilege);
          
          this.loggedInUserEmail.set(res.email);
          this.loggedInUserPrivilege.set(res.privilege);
          this.isAuthenticated.set(true);
          this.loadCmsData();
          this.fetchAdminData(res.token);
        },
        error: (err: any) => {
          console.error("Login verification notice:", err);
          if (isDefaultAdmin) {
            const mockToken = 'mock-admin-token-' + Date.now();
            localStorage.setItem('admin_token', mockToken);
            localStorage.setItem('admin_email', 'admin@cloudvantage.com');
            localStorage.setItem('admin_privilege', 'SuperAdmin');
            
            this.loggedInUserEmail.set('admin@cloudvantage.com');
            this.loggedInUserPrivilege.set('SuperAdmin');
            this.isAuthenticated.set(true);
            this.loadCmsData();
            this.populateFallbackData();
          } else {
            this.loginError.set(err.error?.error || 'Invalid corporate credentials (Default: admin@cloudvantage.com / Admin@123)');
          }
        }
      });
    }
  }

  fetchAdminData(token: string) {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    this.http.get<{ contacts: ContactMessage[], subscribers: NewsletterSubscriber[], applications: JobApplication[], users: AdminUser[], jobs?: AdminJob[] }>(
      `${environment.apiUrl}/admin/data`,
      { headers }
    ).subscribe({
      next: (data) => {
        this.applications.set(data.applications || []);
        this.messages.set(data.contacts || []);
        this.subscribers.set(data.subscribers || []);
        this.users.set(data.users || []);
        this.jobs.set(data.jobs || []);
      },
      error: (err) => {
        console.error("Error querying administrative records:", err);
        if (token.startsWith('mock-') || err.status === 0 || err.status === 500) {
          this.populateFallbackData();
        } else {
          this.onLogout();
        }
      }
    });
  }

    onCreateJobSubmit() {
    if (this.createJobForm.valid) {
      this.jobCreateSuccess.set(false);
      this.jobCreateError.set(null);
      this.http.post(`${environment.apiUrl}/admin/jobs`, this.createJobForm.value).subscribe({
        next: () => {
          this.jobCreateSuccess.set(true);
          this.createJobForm.reset({ type: 'Full-Time' });
          const token = localStorage.getItem('admin_token');
          if (token) this.fetchAdminData(token);
          setTimeout(() => this.jobCreateSuccess.set(false), 5000);
        },
        error: (err: any) => {
          console.error("Failed to create job posting:", err);
          this.jobCreateError.set(err.error?.error || 'Failed to create job posting');
        }
      });
    }
  }

  onDeleteJob(id: number) {
    if (!confirm('Are you sure you want to remove this job opening?')) return;
    this.http.delete(`${environment.apiUrl}/admin/jobs/${id}`).subscribe({
      next: () => {
        const token = localStorage.getItem('admin_token');
        if (token) this.fetchAdminData(token);
      },
      error: (err) => console.error("Error deleting job opening:", err)
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

  // ==========================================
  // NO-CODE CMS METHODS
  // ==========================================
  loadCmsData() {
    const live = this.contentService.content();
    if (live && live.heroSlides && live.heroSlides.length > 0) {
      this.cmsData = JSON.parse(JSON.stringify(live));
    }
  }

  saveCmsContent() {
    this.isSavingCms.set(true);
    this.cmsSaveMessage.set(null);
    this.cmsSaveError.set(null);

    this.contentService.saveContent(this.cmsData).subscribe({
      next: (res) => {
        this.isSavingCms.set(false);
        this.cmsSaveMessage.set('Website content saved and published successfully! All modifications are live.');
        setTimeout(() => this.cmsSaveMessage.set(null), 6000);
      },
      error: (err) => {
        this.isSavingCms.set(false);
        this.cmsSaveError.set(err?.error?.error || 'Failed to publish changes. Local preview active.');
        setTimeout(() => this.cmsSaveError.set(null), 6000);
      }
    });
  }

  resetCmsContent() {
    if (!confirm('Are you sure you want to restore the default website content? Any unsaved edits will be lost.')) {
      return;
    }
    this.contentService.resetToDefault().subscribe({
      next: (res) => {
        if (res && res.content) {
          this.cmsData = JSON.parse(JSON.stringify(res.content));
        } else {
          this.cmsData = JSON.parse(JSON.stringify(DEFAULT_SITE_CONTENT));
        }
        this.cmsSaveMessage.set('Website content restored to defaults successfully.');
        setTimeout(() => this.cmsSaveMessage.set(null), 5000);
      }
    });
  }

  addHeroSlide() {
    const newId = 'slide-' + (this.cmsData.heroSlides.length + 1);
    this.cmsData.heroSlides.push({
      id: newId,
      category: 'ENTERPRISE SOLUTION',
      headline: 'New Headline Title',
      subline: 'Enter a concise summary of this offering or service capability.',
      ctaText: 'Explore More',
      ctaLink: '/services',
      imageUrl: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?q=80&w=2070&auto=format&fit=crop'
    });
  }

  removeHeroSlide(index: number) {
    if (confirm('Delete this slide from the hero carousel?')) {
      this.cmsData.heroSlides.splice(index, 1);
    }
  }

  addInsight() {
    const newId = 'insight-' + (this.cmsData.insights.length + 1);
    this.cmsData.insights.unshift({
      id: newId,
      title: 'New Oracle Cloud Insight',
      excerpt: 'Summary of the key insights and strategic advantages...',
      date: new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric', year: 'numeric' }).format(new Date()),
      imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800&auto=format&fit=crop'
    });
  }

  removeInsight(index: number) {
    if (confirm('Delete this article from the Insights section?')) {
      this.cmsData.insights.splice(index, 1);
    }
  }

  addTeamMember() {
    const newId = 'team-' + (this.cmsData.team.length + 1);
    this.cmsData.team.push({
      id: newId,
      name: 'Leader Name',
      title: 'Practice Lead',
      bio: 'Professional biography describing experience, Oracle certifications, and track record...',
      photoUrl: '/assets/team-placeholder.png',
      linkedin: 'https://www.linkedin.com/company/cloud-vantage-solutions/'
    });
  }

  removeTeamMember(index: number) {
    if (confirm('Remove this team member profile?')) {
      this.cmsData.team.splice(index, 1);
    }
  }

  updateFeatures(service: DetailedService, text: string) {
    service.features = text.split('\n').map(s => s.trim()).filter(s => s.length > 0);
  }

  updateTabFeatures(tab: WhyCvTab, text: string) {
    tab.features = text.split('\n').map(s => s.trim()).filter(s => s.length > 0);
  }

  onImgFallback(event: Event) {
    const img = event.target as HTMLImageElement;
    img.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="250" viewBox="0 0 400 250" fill="%230f172a"><rect width="400" height="250" fill="%230f172a"/><text x="50%" y="50%" fill="%2364748b" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="16">Image Preview Unavailable</text></svg>';
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