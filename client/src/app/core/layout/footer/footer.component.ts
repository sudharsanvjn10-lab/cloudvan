import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <footer>
      <div class="container footer-grid">
        <div class="footer-col">
          <span class="logo-text">Cloud <span>Vantage</span></span>
          <p class="mission">We are committed to providing our customers with exceptional service while offering our employees the best training.</p>
          <div class="address-block">
            <strong>HQ : </strong> Registered Office, Madurai - 625 402, Tamil Nadu, India.<br>
            <strong>Offshore Centers:</strong>Pallikarani, Chennai - 600117, Tamil Nadu, India.<br>
          </div>
          <div class="contact-info">
            <a href="mailto:contact@cloud-vantage.com">contact&#64;cloud-vantage.com</a>
            <a href="tel:+919940098685">+91 99400 98685</a>
          </div>
        </div>

        <div class="footer-col">
          <h3>Business Lines</h3>
          <ul>
            <li><a routerLink="/services">Oracle Fusion HCM</a></li>
            <li><a routerLink="/services">Oracle Fusion ERP</a></li>
            <li><a routerLink="/services">Oracle Fusion SCM</a></li>
            <li><a routerLink="/services">Oracle Fusion EPM</a></li>
            <li><a routerLink="/services">Oracle Fusion CX</a></li>
            <li><a routerLink="/services">Managed Services</a></li>
          </ul>
        </div>

        <div class="footer-col">
          <h3>Quick Links</h3>
          <ul>
            <li><a routerLink="/about">About Us</a></li>
            <li><a routerLink="/services">Oracle Cloud Services</a></li>
            <li><a routerLink="/services">IT Staffing</a></li>
            <li><a routerLink="/insights">Insights & News</a></li>
            <li><a routerLink="/careers">Careers</a></li>
          </ul>
        </div>

        <div class="footer-col">
          <h3>Stay Updated</h3>
          <p>Subscribe to our newsletter for the latest Oracle cloud insights.</p>
          <form class="newsletter-form" (submit)="onSubscribe(emailInput.value, $event); emailInput.value=''">
            <input type="email" #emailInput placeholder="Email address" required>
            <button type="submit">→</button>
          </form>
          <p *ngIf="subscribed" style="color: #4ade80; font-size: 0.85rem; margin-top: 5px;">Subscribed successfully!</p>
          <div class="social-links">
            <a href="https://www.linkedin.com/company/cloud-vantage-solutions/" target="_blank" aria-label="LinkedIn">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                <path d="M0 1.146C0 .513.52 0 1.161 0h13.678C15.48 0 16 .513 16 1.146v13.708c0 .633-.52 1.146-1.161 1.146H1.161C.52 16 0 15.487 0 14.854V1.146zm4.943 12.248V6.169H2.542v7.225h2.401zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248-.822 0-1.359.54-1.359 1.248 0 .694.521 1.248 1.327 1.248h.016zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016a5.54 5.54 0 0 1 .016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225h2.4z"/>
              </svg>
            </a>
            <a href="https://twitter.com/cloud_vantage_s" target="_blank" aria-label="Twitter">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
                <path d="M12.6.75h2.454l-5.36 6.142L16 15.25h-4.937l-3.867-5.07-4.425 5.07H.316l5.733-6.57L0 .75h5.063l3.495 4.633L12.601.75Zm-.86 13.028h1.36L4.323 2.145H2.865l8.875 11.633Z"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
      <div class="footer-bottom">
        <div class="container">
          <p>&copy; {{ currentYear }} Cloud Vantage Solutions. All Rights Reserved. <span *ngIf="visitCount" style="margin-left: 15px; color: rgba(255, 255, 255, 0.65); font-weight: 500; font-size: 0.85rem;">| Page Visits: {{ visitCount }}</span></p>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    footer {
      background-color: var(--color-primary);
      color: var(--color-bg-light);
      padding-top: 4rem;
    }

    .footer-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 3rem;
      padding-bottom: 3rem;

      @media (min-width: 768px) { grid-template-columns: repeat(2, 1fr); }
      @media (min-width: 1024px) { grid-template-columns: 2fr 1fr 1fr 1.5fr; gap: 2rem; }
    }

    .logo-text {
      font-size: 1.5rem;
      font-weight: 700;
      display: block;
      margin-bottom: 1rem;
      span { color: var(--color-accent); }
    }

    .mission { color: #a0aec0; margin-bottom: 1.5rem; }
    .address-block, .contact-info { margin-bottom: 1rem; color: #e2e8f0; font-size: 0.9rem; }
    .contact-info a { display: block; color: var(--color-accent); margin-bottom: 0.5rem; }

    h3 {
      color: #fff;
      font-size: 1.2rem;
      margin-bottom: 1.5rem;
      position: relative;
      padding-bottom: 0.5rem;
      
      &::after {
        content: '';
        position: absolute;
        left: 0;
        bottom: 0;
        width: 30px;
        height: 2px;
        background: var(--color-accent);
      }
    }

    ul {
      list-style: none;
      li {
        margin-bottom: 0.75rem;
        a {
          color: #a0aec0;
          font-size: 0.95rem;
          &:hover { color: var(--color-accent); padding-left: 5px; }
        }
      }
    }

    .newsletter-form {
      display: flex;
      margin-bottom: 1.5rem;

      input {
        flex: 1;
        padding: 10px;
        border: none;
        border-radius: 4px 0 0 4px;
        outline: none;
      }

      button {
        background: var(--color-accent);
        color: var(--color-primary);
        border: none;
        padding: 0 15px;
        border-radius: 0 4px 4px 0;
        cursor: pointer;
        font-weight: bold;
        transition: opacity 0.3s;
        &:hover { opacity: 0.9; }
      }
    }

    .social-links {
      display: flex;
      gap: 1.25rem;
      a {
        display: flex;
        align-items: center;
        justify-content: center;
        background: transparent;
        color: #a0aec0;
        transition: color 0.3s, transform 0.3s;
        &:hover { color: var(--color-accent); transform: translateY(-2px); }
      }
    }

    .footer-bottom {
      background: #061727;
      padding: 1.5rem 0;
      text-align: center;
      p { color: #a0aec0; font-size: 0.875rem; }
    }
  `]
})
export class FooterComponent implements OnInit {
  private http = inject(HttpClient);
  currentYear = new Date().getFullYear();
  subscribed = false;
  visitCount: number | null = null;

  ngOnInit() {
    this.http.post<{ count: number }>(`${environment.apiUrl}/visits`, {}).subscribe({
      next: (res) => {
        this.visitCount = res.count;
      },
      error: (err) => console.error("Error logging visit:", err)
    });
  }

  onSubscribe(email: string, event: Event) {
    event.preventDefault();
    if (!email) return;
    this.http.post(`${environment.apiUrl}/subscribe`, { email }).subscribe({
      next: () => {
        this.subscribed = true;
        setTimeout(() => this.subscribed = false, 5000);
      },
      error: (err) => console.error("Error subscribing to newsletter:", err)
    });
  }
}