import { Component, OnInit, OnDestroy, signal, inject, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface Slide {
  headline: string;
  subline: string;
  ctaText: string;
  ctaLink: string;
  imageUrl: string;
}

@Component({
  selector: 'app-hero-carousel',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <section class="hero" aria-label="Promotional Carousel">
      <div 
        class="slide" 
        *ngFor="let slide of slides; let i = index"
        [class.active]="currentSlide() === i"
        [style.backgroundImage]="'url(' + slide.imageUrl + ')'"
        [attr.aria-hidden]="currentSlide() !== i">
        
        <div class="overlay"></div>
        
        <div class="container slide-content" *ngIf="currentSlide() === i">
          <h1 class="fade-up">{{ slide.headline }}</h1>
          <p class="fade-up delay-1">{{ slide.subline }}</p>
          <a [routerLink]="slide.ctaLink" class="btn primary fade-up delay-2">
            {{ slide.ctaText }}
          </a>
        </div>
      </div>

      <button class="control prev" (click)="manualNavigation(-1)" aria-label="Previous Slide">&#10094;</button>
      <button class="control next" (click)="manualNavigation(1)" aria-label="Next Slide">&#10095;</button>

      <div class="indicators">
        <button 
          *ngFor="let slide of slides; let i = index" 
          class="dot" 
          [class.active]="currentSlide() === i"
          (click)="goToSlide(i)"
          [attr.aria-label]="'Go to slide ' + (i + 1)">
        </button>
      </div>
    </section>
  `,
  styles: [`
    .hero {
      position: relative;
      height: 100vh;
      min-height: 600px;
      overflow: hidden;
      background-color: var(--color-primary);
    }

    .slide {
      position: absolute;
      top: 0; left: 0;
      width: 100%; height: 100%;
      background-size: cover;
      background-position: center;
      opacity: 0;
      transition: opacity 1s ease-in-out;
      z-index: 1;

      &.active {
        opacity: 1;
        z-index: 2;
      }
    }

    /* Dark gradient overlay similar to Milaha */
    .overlay {
      position: absolute;
      top: 0; left: 0;
      width: 100%; height: 100%;
      background: linear-gradient(to right, rgba(10, 37, 64, 0.9) 0%, rgba(10, 37, 64, 0.4) 100%);
    }

    .slide-content {
      position: relative;
      z-index: 3;
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      color: var(--color-bg-light);
      max-width: 800px;

      h1 { font-size: clamp(2.5rem, 5vw, 4.5rem); color: #fff; margin-bottom: 1rem; }
      p { font-size: clamp(1.1rem, 2vw, 1.5rem); color: #e2e8f0; margin-bottom: 2rem; }
    }

    /* Shared Button Style inherited from variables, redefined for standalone context if needed, or using global classes */
    .btn {
      display: inline-block;
      padding: 16px 32px;
      font-size: 1.125rem;
      font-weight: 600;
      border-radius: 4px;
      cursor: pointer;
      width: max-content;
      transition: all 0.3s ease;
    }
    .primary {
      background: var(--color-accent);
      color: var(--color-primary);
      &:hover { background: #fff; }
    }

    /* Animations */
    .fade-up {
      animation: fadeUpAnim 0.8s forwards cubic-bezier(0.2, 0.8, 0.2, 1);
      opacity: 0;
      transform: translateY(30px);
    }
    .delay-1 { animation-delay: 0.2s; }
    .delay-2 { animation-delay: 0.4s; }

    @keyframes fadeUpAnim {
      to { opacity: 1; transform: translateY(0); }
    }

    /* Controls */
    .control {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      background: rgba(255,255,255,0.1);
      border: none;
      color: #fff;
      font-size: 2rem;
      padding: 1rem;
      cursor: pointer;
      z-index: 10;
      transition: background 0.3s;
      
      &:hover { background: var(--color-accent); color: var(--color-primary); }
      &.prev { left: 20px; }
      &.next { right: 20px; }
    }

    .indicators {
      position: absolute;
      bottom: 30px;
      left: 50%;
      transform: translateX(-50%);
      display: flex;
      gap: 10px;
      z-index: 10;

      .dot {
        width: 12px; height: 12px;
        border-radius: 50%;
        background: rgba(255,255,255,0.4);
        border: none;
        cursor: pointer;
        transition: background 0.3s, transform 0.3s;

        &.active {
          background: var(--color-accent);
          transform: scale(1.3);
        }
      }
    }
  `]
})
export class HeroCarouselComponent implements OnInit, OnDestroy {
  currentSlide = signal(0);
  private autoAdvanceTimer: any;
  private destroyRef = inject(DestroyRef);

  slides: Slide[] = [
    {
      headline: "The Next Gen Consulting",
      subline: "Empowering Futures, Unleashing Innovations across global enterprise sectors.",
      ctaText: "Discover Our Advantage",
      ctaLink: "/about",
      // PLACEHOLDER: Replace with actual corporate architecture/abstract tech images
      imageUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop" 
    },
    {
      headline: "Master Your Most Important Asset",
      subline: "Expert Oracle Fusion HCM implementations tailored for scaling workforces.",
      ctaText: "Explore HCM Services",
      ctaLink: "/services",
      // PLACEHOLDER: Replace with actual team/corporate office image
      imageUrl: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=2070&auto=format&fit=crop"
    },
    {
      headline: "Global Delivery, Local Precision",
      subline: "Headquartered in Dubai with dedicated offshore centers in Chennai and Madurai.",
      ctaText: "View Our Global Presence",
      ctaLink: "/contact",
      // PLACEHOLDER: Replace with actual Dubai/Chennai skyline or data center image
      imageUrl: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=2070&auto=format&fit=crop"
    }
  ];

  ngOnInit() {
    this.startAutoAdvance();
    this.destroyRef.onDestroy(() => this.stopAutoAdvance());
  }

  ngOnDestroy() {
    this.stopAutoAdvance();
  }

  startAutoAdvance() {
    this.autoAdvanceTimer = setInterval(() => {
      this.nextSlide();
    }, 7000); // 7-second rotation
  }

  stopAutoAdvance() {
    if (this.autoAdvanceTimer) {
      clearInterval(this.autoAdvanceTimer);
    }
  }

  nextSlide() {
    this.currentSlide.update(curr => (curr === this.slides.length - 1 ? 0 : curr + 1));
  }

  manualNavigation(direction: number) {
    this.stopAutoAdvance(); // Respect user interaction
    const newIndex = this.currentSlide() + direction;
    if (newIndex < 0) {
      this.currentSlide.set(this.slides.length - 1);
    } else if (newIndex >= this.slides.length) {
      this.currentSlide.set(0);
    } else {
      this.currentSlide.set(newIndex);
    }
  }

  goToSlide(index: number) {
    this.stopAutoAdvance();
    this.currentSlide.set(index);
  }
}