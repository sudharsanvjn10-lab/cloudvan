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
        <div class="logo-wrapper">
        <a routerLink="/" class="brand-container">
          <img src="/assets/logo.png" alt="Logo" style="display:block; height:100px; width:120px;">
          <span class="brand-text">Cloud Vantage</span>
        </a>
          </div> 
        <nav class="desktop-nav">
          <a routerLink="/about" routerLinkActive="active">About Us</a>
          <a routerLink="/services" routerLinkActive="active">Services</a>
          <a routerLink="/insights" routerLinkActive="active">Insights</a>
          <a routerLink="/careers" routerLinkActive="active">Careers</a>
          <a routerLink="/contact" class="nav-btn">Contact Us</a>
        </nav>

        <a href="https://partner-finder.oracle.com/?CompanyNumber=4-101008251043&page=shell&shell=partner-finder&partner-finder=partner-finder-profile" 
           target="_blank" class="oracle-partner-link">
          <img src="/assets/oracle-partner.png" alt="Oracle Partner" style="display:block; height:70px; width:300px;">
        </a>

        <button class="hamburger" (click)="toggleMenu()">
          <span></span><span></span><span></span>
        </button>
      </div>

      <div class="mobile-drawer" [class.open]="isMobileMenuOpen">
        <div class="drawer-header">
          <span class="logo-text">Cloud <span>Vantage</span></span>
          <button class="close-btn" (click)="toggleMenu()">&times;</button>
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
    header {
      position: fixed; top: 0; width: 100%; z-index: 1000; background: transparent;
      padding: 24px 0; transition: all 0.3s ease;
      &.scrolled { background: var(--color-primary); padding: 12px 0; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
    }
    .header-inner { display: flex; justify-content: space-between; align-items: center; width: 100%; }
    
    /* Brand Styling */
    .brand-container { display: flex; align-items: center; gap: 10px; text-decoration: none; flex-shrink: 0; }
    .brand-logo { height: 40px !important; width: auto !important; display: block !important; flex-shrink: 0; }
    .brand-text { font-size: 1.5rem; font-weight: bold; color: #fff; white-space: nowrap; }
    
    /* Oracle Badge */
    .oracle-partner-link { display: flex; align-items: center; flex-shrink: 0; }
    .oracle-badge { height: 40px !important; width: auto !important; display: block !important; border-radius: 4px; }

    /* Nav */
    .desktop-nav { display: none; align-items: center; gap: 24px; }
    @media (min-width: 1024px) { .desktop-nav { display: flex; } }
    .desktop-nav a { color: var(--color-bg-light); font-weight: 600; font-size: 0.95rem; text-decoration: none; }
    .desktop-nav .nav-btn { background: var(--color-accent); color: var(--color-primary); padding: 8px 16px; border-radius: 4px; }
    
    /* Mobile */
    .hamburger { display: flex; flex-direction: column; gap: 5px; background: none; border: none; cursor: pointer; }
    @media (min-width: 1024px) { .hamburger { display: none; } }
    .hamburger span { width: 25px; height: 3px; background: #fff; }
    .mobile-drawer { position: fixed; top: 0; right: -300px; width: 300px; height: 100vh; background: #fff; z-index: 1002; transition: right 0.3s ease; padding: 24px; &.open { right: 0; } }
  `]
})
export class HeaderComponent implements OnInit {
  isScrolled = false;
  isMobileMenuOpen = false;
  isHomePage = true;
  private router = inject(Router);

  ngOnInit() {
    this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe((event: any) => {
      this.isHomePage = event.urlAfterRedirects === '/' || event.urlAfterRedirects === '/home';
    });
  }
  @HostListener('window:scroll', [])
  onWindowScroll() { this.isScrolled = window.scrollY > 50; }
  toggleMenu() { this.isMobileMenuOpen = !this.isMobileMenuOpen; }
}