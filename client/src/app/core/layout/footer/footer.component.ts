import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

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
          <form class="newsletter-form" (submit)="onSubscribe($event)">
            <input type="email" placeholder="Email address" required>
            <button type="submit">→</button>
          </form>
          <div class="social-links">
            <a href="#" aria-label="LinkedIn">IN</a>
            <a href="#" aria-label="Twitter">TW</a>
          </div>
        </div>
      </div>
      <div class="footer-bottom">
        <div class="container">
          <p>&copy; {{ currentYear }} Cloud Vantage Solutions. All Rights Reserved.</p>
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
      gap: 1rem;
      a {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 35px;
        height: 35px;
        background: rgba(255,255,255,0.1);
        border-radius: 50%;
        color: #fff;
        font-size: 0.8rem;
        &:hover { background: var(--color-accent); color: var(--color-primary); }
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
export class FooterComponent {
  currentYear = new Date().getFullYear();

  onSubscribe(event: Event) {
    event.preventDefault();
    alert('Newsletter logic will connect to API here.');
  }
}