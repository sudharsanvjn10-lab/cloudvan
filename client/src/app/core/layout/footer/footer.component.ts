import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { ContentService } from '../../services/content.service';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <footer>
      <div class="container footer-grid">
        <div class="footer-col">
          <span class="logo-text">Cloud <span>Vantage</span> <em class="brand-suffix">solutions</em></span>
          <p class="mission">We are committed to providing our customers with exceptional service while offering our employees the best training.</p>
          <div class="address-block">
            <strong>HQ:</strong> {{ companyInfo().hqAddress }}<br>
            <strong>Offshore Centers:</strong> {{ companyInfo().offshoreAddress }}<br>
          </div>
          <div class="contact-info">
            <a [href]="'mailto:' + companyInfo().email">{{ companyInfo().email }}</a>
            <a [href]="'tel:' + companyInfo().phone">{{ companyInfo().phone }}</a>
          </div>
          <div class="live-row">
            <span class="live-dot" aria-hidden="true"></span>
            <span>Madurai HQ · {{ istTime }} IST</span>
          </div>
        </div>

        <div class="footer-col">
          <h3>Oracle HCM Tracks</h3>
          <ul>
            <li><a routerLink="/services" fragment="core-hr">Core HR & Global HR</a></li>
            <li><a routerLink="/services" fragment="payroll">Payroll & Compensation</a></li>
            <li><a routerLink="/services" fragment="absence">Time & Absence Management</a></li>
            <li><a routerLink="/services" fragment="talent">Talent & Recruiting (ORC)</a></li>
            <li><a routerLink="/services" fragment="redwood">Redwood & VBS Extensions</a></li>
            <li><a routerLink="/services" fragment="integrations">HDL & BI Reporting</a></li>
          </ul>
        </div>

        <div class="footer-col">
          <h3>Quick Links</h3>
          <ul>
            <li><a routerLink="/about">About Us</a></li>
            <li><a routerLink="/services">Oracle Cloud Services</a></li>
            <li><a routerLink="/contact">Contact Us</a></li>
            <li><a routerLink="/insights">Insights & News</a></li>
            <li><a routerLink="/careers">Careers</a></li>
          </ul>
        </div>

        <div class="footer-col">
          <h3>Stay Updated</h3>
          <p class="newsletter-desc">Subscribe to our newsletter for the latest Oracle Fusion HCM insights.</p>
          <form class="newsletter-form" (submit)="onSubscribe(emailInput.value, $event); emailInput.value=''">
            <input type="email" #emailInput placeholder="Email address" aria-label="Corporate email address for newsletter subscription" required>
            <button type="submit">→</button>
          </form>
          <p *ngIf="subscribed" style="color: #16a34a; font-size: 0.85rem; margin-top: 5px; font-weight: 600;">Subscribed successfully!</p>
          <p *ngIf="subscribeError" style="color: #ef4444; font-size: 0.85rem; margin-top: 5px; font-weight: 500;">Unable to subscribe right now. Please try again later.</p>
          <div class="social-links">
            <a href="https://www.linkedin.com/company/cloud-vantage-solutions/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
                <path d="M0 1.146C0 .513.52 0 1.161 0h13.678C15.48 0 16 .513 16 1.146v13.708c0 .633-.52 1.146-1.161 1.146H1.161C.52 16 0 15.487 0 14.854V1.146zm4.943 12.248V6.169H2.542v7.225h2.401zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248-.822 0-1.359.54-1.359 1.248 0 .694.521 1.248 1.327 1.248h.016zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016a5.54 5.54 0 0 1 .016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225h2.4z"/>
              </svg>
            </a>
            <a href="https://twitter.com/cloud_vantage_s" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path d="M12.6.75h2.454l-5.36 6.142L16 15.25h-4.937l-3.867-5.07-4.425 5.07H.316l5.733-6.57L0 .75h5.063l3.495 4.633L12.601.75Zm-.86 13.028h1.36L4.323 2.145H2.865l8.875 11.633Z"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
      <div class="footer-bottom">
        <div class="container">
          <p>&copy; {{ currentYear }} Cloud Vantage Solutions. All Rights Reserved. <span *ngIf="visitCount" style="margin-left: 15px; color: #94a3b8; font-weight: 500; font-size: 0.85rem;">| Page Visits: {{ visitCount }}</span></p>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    footer {
      background-color: #ffffff;
      color: #0f172a;
      padding-top: 4.5rem;
      border-top: 1px solid #e2e8f0;
      font-family: var(--font-sans);
    }

    .footer-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 3rem;
      padding-bottom: 3.5rem;

      @media (min-width: 768px) { grid-template-columns: repeat(2, 1fr); }
      @media (min-width: 1024px) { grid-template-columns: 2fr 1fr 1fr 1.5fr; gap: 2.5rem; }
    }

    .logo-text {
      font-size: 1.55rem;
      font-family: var(--font-heading);
      font-weight: 700;
      display: block;
      margin-bottom: 1rem;
      color: #0f172a;
      letter-spacing: -0.02em;
      span { color: var(--color-accent, #2563eb); }
    }

    .brand-suffix {
      font-style: normal;
      font-weight: 600;
      font-size: 0.6em;
      letter-spacing: 0.16em;
      text-transform: lowercase;
      color: #64748b;
      margin-left: 6px;
      vertical-align: middle;
    }

    .mission {
      color: #334155;
      margin-bottom: 1.5rem;
      line-height: 1.65;
      font-size: 0.95rem;
    }

    .address-block {
      margin-bottom: 1.25rem;
      color: #1e293b;
      font-size: 0.92rem;
      line-height: 1.65;
      strong {
        color: #0f172a;
        font-weight: 700;
      }
    }

    .contact-info {
      margin-bottom: 1.25rem;
      a {
        display: block;
        color: var(--color-accent, #2563eb);
        font-weight: 600;
        font-size: 0.95rem;
        margin-bottom: 0.5rem;
        transition: color 0.2s ease;
        &:hover {
          color: var(--color-accent-hover, #1d4ed8);
          text-decoration: underline;
        }
      }
    }

    .live-row {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      margin-top: 6px;
      padding: 6px 14px;
      border-radius: 999px;
      background: #f1f5f9;
      border: 1px solid #e2e8f0;
      color: #0f172a;
      font-size: 0.85rem;
      font-weight: 600;
    }

    .live-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #16a34a;
      animation: livePulse 2s ease-in-out infinite;
    }

    @keyframes livePulse {
      0%, 100% { box-shadow: 0 0 0 0 rgba(22, 163, 74, 0.5); }
      50% { box-shadow: 0 0 0 6px rgba(22, 163, 74, 0); }
    }

    h3 {
      color: #0f172a;
      font-family: var(--font-heading);
      font-size: 1.15rem;
      font-weight: 700;
      margin-bottom: 1.5rem;
      position: relative;
      padding-bottom: 0.6rem;
      letter-spacing: -0.01em;
      
      &::after {
        content: '';
        position: absolute;
        left: 0;
        bottom: 0;
        width: 32px;
        height: 3px;
        background: var(--color-accent, #2563eb);
        border-radius: 2px;
      }
    }

    ul {
      list-style: none;
      li {
        margin-bottom: 0.85rem;
        a {
          color: #334155;
          font-size: 0.95rem;
          font-weight: 500;
          transition: color 0.2s ease, padding-left 0.2s ease;
          &:hover {
            color: var(--color-accent, #2563eb);
            padding-left: 6px;
          }
        }
      }
    }

    .newsletter-desc {
      color: #334155;
      font-size: 0.95rem;
      line-height: 1.55;
      margin-bottom: 1.25rem;
    }

    .newsletter-form {
      display: flex;
      margin-bottom: 1.5rem;

      input {
        flex: 1;
        padding: 12px 14px;
        border: 1px solid #cbd5e1;
        border-radius: 6px 0 0 6px;
        background: #f8fafc;
        color: #0f172a;
        font-size: 0.95rem;
        outline: none;
        transition: border-color 0.2s, background 0.2s;
        &::placeholder {
          color: #94a3b8;
        }
        &:focus {
          border-color: var(--color-accent, #2563eb);
          background: #ffffff;
        }
      }

      button {
        background: var(--color-accent, #2563eb);
        color: #ffffff;
        border: none;
        padding: 0 18px;
        border-radius: 0 6px 6px 0;
        cursor: pointer;
        font-weight: bold;
        font-size: 1.1rem;
        transition: background 0.2s;
        &:hover {
          background: var(--color-accent-hover, #1d4ed8);
        }
      }
    }

    .social-links {
      display: flex;
      gap: 1rem;
      a {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 38px;
        height: 38px;
        border-radius: 8px;
        background: #f1f5f9;
        border: 1px solid #e2e8f0;
        color: #475569;
        transition: all 0.2s ease;
        &:hover {
          color: #ffffff;
          background: var(--color-accent, #2563eb);
          border-color: var(--color-accent, #2563eb);
          transform: translateY(-2px);
        }
      }
    }

    .footer-bottom {
      background: #0f172a;
      padding: 1.5rem 0;
      text-align: center;
      p {
        color: #94a3b8;
        font-size: 0.875rem;
        span {
          color: #cbd5e1 !important;
        }
      }
    }
  `]
})
export class FooterComponent implements OnInit, OnDestroy {
  private http = inject(HttpClient);
  private contentService = inject(ContentService);
  companyInfo = this.contentService.companyInfo;
  currentYear = new Date().getFullYear();
  subscribed = false;
  subscribeError = false;
  visitCount: number | null = null;
  private clockTimer: any;
  now = new Date();

  get istTime(): string {
    return new Intl.DateTimeFormat('en-IN', {
      timeZone: 'Asia/Kolkata',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    }).format(this.now);
  }

  ngOnInit() {
    this.clockTimer = setInterval(() => (this.now = new Date()), 20000);
    this.http.post<{ count: number }>(`${environment.apiUrl}/visits`, {}).subscribe({
      next: (res) => {
        this.visitCount = res.count;
      },
      error: (err) => console.error("Error logging visit:", err)
    });
  }

  ngOnDestroy() {
    if (this.clockTimer) clearInterval(this.clockTimer);
  }

  onSubscribe(email: string, event: Event) {
    event.preventDefault();
    if (!email) return;
    this.subscribeError = false;
    this.http.post(`${environment.apiUrl}/subscribe`, { email }).subscribe({
      next: () => {
        this.subscribed = true;
        this.subscribeError = false;
        setTimeout(() => this.subscribed = false, 5000);
      },
      error: (err) => {
        console.error("Error subscribing to newsletter:", err);
        this.subscribeError = true;
        setTimeout(() => this.subscribeError = false, 5000);
      }
    });
  }
}
