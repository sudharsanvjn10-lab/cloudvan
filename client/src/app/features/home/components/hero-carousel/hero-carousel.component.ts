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
        <a href="https://www.linkedin.com/company/cloud-vantage-solutions/" target="_blank" title="LinkedIn">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
            <path d="M0 1.146C0 .513.52 0 1.161 0h13.678C15.48 0 16 .513 16 1.146v13.708c0 .633-.52 1.146-1.161 1.146H1.161C.52 16 0 15.487 0 14.854V1.146zm4.943 12.248V6.169H2.542v7.225h2.401zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248-.822 0-1.359.54-1.359 1.248 0 .694.521 1.248 1.327 1.248h.016zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016a5.54 5.54 0 0 1 .016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225h2.4z"/>
          </svg>
        </a>
        <a href="https://twitter.com/cloud_vantage_s" target="_blank" title="X (Twitter)">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
            <path d="M12.6.75h2.454l-5.36 6.142L16 15.25h-4.937l-3.867-5.07-4.425 5.07H.316l5.733-6.57L0 .75h5.063l3.495 4.633L12.601.75Zm-.86 13.028h1.36L4.323 2.145H2.865l8.875 11.633Z"/>
          </svg>
        </a>
        <a href="https://www.facebook.com/cloudvantage/" target="_blank" title="Facebook">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
            <path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951z"/>
          </svg>
        </a>
        <a href="https://www.instagram.com/cloudvantages/" target="_blank" title="Instagram">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
            <path d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.9 3.9 0 0 0-1.417.923A3.9 3.9 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.9 3.9 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.9 3.9 0 0 0-.923-1.417A3.9 3.9 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.999 0zm.08 1.44h.027c1.736.007 2.18.008 2.888.04.662.031 1.018.143 1.258.236a2.4 2.4 0 0 1 .896.582c.263.263.446.6.582.896.093.24.205.596.236 1.258.03.708.031 1.15.031 2.888s-.001 2.18-.03 2.888c-.031.662-.143 1.018-.236 1.258a2.4 2.4 0 0 1-.582.896 2.4 2.4 0 0 1-.896.582c-.24.093-.596.205-1.258.236-.708.03-1.15.031-2.888.031s-2.18-.001-2.888-.03c-.662-.031-1.018-.143-1.258-.236a2.4 2.4 0 0 1-.896-.582 2.4 2.4 0 0 1-.582-.896c-.093-.24-.205-.596-.236-1.258-.03-.708-.031-1.15-.031-2.888s.001-2.18.03-2.888c.031-.662.143-1.018.236-1.258a2.4 2.4 0 0 1 .582-.896 2.4 2.4 0 0 1 .896-.582c.24-.093.596-.205 1.258-.236.708-.03 1.15-.03 2.888-.03zm-.08 2.72a3.84 3.84 0 1 0 0 7.68 3.84 3.84 0 0 0 0-7.68zm0 1.44a2.4 2.4 0 1 1 0 4.8 2.4 2.4 0 0 1 0-4.8zm3.202-1.762a1.08 1.08 0 1 0 0 2.16 1.08 1.08 0 0 0 0-2.16z"/>
          </svg>
        </a>
        <a href="https://www.youtube.com/@CloudVantageSolutions/" target="_blank" title="YouTube">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
            <path d="M8.051 1.999h.089c.822.003 4.987.033 6.11.335a2.01 2.01 0 0 1 1.415 1.42c.101.38.172.883.22 1.402l.01.104.022.26.008.104c.065.914.073 1.77.074 1.957v.075c-.001.194-.01 1.108-.104 1.981l-.066.162a1.97 1.97 0 0 1-1.414 1.419c-1.112.303-5.28.332-6.11.335a70.4 70.4 0 0 1-.166 0c-.822-.003-4.987-.033-6.11-.335a1.99 1.99 0 0 1-1.415-1.419C.13 9.78.057 9.278.01 8.76a30.1 30.1 0 0 1-.01-.104l-.022-.261-.008-.104a36.4 36.4 0 0 1-.074-1.957V7.07c.002-.194.01-1.108.104-1.981l.066-.162a1.97 1.97 0 0 1 1.415-1.42c1.11-.303 5.28-.332 6.11-.335h.166zm-1.57 6.82l3.86-2.217-3.86-2.217v4.435z"/>
          </svg>
        </a>
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
      background: linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(15, 23, 42, 0.4) 100%);
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

      h1 { 
        font-size: clamp(2.5rem, 5vw, 4.5rem); 
        color: #fff; 
        margin-bottom: 1rem; 
        background: linear-gradient(to right, #ffffff, #cbd5e1);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }
      p { font-size: clamp(1.1rem, 2vw, 1.5rem); color: #cbd5e1; margin-bottom: 2rem; }
    }

    .btn {
      display: inline-block;
      padding: 16px 32px;
      font-size: 1.125rem;
      font-weight: 600;
      border-radius: 8px;
      cursor: pointer;
      width: max-content;
      transition: all var(--transition-speed, 0.4s) cubic-bezier(0.16, 1, 0.3, 1);
      text-decoration: none;
    }
    .primary {
      background: var(--grad-accent);
      color: #ffffff;
      border: 1px solid rgba(255, 255, 255, 0.1);
      box-shadow: 0 4px 20px rgba(37, 99, 235, 0.3);
      &:hover { 
        background: var(--grad-accent-hover);
        transform: translateY(-2px);
        box-shadow: 0 8px 30px rgba(37, 99, 235, 0.5);
      }
    }

    /* Animations */
    .fade-up {
      animation: fadeUpAnim 1s forwards cubic-bezier(0.16, 1, 0.3, 1);
      opacity: 0;
      transform: translateY(30px);
    }
    .delay-1 { animation-delay: 0.15s; }
    .delay-2 { animation-delay: 0.3s; }

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
      border: 1px solid rgba(255, 255, 255, 0.25);
      color: rgba(255, 255, 255, 0.85);
      text-decoration: none;
      background: transparent;
      transition: all 0.3s ease;
    }

    .hero-socials a:hover {
      color: var(--color-accent, #00a8cc);
      border-color: var(--color-accent, #00a8cc);
      background: rgba(255, 255, 255, 0.08);
      transform: translateY(-4px); /* Lifts up on hover */
      box-shadow: 0 4px 12px rgba(0, 168, 204, 0.3);
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
      imageUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop"
    },
    {
      headline: "Global Delivery, Local Precision",
      subline: "Headquartered in Madurai with dedicated offshore centers in Chennai and Madurai.",
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
      imageUrl: "https://images.unsplash.com/photo-1578575437130-527eed3abbec?q=80&w=2070&auto=format&fit=crop"
    },
    {
      headline: "Elevate Customer Experiences",
      subline: "Connect data across marketing, sales, and service to build lasting relationships.",
      ctaText: "View CX Offerings",
      ctaLink: "/services",
      imageUrl: "https://images.unsplash.com/photo-1557804506-669a67965ba0?q=80&w=2074&auto=format&fit=crop"
    },
    {
      headline: "Agile Financial Planning",
      subline: "Align financial and operational strategies with powerful enterprise performance management.",
      ctaText: "Learn About EPM",
      ctaLink: "/services",
      imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop"
    },
    {
      headline: "Round-the-Clock Support",
      subline: "Continuous integration and system optimization from our offshore delivery centers.",
      ctaText: "Explore Managed Services",
      ctaLink: "/services",
      imageUrl: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop"
    },
    {
      headline: "Join Our Growing Team",
      subline: "Build your career alongside top-tier enterprise architects and tech innovators.",
      ctaText: "View Careers",
      ctaLink: "/careers",
      imageUrl: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069&auto=format&fit=crop"
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