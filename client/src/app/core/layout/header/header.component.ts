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
        <a routerLink="/" class="logo">
          <span class="logo-text">Cloud <span>Vantage</span></span>
        </a>

        <nav class="desktop-nav">
          <a routerLink="/about" routerLinkActive="active">About Us</a>
          <a routerLink="/services" routerLinkActive="active">Services</a>
          <a routerLink="/insights" routerLinkActive="active">Insights</a>
          <a routerLink="/careers" routerLinkActive="active">Careers</a>
          <a routerLink="/contact" class="nav-btn">Contact Us</a>
        </nav>

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
      position: fixed;
      top: 0;
      width: 100%;
      z-index: 1000;
      background: transparent;
      padding: 24px 0;
      transition: all var(--transition-speed) ease;

      /* When scrolled OR on an inner page, apply the dark navy background */
      &.scrolled {
        background: var(--color-primary);
        padding: 12px 0;
        box-shadow: 0 4px 12px rgba(0,0,0,0.1);
      }
    }

    .header-inner { display: flex; justify-content: space-between; align-items: center; }
    .logo-text { font-size: 1.5rem; font-weight: 700; color: var(--color-bg-light); span { color: var(--color-accent); } }

    .desktop-nav {
      display: none; align-items: center; gap: 24px;
      @media (min-width: 1024px) { display: flex; }
      a {
        color: var(--color-bg-light); font-weight: 600; font-size: 0.95rem;
        &:hover, &.active { color: var(--color-accent); }
      }
      .nav-btn {
        background: var(--color-accent); color: var(--color-primary);
        padding: 8px 16px; border-radius: 4px;
        &:hover { background: #fff; color: var(--color-primary); }
      }
    }

    .hamburger {
      display: flex; flex-direction: column; gap: 5px; background: none; border: none; cursor: pointer; z-index: 1001;
      @media (min-width: 1024px) { display: none; }
      span { width: 25px; height: 3px; background: #fff; transition: 0.3s; }
    }

    /* Mobile Drawer */
    .mobile-drawer {
      position: fixed; top: 0; right: -300px; width: 300px; height: 100vh; background: #fff; z-index: 1002; transition: right 0.3s ease; padding: 24px;
      &.open { right: 0; }
      .drawer-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; .logo-text { color: var(--color-primary); } .close-btn { background: none; border: none; font-size: 2rem; cursor: pointer; } }
      .mobile-nav { display: flex; flex-direction: column; gap: 1.5rem; a { color: var(--color-primary); font-size: 1.2rem; font-weight: 600; } }
    }
    .overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100vh; background: rgba(0,0,0,0.5); z-index: 1001; }
  `]
})
export class HeaderComponent implements OnInit {
  isScrolled = false;
  isMobileMenuOpen = false;
  isHomePage = true;
  private router = inject(Router);

  ngOnInit() {
    // Listen to router events to determine if we are on the Home page
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
}