import { Component, HostListener, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <header [class.scrolled]="isScrolled || !isHomePage">
      <div class="container header-inner">

        <a routerLink="/" class="brand-container" (click)="onHomeClick($event)">
          <div class="logo-wrapper">
            <img src="/assets/logo.png" alt="Cloud Vantage Logo" class="brand-logo">
          </div>
          <span class="brand-text">
            <span class="first-line">Cloud Vantage</span>
            <span class="second-line">Solutions</span>
          </span>
        </a>

        <nav class="desktop-nav">
          <a routerLink="/about" routerLinkActive="active">About Us</a>
          <a routerLink="/services" routerLinkActive="active">Services</a>
          <a routerLink="/insights" routerLinkActive="active">Insights</a>
          <a routerLink="/careers" routerLinkActive="active">Careers</a>
          <a routerLink="/contact" class="nav-btn action-btn">Contact Us</a>
        </nav>

        <div class="right-actions">

          <a routerLink="/login" *ngIf="!isLoggedIn" class="internal-login-btn action-btn" title="Employee Login">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
            </svg>
            <span>Login</span>
          </a>

          <a routerLink="/login" *ngIf="isLoggedIn" class="internal-login-btn action-btn" title="Admin Dashboard" style="border-color:#2563eb; background:rgba(37,99,235,0.15);">
            <span>Dashboard</span>
          </a>

          <button (click)="onLogout()" *ngIf="isLoggedIn" class="internal-login-btn action-btn" title="Log Out" style="border-color:#ef4444; background:rgba(239,68,68,0.15); cursor:pointer;">
            <span>Log Out</span>
          </button>

          <a href="https://partner-finder.oracle.com/?CompanyNumber=4-101008251043&page=shell&shell=partner-finder&partner-finder=partner-finder-profile" 
             target="_blank" class="oracle-partner-link">
            <img src="/assets/oracle-partner.png" alt="Oracle Partner Badge" class="oracle-badge">
          </a>

          <button class="hamburger" (click)="toggleMenu()" aria-label="Toggle navigation menu">
            <span></span><span></span><span></span>
          </button>
        </div>

      </div>

      <div class="mobile-drawer" [class.open]="isMobileMenuOpen">
        <div class="drawer-header">
          <div class="brand-container" style="gap: 8px;">
            <div class="logo-wrapper" style="width: 80px; height: 80px; border: none;">
              <img src="/assets/logo.png" alt="Cloud Vantage Logo" class="brand-logo" style="filter: none;">
            </div>
            <span class="logo-text" style="display: flex; flex-direction: column; align-items: flex-start; line-height: 1.15;">
              <span style="font-weight: 700;">Cloud <span style="color: var(--color-accent, #2563EB);">Vantage</span></span>
              <span style="font-size: 0.55em; font-weight: 600; color: #64748b; text-transform: none; margin-left: 56px;">Solutions</span>
            </span>
          </div>
          <button class="close-btn" (click)="toggleMenu()" aria-label="Close menu">&times;</button>
        </div>
        <nav class="mobile-nav" (click)="toggleMenu()">
          <a routerLink="/" (click)="onHomeClick($event)">Home</a>
          <a routerLink="/about">About Us</a>
          <a routerLink="/services">Services</a>
          <a routerLink="/insights">Insights</a>
          <a routerLink="/careers">Careers</a>
          <a routerLink="/contact">Contact Us</a>

          <a routerLink="/login" *ngIf="!isLoggedIn" class="mobile-login-link">
             <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
            </svg>
            Login
          </a>

          <a routerLink="/login" *ngIf="isLoggedIn" class="mobile-login-link" style="color:#2563eb !important;">
            Dashboard
          </a>

          <button type="button" (click)="onLogout($event)" *ngIf="isLoggedIn" class="mobile-login-link mobile-logout-btn" style="color:#ef4444 !important; background:none; border:none; width:100%; text-align:left; font-size:inherit; font-family:inherit; cursor:pointer; padding: 12px 0;">
            Log Out
          </button>
        </nav>
      </div>
      <div class="overlay" *ngIf="isMobileMenuOpen" (click)="toggleMenu()"></div>
    </header>
  `,
  styles: [`
    /* --- Base Header Layout --- */
    header {
      position: fixed;
      top: 0;
      width: 100%;
      z-index: 1000;
      background: transparent;
      padding: 24px 0;
      transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
    }

    header.scrolled {
      background: rgba(30, 41, 59, 0.75); /* Slate transparent */
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      padding: 12px 0;
      box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
    }

    .header-inner {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
      gap: 20px;
    }

    /* --- Left: Circular Brand Styling --- */
    .brand-container {
      display: flex;
      align-items: center;
      gap: 12px;
      text-decoration: none;
      flex-shrink: 0;
    }

    .logo-wrapper {
      height: 60px;
      padding: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(255, 255, 255, 0.04); 
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 10px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      flex-shrink: 0;
      transition: all 0.3s ease;
    }

    .brand-logo {
      height: 100%;
      width: auto;
      object-fit: contain;
      display: block;
      filter: drop-shadow(0px 0px 3px rgba(255, 255, 255, 0.7)); 
      transition: transform 0.3s ease;
    }

    .brand-text {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      line-height: 1.15;
    }

    .first-line {
      font-size: 1.4rem;
      font-weight: 700;
      color: #ffffff;
      white-space: nowrap;
      letter-spacing: -0.5px;
      background: linear-gradient(135deg, #ffffff 0%, #cbd5e1 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .second-line {
      font-size: 0.75rem;
      font-weight: 600;
      color: #cbd5e1;
      text-transform: none;
      -webkit-text-fill-color: #cbd5e1; /* Override parent webkit text fill transparent */
      opacity: 0.8;
      margin-left: 75px; /* Offset to start exactly under the V in Vantage */
      margin-top: 1px;
      letter-spacing: 0.5px;
    }

    /* --- Center: Desktop Navigation --- */
    .desktop-nav {
      display: none;
      align-items: center;
      gap: 12px;
    }

    @media (min-width: 1024px) {
      .desktop-nav {
        display: flex;
      }
    }

    .desktop-nav a:not(.action-btn) {
      position: relative;
      color: #cbd5e1;
      font-weight: 600;
      font-size: 0.95rem;
      text-decoration: none;
      padding: 8px 16px;
      border-radius: 6px;
      background: transparent;
      border: 1px solid transparent;
      transition: all 0.3s cubic-bezier(0.2, 0.8, 0.2, 1);
    }

    .desktop-nav a:not(.action-btn):hover,
    .desktop-nav a.active:not(.action-btn) {
      background: rgba(255, 255, 255, 0.08);
      border: 1px solid rgba(255, 255, 255, 0.15);
      color: #38bdf8;
      transform: translateY(-2px);
    }

    .desktop-nav a.active:not(.action-btn)::after {
      content: '';
      position: absolute;
      bottom: -4px;
      left: 12px;
      right: 12px;
      height: 2px;
      background: #38bdf8;
      border-radius: 2px;
      box-shadow: 0 0 10px rgba(56, 189, 248, 0.8);
    }

    /* --- Shared Action Button Styling (Login & Contact Us) --- */
    .action-btn {
      display: flex;
      align-items: center;
      gap: 6px;
      background: rgba(255, 255, 255, 0.06);
      border: 1px solid rgba(255, 255, 255, 0.2);
      padding: 8px 16px;
      border-radius: 6px;
      color: #ffffff !important;
      font-weight: 600;
      font-size: 0.95rem; 
      text-decoration: none;
      transition: all 0.3s cubic-bezier(0.2, 0.8, 0.2, 1);
      flex-shrink: 0;
      backdrop-filter: blur(4px);
    }

    .action-btn:hover {
      background: #2563eb; /* Royal Blue */
      border-color: #2563eb;
      box-shadow: 0 0 20px rgba(37, 99, 235, 0.5);
      transform: translateY(-2px);
      color: #ffffff !important;
    }

    .desktop-nav .nav-btn {
      margin-left: 8px; 
    }

    /* --- Right Actions Wrapper --- */
    .right-actions {
      display: flex;
      align-items: center;
      gap: 15px;
    }

    /* --- Right: Oracle Badge --- */
    .oracle-partner-link {
      display: none;
      align-items: center;
      flex-shrink: 0;
      transition: transform 0.2s ease;
      padding-left: 15px; 
      border-left: 1px solid rgba(255, 255, 255, 0.15);
    }

    @media (min-width: 768px) {
      .oracle-partner-link {
        display: flex;
      }
    }

    .oracle-partner-link:hover {
      transform: translateY(-2px);
    }

    .oracle-badge {
      height: 38px !important;
      width: auto !important;
      display: block !important;
      border-radius: 10px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      filter: drop-shadow(0px 2px 4px rgba(0,0,0,0.3)); 
      transition: all 0.3s ease;
    }

    /* --- Internal Login Button Specifics --- */
    .internal-login-btn {
      display: none;
    }

    @media (min-width: 768px) {
      .internal-login-btn {
        display: flex;
      }
    }

    .internal-login-btn svg {
      width: 16px;
      height: 16px;
      transition: transform 0.3s ease;
    }

    .internal-login-btn:hover svg {
      transform: translateY(-1px);
    }

    /* --- Mobile Elements --- */
    .hamburger {
      display: flex;
      flex-direction: column;
      gap: 6px;
      background: none;
      border: none;
      cursor: pointer;
      padding: 8px;
    }

    @media (min-width: 1024px) {
      .hamburger {
        display: none;
      }
    }

    .hamburger span {
      width: 28px;
      height: 2px;
      background: #ffffff;
      transition: all 0.3s ease;
      border-radius: 2px;
    }

    /* Mobile Drawer */
    .mobile-drawer {
      position: fixed;
      top: 0;
      right: -320px;
      width: 300px;
      height: 100vh;
      background: rgba(15, 23, 42, 0.95); /* Deep ink transparent */
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      z-index: 1002;
      transition: right 0.35s cubic-bezier(0.16, 1, 0.3, 1);
      padding: 30px 24px;
      box-shadow: -10px 0 30px rgba(0,0,0,0.3);
      border-left: 1px solid rgba(255, 255, 255, 0.08);
    }

    .mobile-drawer.open {
      right: 0;
    }

    .drawer-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 40px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
      padding-bottom: 20px;
    }

    .drawer-header .logo-text {
      color: #ffffff;
      font-weight: 700;
      font-size: 1.25rem;
    }

    .close-btn {
      background: none;
      border: none;
      font-size: 2.5rem;
      cursor: pointer;
      color: #94a3b8;
      line-height: 1;
    }

    .mobile-nav {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .mobile-nav a {
      color: #cbd5e1;
      font-size: 1.15rem;
      font-weight: 600;
      text-decoration: none;
      padding: 8px 0;
      transition: color 0.2s ease;
    }

    .mobile-nav a:hover {
      color: #38bdf8;
    }

    .mobile-login-link {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-top: 15px;
      padding-top: 20px !important;
      border-top: 1px solid rgba(255, 255, 255, 0.08);
      color: #94a3b8 !important;
    }

    .mobile-login-link:hover {
      color: #38bdf8 !important;
    }

    .overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100vh;
      background: rgba(15, 23, 42, 0.6);
      backdrop-filter: blur(4px);
      z-index: 1001;
    }
  `]
})
export class HeaderComponent implements OnInit {
  isScrolled = false;
  isMobileMenuOpen = false;
  isHomePage = true;

  private router = inject(Router);

  get isLoggedIn(): boolean {
    return !!localStorage.getItem('admin_token');
  }

  ngOnInit() {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.isHomePage = event.urlAfterRedirects === '/' || event.urlAfterRedirects === '/home';
    });
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.isScrolled = window.scrollY > 50;
  }

  toggleMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
    document.body.style.overflow = this.isMobileMenuOpen ? 'hidden' : 'auto';
  }

  onHomeClick(event: Event) {
    if (this.router.url === '/' || this.router.url === '/home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  onLogout(event?: Event) {
    if (event) event.preventDefault();
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_email');
    localStorage.removeItem('admin_privilege');
    this.router.navigate(['/login']);
  }
}