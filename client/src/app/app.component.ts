import { Component, OnInit, HostListener } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './core/layout/header/header.component';
import { FooterComponent } from './core/layout/footer/footer.component';
import { fadeAnimation } from './route-animations';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, FooterComponent],
  animations: [fadeAnimation],
  template: `
    <!-- Top Scroll Progress Bar -->
    <div class="scroll-progress-bar" [style.width.%]="scrollProgress"></div>

    <app-header></app-header>

    <!-- Animation Wrapper -->
    <main class="route-workspace" [@routeAnimations]="prepareRoute(outlet)">
      <!-- #outlet reference allows the animation trigger to know when the route changes -->
      <router-outlet #outlet="outlet"></router-outlet>
    </main>

    <!-- Back to Top Button -->
    <button class="back-to-top" [class.show]="showScrollBtn" (click)="scrollToTop()" aria-label="Scroll back to top">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="18 15 12 9 6 15"></polyline>
      </svg>
    </button>

    <app-footer></app-footer>
  `,
  styles: [`
    .scroll-progress-bar {
      position: fixed;
      top: 0;
      left: 0;
      height: 3px;
      background: linear-gradient(90deg, #2563eb, #06b6d4);
      z-index: 10002;
      transition: width 0.1s ease-out;
    }

    .route-workspace {
      /* Crucial: Keeps the fading-out page locked to the top of this container */
      position: relative;
      display: block;
      width: 100%;

      /* Stops any side-to-side jitter or scrollbar flashing during the crossfade */
      overflow: hidden;

      /* Ensures the footer stays pushed to the bottom even during the split-second transition */
      min-height: 100vh;
    }

    .back-to-top {
      position: fixed;
      bottom: 24px; /* Placed at the bottom corner since chatbot is removed */
      right: 24px;
      width: 44px;
      height: 44px;
      background: var(--color-accent, #2563eb);
      color: #ffffff;
      border: none;
      border-radius: 50%;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 12px rgba(37,99,235,0.3);
      opacity: 0;
      visibility: hidden;
      transform: translateY(15px);
      transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
      z-index: 9999;
      
      svg {
        width: 18px;
        height: 18px;
        transition: transform 0.3s;
      }

      &:hover {
        background: var(--color-accent-hover, #3b82f6);
        transform: translateY(-3px);
        box-shadow: 0 8px 20px rgba(37,99,235,0.45);
        svg {
          transform: translateY(-2px);
        }
      }
    }

    .back-to-top.show {
      opacity: 1;
      visibility: visible;
      transform: translateY(0);
    }
  `]
})
export class AppComponent implements OnInit {
  showScrollBtn = false;
  scrollProgress = 0;
  private isScrolling = false;

  ngOnInit() {
    // Dialogflow messenger loaded and styled via native custom elements in index.html head
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    if (!this.isScrolling) {
      this.isScrolling = true;
      requestAnimationFrame(() => {
        const yOffset = window.pageYOffset || document.documentElement.scrollTop;
        this.showScrollBtn = yOffset > 300;

        const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        this.scrollProgress = docHeight > 0 ? (yOffset / docHeight) * 100 : 0;
        this.isScrolling = false;
      });
    }
  }

  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // This function tells the animation trigger exactly when the route has changed
  prepareRoute(outlet: RouterOutlet) {
    return outlet && outlet.activatedRouteData && outlet.isActivated ? outlet.activatedRoute : '';
  }
}