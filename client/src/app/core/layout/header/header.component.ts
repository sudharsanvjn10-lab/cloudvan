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
        
        <a routerLink="/" class="brand-container">
          <div class="logo-wrapper">
            <img src="/assets/logo.png" alt="Cloud Vantage Logo" class="brand-logo">
          </div>
          <span class="brand-text">Cloud Vantage</span>
        </a>

        <nav class="desktop-nav">
          <a routerLink="/about" routerLinkActive="active">About Us</a>
          <a routerLink="/services" routerLinkActive="active">Services</a>
          <a routerLink="/insights" routerLinkActive="active">Insights</a>
          <a routerLink="/careers" routerLinkActive="active">Careers</a>
          <a routerLink="/contact" class="nav-btn">Contact Us</a>
        </nav>

        <a href="https://partner-finder.oracle.com/?CompanyNumber=4-101008251043&page=shell&shell=partner-finder&partner-finder=partner-finder-profile" 
           target="_blank" class="oracle-partner-link">
          <img src="/assets/oracle-partner.png" alt="Oracle Partner Badge" class="oracle-badge">
        </a>

        <button class="hamburger" (click)="toggleMenu()" aria-label="Toggle navigation menu">
          <span></span><span></span><span></span>
        </button>
      </div>

      <div class="mobile-drawer" [class.open]="isMobileMenuOpen">
        <div class="drawer-header">
          <div class="brand-container" style="gap: 8px;">
            <div class="logo-wrapper" style="width: 32px; height: 32px;">
              <img src="/assets/logo.png" alt="Cloud Vantage Logo" class="brand-logo">
            </div>
            <span class="logo-text">Cloud <span style="color: var(--color-accent, #00a8cc);">Vantage</span></span>
          </div>
          <button class="close-btn" (click)="toggleMenu()" aria-label="Close menu">&times;</button>
        </div>
        <nav class="mobile-nav" (click)="toggleMenu()">
          <a routerLink="/">Home</a>
          <a routerLink="/about">About Us</a>
          <a routerLink="/services">Oracle Services</a>
          <a routerLink="/insights">Insights</a>
          <a routerLink="/careers">Careers</a>
          <a routerLink="/contact">Contact Us</a>
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
      transition: all 0.3s ease;
    }
    
    header.scrolled {
      background: #001f3f; /* Dark navy fallback if CSS variables fail */
      background: var(--color-primary, #001f3f);
      padding: 12px 0;
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    }
    
    .header-inner {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
      gap: 20px; /* Ensures elements don't crash into each other on smaller screens */
    }
    
    /* --- Left: Circular Brand Styling --- */
    .brand-container {
      display: flex;
      align-items: center;
      gap: 12px;
      text-decoration: none;
      flex-shrink: 0; /* Prevents container from squishing */
    }

    /* The Circular Wrapper trick */
    .logo-wrapper {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      overflow: hidden;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #ffffff; /* White background to make dark logos visible */
      border: 2px solid rgba(255, 255, 255, 0.2);
      flex-shrink: 0;
    }

    .brand-logo {
      width: 100%;
      height: 100%;
      object-fit: contain; /* Ensures the whole logo is visible inside the circle */
      display: block;
    }

    .brand-text {
      font-size: 1.5rem;
      font-weight: 700;
      color: #ffffff;
      white-space: nowrap;
      letter-spacing: -0.5px;
    }
    
    /* --- Right: Oracle Badge --- */
    .oracle-partner-link {
      display: none; /* Hide on very small mobile screens */
      align-items: center;
      flex-shrink: 0;
      transition: transform 0.2s ease;
    }

    /* Show badge on tablets and larger */
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
      border-radius: 4px;
      /* Subtle drop shadow to make it pop against the dark background */
      filter: drop-shadow(0px 2px 4px rgba(0,0,0,0.3)); 
    }

    /* --- Center: Desktop Navigation --- */
    .desktop-nav {
      display: none;
      align-items: center;
      gap: 28px;
    }
    
    @media (min-width: 1024px) {
      .desktop-nav {
        display: flex;
      }
    }
    
    .desktop-nav a {
      color: #f8fafc; /* Very light gray/white */
      font-weight: 500;
      font-size: 0.95rem;
      text-decoration: none;
      transition: color 0.2s ease;
    }

    .desktop-nav a:hover,
    .desktop-nav a.active {
      color: #00a8cc; /* Teal accent */
      color: var(--color-accent, #00a8cc);
    }

    .desktop-nav .nav-btn {
      background: #00a8cc;
      background: var(--color-accent, #00a8cc);
      color: #ffffff !important;
      padding: 10px 20px;
      border-radius: 6px;
      font-weight: 600;
      transition: background 0.2s ease, transform 0.2s ease;
    }

    .desktop-nav .nav-btn:hover {
      background: #008eb3;
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
      background: #ffffff;
      z-index: 1002;
      transition: right 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      padding: 30px 24px;
      box-shadow: -5px 0 15px rgba(0,0,0,0.05);
    }
    
    .mobile-drawer.open {
      right: 0;
    }

    .drawer-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 40px;
      border-bottom: 1px solid #f1f5f9;
      padding-bottom: 20px;
    }

    .drawer-header .logo-text {
      color: #001f3f;
      font-weight: 700;
      font-size: 1.25rem;
    }

    .close-btn {
      background: none;
      border: none;
      font-size: 2.5rem;
      cursor: pointer;
      color: #64748b;
      line-height: 1;
    }

    .mobile-nav {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .mobile-nav a {
      color: #0f172a;
      font-size: 1.15rem;
      font-weight: 600;
      text-decoration: none;
      padding: 8px 0;
      transition: color 0.2s ease;
    }

    .mobile-nav a:hover {
      color: #00a8cc;
    }

    .overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100vh;
      background: rgba(0, 21, 41, 0.6);
      backdrop-filter: blur(2px); /* Modern blur effect */
      z-index: 1001;
    }
  `]
})
export class HeaderComponent implements OnInit {
  isScrolled = false;
  isMobileMenuOpen = false;
  isHomePage = true;
  private router = inject(Router);

  ngOnInit() {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      // Determine if we are on the root URL or /home to handle background transparency
      this.isHomePage = event.urlAfterRedirects === '/' || event.urlAfterRedirects === '/home';
    });
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    // Add background color when scrolled down 50px
    this.isScrolled = window.scrollY > 50;
  }

  toggleMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
    // Prevent background scrolling when mobile menu is open
    document.body.style.overflow = this.isMobileMenuOpen ? 'hidden' : 'auto';
  }
}