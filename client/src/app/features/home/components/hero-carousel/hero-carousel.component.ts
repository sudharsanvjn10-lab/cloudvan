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

      <div class="hero-socials">
        <span class="social-label">Connect:</span>
        <a href="https://www.linkedin.com/company/cloud-vantage-solutions/" target="_blank" title="LinkedIn">in</a>
        <a href="https://twitter.com/cloud_vantage_s" target="_blank" title="X (Twitter)">X</a>
        <a href="https://www.facebook.com/cloudvantage/" target="_blank" title="Facebook">fb</a>
        <a href="https://www.instagram.com/cloudvantages/" target="_blank" title="Instagram">ig</a>
        <a href="https://www.youtube.com/@CloudVantageSolutions/" target="_blank" title="YouTube">yt</a>
      </div>

    </section>
  `,
  styles: [`
    .hero {
      position: relative;
      height: 100vh;
      min-height: 600px;
      overflow: hidden;
      background-color: var(--color-primary, #001f3f);
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

    /* Dark gradient overlay */
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
      color: #f8fafc;
      max-width: 800px;

      h1 { font-size: clamp(2.5rem, 5vw, 4.5rem); color: #fff; margin-bottom: 1rem; }
      p { font-size: clamp(1.1rem, 2vw, 1.5rem); color: #e2e8f0; margin-bottom: 2rem; }
    }

    .btn {
      display: inline-block;
      padding: 16px 32px;
      font-size: 1.125rem;
      font-weight: 600;
      border-radius: 4px;
      cursor: pointer;
      width: max-content;
      transition: all 0.3s ease;
      text-decoration: none;
    }
    .primary {
      background: var(--color-accent, #00a8cc);
      color: var(--color-primary, #001f3f);
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
      
      &:hover { background: var(--color-accent, #00a8cc); color: var(--color-primary, #001f3f); }
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
          background: var(--color-accent, #00a8cc);
          transform: scale(1.3);
        }
      }
    }

    /* Floating Social Links CSS */
    .hero-socials {
      position: absolute;
      bottom: 40px;
      left: 10%; /* Keeps it aligned with main container padding */
      z-index: 10;
      display: flex;
      align-items: center;
      gap: 15px;
    }

    .social-label {
      color: #ffffff;
      font-size: 0.9rem;
      letter-spacing: 2px;
      text-transform: uppercase;
      opacity: 0.8;
      margin-right: 5px;
    }

    .hero-socials a {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      border: 1px solid rgba(255, 255, 255, 0.4);
      color: #ffffff;
      text-decoration: none;
      font-weight: bold;
      font-size: 0.95rem;
      background: rgba(0, 0, 0, 0.3);
      backdrop-filter: blur(4px);
      transition: all 0.3s ease;
    }

    .hero-socials a:hover {
      background: var(--color-accent, #00a8cc);
      border-color: var(--color-accent, #00a8cc);
      transform: translateY(-5px); /* Lifts up on hover */
      box-shadow: 0 5px 15px rgba(0, 168, 204, 0.5);
    }
    
    /* Responsive adjustment for small screens */
    @media (max-width: 768px) {
      .hero-socials {
        bottom: 20px;
        left: 5%;
      }
      .social-label {
        display: none; /* Hide label on mobile to save space */
      }
      .hero-socials a {
        width: 35px;
        height: 35px;
        font-size: 0.85rem;
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
      imageUrl: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop" 
    },
    {
      headline: "Master Your Most Important Asset",
      subline: "Expert Oracle Fusion HCM implementations tailored for scaling workforces.",
      ctaText: "Explore HCM Services",
      ctaLink: "/services",
      imageUrl: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=2070&auto=format&fit=crop"
    },
    {
      headline: "Global Delivery, Local Precision",
      subline: "Headquartered in Dubai with dedicated offshore centers in Chennai and Madurai.",
      ctaText: "View Our Global Presence",
      ctaLink: "/contact",
      imageUrl: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=2070&auto=format&fit=crop"
    },
    {
      headline: "Streamline Enterprise Operations",
      subline: "Automate back-office functions with cutting-edge Oracle Fusion ERP solutions.",
      ctaText: "Explore ERP Systems",
      ctaLink: "/services",
      imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2015&auto=format&fit=crop"
    },
    {
      headline: "Resilient Supply Chains",
      subline: "Optimize logistics and inventory management for peak global efficiency.",
      ctaText: "Discover SCM Solutions",
      ctaLink: "/services",
      imageUrl: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=2070&auto=format&fit=crop"
    },
    {
      headline: "Elevate Customer Experiences",
      subline: "Connect data across marketing, sales, and service to build lasting relationships.",
      ctaText: "View CX Offerings",
      ctaLink: "/services",
      imageUrl: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=2070&auto=format&fit=crop"
    },
    {
      headline: "Agile Financial Planning",
      subline: "Align financial and operational strategies with powerful enterprise performance management.",
      ctaText: "Learn About EPM",
      ctaLink: "/services",
      imageUrl: "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2070&auto=format&fit=crop"
    },
    {
      headline: "Round-the-Clock Support",
      subline: "Continuous integration and system optimization from our offshore delivery centers.",
      ctaText: "Explore Managed Services",
      ctaLink: "/services",
      imageUrl: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop"
    },
    {
      headline: "Thought Leadership & Vision",
      subline: "Stay ahead of the curve with our latest insights on digital cloud transformation.",
      ctaText: "Read Our Insights",
      ctaLink: "/insights",
      imageUrl: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop"
    },
    {
      headline: "Join Our Growing Team",
      subline: "Build your career alongside top-tier enterprise architects and tech innovators.",
      ctaText: "View Careers",
      ctaLink: "/careers",
      imageUrl: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070&auto=format&fit=crop"
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
    }, 7000);
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
    this.stopAutoAdvance();
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