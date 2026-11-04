import { Component, OnInit, OnDestroy, signal, inject, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface Slide {
  category: string;
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
    <section class="hero" aria-label="Oracle Fusion HCM Cloud Solutions Carousel"
      (mouseenter)="pauseAutoAdvance()" (mouseleave)="resumeAutoAdvance()"
      (focusin)="pauseAutoAdvance()" (focusout)="resumeAutoAdvance()">
      
      <div 
        class="slide" 
        *ngFor="let slide of slides; let i = index"
        [class.active]="currentSlide() === i"
        [style.backgroundImage]="'url(' + slide.imageUrl + ')'"
        [attr.aria-hidden]="currentSlide() !== i">
        
        <div class="overlay"></div>
        
        <div class="container slide-content" *ngIf="currentSlide() === i">
          <div class="category-pill fade-up">
            <span class="pill-dot"></span>
            <span>{{ slide.category }}</span>
          </div>
          <h1 class="hero-title" [attr.aria-label]="slide.headline">
            <span class="word" *ngFor="let w of words(slide.headline); let i = index"
                  [style.animationDelay]="(120 + i * 70) + 'ms'" aria-hidden="true">{{ w }}&nbsp;</span>
          </h1>
          <p class="fade-up delay-2">{{ slide.subline }}</p>
          <a [routerLink]="slide.ctaLink" class="btn primary fade-up delay-3">
            {{ slide.ctaText }}
          </a>
        </div>
      </div>

      <div class="hero-atmo" aria-hidden="true">
        <div class="aurora a1"></div>
        <div class="aurora a2"></div>
        <div class="aurora a3"></div>
        <div class="grid-overlay"></div>
      </div>

      <div class="scroll-cue" aria-hidden="true"><span></span></div>

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
        <a href="https://www.linkedin.com/company/cloud-vantage-solutions/" target="_blank" rel="noopener noreferrer" title="LinkedIn" aria-label="Cloud Vantage LinkedIn">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
            <path d="M0 1.146C0 .513.52 0 1.161 0h13.678C15.48 0 16 .513 16 1.146v13.708c0 .633-.52 1.146-1.161 1.146H1.161C.52 16 0 15.487 0 14.854V1.146zm4.943 12.248V6.169H2.542v7.225h2.401zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248-.822 0-1.359.54-1.359 1.248 0 .694.521 1.248 1.327 1.248h.016zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016a5.54 5.54 0 0 1 .016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225h2.4z"/>
          </svg>
        </a>
        <a href="https://twitter.com/cloud_vantage_s" target="_blank" rel="noopener noreferrer" title="X (Twitter)" aria-label="Cloud Vantage Twitter">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
            <path d="M12.6.75h2.454l-5.36 6.142L16 15.25h-4.937l-3.867-5.07-4.425 5.07H.316l5.733-6.57L0 .75h5.063l3.495 4.633L12.601.75Zm-.86 13.028h1.36L4.323 2.145H2.865l8.875 11.633Z"/>
          </svg>
        </a>
        <a href="https://www.facebook.com/cloudvantage/" target="_blank" rel="noopener noreferrer" title="Facebook" aria-label="Cloud Vantage Facebook">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
            <path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951z"/>
          </svg>
        </a>
        <a href="https://www.instagram.com/cloudvantages/" target="_blank" rel="noopener noreferrer" title="Instagram" aria-label="Cloud Vantage Instagram">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
            <path d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.9 3.9 0 0 0-1.417.923A3.9 3.9 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.9 3.9 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.9 3.9 0 0 0-.923-1.417A3.9 3.9 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.999 0zm.08 1.44h.027c1.736.007 2.18.008 2.888.04.662.031 1.018.143 1.258.236a2.4 2.4 0 0 1 .896.582c.263.263.446.6.582.896.093.24.205.596.236 1.258.03.708.031 1.15.031 2.888s-.001 2.18-.03 2.888c-.031.662-.143 1.018-.236 1.258a2.4 2.4 0 0 1-.582.896 2.4 2.4 0 0 1-.896.582c-.24.093-.596.205-1.258.236-.708.03-1.15.031-2.888.031s-2.18-.001-2.888-.03c-.662-.031-1.018-.143-1.258-.236a2.4 2.4 0 0 1-.896-.582 2.4 2.4 0 0 1-.582-.896c-.093-.24-.205-.596-.236-1.258-.03-.708-.031-1.15-.031-2.888s.001-2.18.03-2.888c.031-.662.143-1.018.236-1.258a2.4 2.4 0 0 1 .582-.896 2.4 2.4 0 0 1 .896-.582c.24-.093.596-.205 1.258-.236.708-.03 1.15-.03 2.888-.03zm-.08 2.72a3.84 3.84 0 1 0 0 7.68 3.84 3.84 0 0 0 0-7.68zm0 1.44a2.4 2.4 0 1 1 0 4.8 2.4 2.4 0 0 1 0-4.8zm3.202-1.762a1.08 1.08 0 1 0 0 2.16 1.08 1.08 0 0 0 0-2.16z"/>
          </svg>
        </a>
        <a href="https://www.youtube.com/@CloudVantageSolutions/" target="_blank" rel="noopener noreferrer" title="YouTube" aria-label="Cloud Vantage YouTube">
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
      min-height: 640px;
      overflow: hidden;
      background-color: var(--color-primary, #070b19);
    }

    .slide {
      position: absolute;
      top: 0; left: 0;
      width: 100%; height: 100%;
      background-size: cover;
      background-position: center;
      background-color: #070b19;
      background-image: linear-gradient(135deg, #070b19 0%, #0f172a 50%, #1e3a8a 100%);
      opacity: 0;
      transition: opacity 1s cubic-bezier(0.16, 1, 0.3, 1);
      z-index: 1;

      &.active {
        opacity: 1;
        z-index: 2;
        animation: kenburns 26s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        will-change: transform;
      }
    }

    /* Enhanced multi-stop directional dark gradient for WCAG AAA text contrast */
    .overlay {
      position: absolute;
      top: 0; left: 0;
      width: 100%; height: 100%;
      background: linear-gradient(90deg, rgba(7, 11, 25, 0.96) 0%, rgba(10, 17, 38, 0.88) 55%, rgba(10, 17, 38, 0.55) 100%);
    }

    .slide-content {
      position: relative;
      z-index: 4;
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      color: #f8fafc;
      max-width: 840px;

      h1 { 
        font-size: clamp(2.4rem, 4.6vw, 4.2rem); 
        color: #ffffff; 
        margin-bottom: 1.25rem; 
        line-height: 1.12;
        font-weight: 800;
        letter-spacing: -0.02em;
        text-shadow: 0 2px 18px rgba(7, 11, 25, 0.55), 0 1px 3px rgba(7, 11, 25, 0.4);
      }

      p { 
        font-size: clamp(1.1rem, 2vw, 1.4rem); 
        color: #cbd5e1; 
        margin-bottom: 2.25rem; 
        line-height: 1.6;
        max-width: 720px;
      }
    }

    /* Category Pill */
    .category-pill {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 6px 14px;
      border-radius: 999px;
      background: rgba(59, 130, 246, 0.16);
      border: 1px solid rgba(96, 165, 250, 0.35);
      color: #60a5fa;
      font-size: 0.78rem;
      font-weight: 600;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      margin-bottom: 1.25rem;
      width: fit-content;
      backdrop-filter: blur(8px);
    }

    .pill-dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: #38bdf8;
      box-shadow: 0 0 8px #38bdf8;
    }

    .btn {
      display: inline-block;
      padding: 16px 36px;
      font-size: 1.05rem;
      font-weight: 600;
      border-radius: 8px;
      cursor: pointer;
      width: max-content;
      transition: all var(--transition-speed, 0.4s) cubic-bezier(0.16, 1, 0.3, 1);
      text-decoration: none;
    }

    .primary {
      background: var(--grad-accent, linear-gradient(135deg, #2563eb 0%, #06b6d4 100%));
      color: #ffffff;
      border: 1px solid rgba(255, 255, 255, 0.15);
      box-shadow: 0 4px 20px rgba(37, 99, 235, 0.35);

      &:hover {
        background: var(--grad-accent-hover, linear-gradient(135deg, #3b82f6 0%, #22d3ee 100%));
        transform: translateY(-2px);
        box-shadow: 0 8px 30px rgba(37, 99, 235, 0.5);
      }
    }

    /* Modern Frosted Glass Navigation Controls */
    .control {
      position: absolute;
      top: 50%;
      width: 52px;
      height: 52px;
      border-radius: 50%;
      background: rgba(15, 23, 42, 0.55);
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.18);
      color: #ffffff;
      font-size: 1.15rem;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10;
      transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
      transform: translateY(-50%);

      &:hover {
        background: rgba(37, 99, 235, 0.7);
        border-color: #60a5fa;
        box-shadow: 0 0 20px rgba(37, 99, 235, 0.5);
        transform: translateY(-50%) scale(1.08);
      }

      &.prev { left: 24px; }
      &.next { right: 24px; }
    }

    /* Morphing Elongated Pill Indicators */
    .indicators {
      position: absolute;
      bottom: 30px;
      left: 50%;
      transform: translateX(-50%);
      display: flex;
      align-items: center;
      gap: 10px;
      z-index: 10;
    }

    .dot {
      height: 8px;
      width: 10px;
      border-radius: 999px;
      background: rgba(255, 255, 255, 0.3);
      border: none;
      cursor: pointer;
      transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);

      &.active {
        width: 32px;
        background: #0ea5e9;
        box-shadow: 0 0 12px rgba(14, 165, 233, 0.6);
      }

      &:hover:not(.active) {
        background: rgba(255, 255, 255, 0.6);
      }
    }

    /* Social Links */
    .hero-socials {
      position: absolute;
      bottom: 25px;
      right: 30px;
      display: flex;
      align-items: center;
      gap: 16px;
      z-index: 10;
      background: rgba(15, 23, 42, 0.4);
      backdrop-filter: blur(10px);
      padding: 8px 16px;
      border-radius: 30px;
      border: 1px solid rgba(255, 255, 255, 0.1);

      .social-label {
        font-size: 0.8rem;
        color: #94a3b8;
        font-weight: 500;
      }

      a {
        color: #e2e8f0;
        transition: all 0.2s ease;
        display: flex;
        align-items: center;

        &:hover {
          color: #38bdf8;
          transform: translateY(-2px);
        }
      }
    }

    @media (max-width: 768px) {
      .hero-socials, .scroll-cue { display: none; }
      /* Arrows used to cover the headline/paragraph on phones.
         The dots stay tappable, so navigation is still available. */
      .control { display: none; }
      .hero { min-height: 560px; }
      .indicators { bottom: 22px; }
      .aurora { filter: blur(48px); }
    }

    .fade-up {
      opacity: 0;
      transform: translateY(20px);
      animation: heroFadeUp 0.75s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }
    .delay-1 { animation-delay: 0.1s; }
    .delay-2 { animation-delay: 0.2s; }
    .delay-3 { animation-delay: 0.3s; }

    @keyframes heroFadeUp {
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    /* ---- Live background atmosphere ---- */
    .hero-atmo {
      position: absolute;
      inset: 0;
      z-index: 3;
      pointer-events: none;
      mix-blend-mode: screen;
      overflow: hidden;
    }

    .aurora {
      position: absolute;
      border-radius: 50%;
      filter: blur(72px);
      will-change: transform;
    }

    .a1 {
      width: 540px; height: 540px;
      left: -140px; top: -100px;
      background: radial-gradient(circle, rgba(37, 99, 235, 0.55) 0%, transparent 70%);
      animation: driftA 22s ease-in-out infinite alternate;
    }

    .a2 {
      width: 640px; height: 640px;
      right: -180px; top: 8%;
      background: radial-gradient(circle, rgba(6, 182, 212, 0.38) 0%, transparent 70%);
      animation: driftB 28s ease-in-out infinite alternate;
    }

    .a3 {
      width: 500px; height: 500px;
      left: 32%; bottom: -200px;
      background: radial-gradient(circle, rgba(147, 197, 253, 0.30) 0%, transparent 70%);
      animation: driftC 32s ease-in-out infinite alternate;
    }

    .grid-overlay {
      position: absolute;
      inset: 0;
      background-image:
        linear-gradient(rgba(148, 163, 184, 0.09) 1px, transparent 1px),
        linear-gradient(90deg, rgba(148, 163, 184, 0.09) 1px, transparent 1px);
      background-size: 72px 72px;
      -webkit-mask-image: radial-gradient(ellipse 70% 60% at 28% 42%, #000 0%, transparent 72%);
      mask-image: radial-gradient(ellipse 70% 60% at 28% 42%, #000 0%, transparent 72%);
    }

    @keyframes driftA {
      0% { transform: translate3d(0, 0, 0) scale(1); }
      100% { transform: translate3d(80px, 60px, 0) scale(1.15); }
    }
    @keyframes driftB {
      0% { transform: translate3d(0, 0, 0) scale(1.1); }
      100% { transform: translate3d(-90px, 40px, 0) scale(0.95); }
    }
    @keyframes driftC {
      0% { transform: translate3d(0, 0, 0) scale(0.95); }
      100% { transform: translate3d(60px, -50px, 0) scale(1.12); }
    }

    @keyframes kenburns {
      from { transform: scale(1) translate3d(0, 0, 0); }
      to { transform: scale(1.08) translate3d(1.2%, -0.8%, 0); }
    }

    .hero-title {
      margin-bottom: 0;
    }

    .word {
      display: inline-block;
      opacity: 0;
      color: #ffffff;
      -webkit-text-fill-color: #ffffff;
      text-shadow: 0 2px 18px rgba(7, 11, 25, 0.55), 0 1px 3px rgba(7, 11, 25, 0.4);
      animation: wordRise 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards;
      will-change: transform, opacity;
    }

    @keyframes wordRise {
      from { opacity: 0; transform: translateY(22px) rotateX(28deg); }
      to { opacity: 1; transform: translateY(0) rotateX(0); }
    }

    .pill-dot {
      animation: pulseDot 2.4s ease-in-out infinite;
    }

    @keyframes pulseDot {
      0%, 100% { box-shadow: 0 0 0 0 rgba(56, 189, 248, 0.55); }
      50% { box-shadow: 0 0 0 7px rgba(56, 189, 248, 0); }
    }

    .scroll-cue {
      position: absolute;
      left: 32px;
      bottom: 28px;
      z-index: 10;
      width: 2px;
      height: 56px;
      overflow: hidden;
      background: rgba(255, 255, 255, 0.15);
      border-radius: 2px;
    }

    .scroll-cue span {
      position: absolute;
      left: 0;
      top: -40%;
      width: 100%;
      height: 40%;
      background: linear-gradient(to bottom, transparent, #93c5fd);
      animation: cueDrop 2.2s cubic-bezier(0.4, 0, 0.2, 1) infinite;
    }

    @keyframes cueDrop {
      to { top: 120%; }
    }
  `]
})
export class HeroCarouselComponent implements OnInit, OnDestroy {
  currentSlide = signal<number>(0);
  private autoAdvanceTimer: any;
  private destroyRef = inject(DestroyRef);

  slides: Slide[] = [
    {
      category: "ORACLE FUSION HCM CLOUD",
      headline: "Transforming Global Enterprises",
      subline: "Unleash the full power of Oracle Fusion HCM Cloud with tailored implementations and continuous innovation.",
      ctaText: "Discover Our Services",
      ctaLink: "/services",
      imageUrl: "https://images.unsplash.com/photo-1519501025264-65ba15a82390?q=80&w=2070&auto=format&fit=crop"
    },
    {
      category: "GLOBAL ENTERPRISE WORKFORCE",
      headline: "Core HR & Global Workforce",
      subline: "Scalable Oracle Fusion Core HR architectures and employee journey workflows.",
      ctaText: "Explore Core HR",
      ctaLink: "/services",
      imageUrl: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?q=80&w=2070&auto=format&fit=crop"
    },
    {
      category: "INTELLIGENT PAYROLL ARCHITECTURE",
      headline: "Intelligent Global Payroll",
      subline: "Flawless multi-country payroll calculations, retroactive processing, and compliance.",
      ctaText: "Explore Payroll Solutions",
      ctaLink: "/services",
      imageUrl: "https://images.unsplash.com/photo-1642543492481-44e81e3914a7?q=80&w=2070&auto=format&fit=crop"
    },
    {
      category: "ORC & TALENT ACQUISITION",
      headline: "Attract & Nurture Top Talent",
      subline: "Next-gen Oracle Recruiting Cloud (ORC) with intelligent performance and goal management.",
      ctaText: "View Talent Solutions",
      ctaLink: "/services",
      imageUrl: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?q=80&w=2070&auto=format&fit=crop"
    },
    {
      category: "REDWOOD DESIGN & VBS",
      headline: "Modern Redwood UI Extensions",
      subline: "Bespoke Visual Builder Studio (VBS) extensions, Business Rules, and seamless HDL integrations.",
      ctaText: "Learn About Redwood",
      ctaLink: "/services",
      imageUrl: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=2055&auto=format&fit=crop"
    },
    {
      category: "24/7 GLOBAL MANAGED SERVICES",
      headline: "Round-the-Clock Support",
      subline: "Continuous integration and system optimization from our offshore delivery centers.",
      ctaText: "Explore Managed Services",
      ctaLink: "/services",
      imageUrl: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=2070&auto=format&fit=crop"
    },
    {
      category: "CAREERS & GLOBAL DELIVERY",
      headline: "Join Our Growing Team",
      subline: "Build your career alongside top-tier Oracle Fusion HCM architects and technical innovators.",
      ctaText: "View Careers",
      ctaLink: "/careers",
      imageUrl: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop"
    }
  ];

  words(headline: string): string[] {
    return headline.split(' ');
  }

  private prefersReducedMotion = typeof window !== 'undefined'
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  ngOnInit() {
    if (!this.prefersReducedMotion) {
      this.startAutoAdvance();
    }
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
      this.autoAdvanceTimer = null;
    }
  }

  /* WCAG 2.2.2: pause while the user is hovering or tabbing through the hero */
  pauseAutoAdvance() {
    this.stopAutoAdvance();
  }

  /* Manual navigation no longer freezes the carousel forever - it restarts the timer */
  resumeAutoAdvance() {
    if (this.prefersReducedMotion) {
      return;
    }
    this.stopAutoAdvance();
    this.startAutoAdvance();
  }

  nextSlide() {
    this.currentSlide.update(curr => (curr === this.slides.length - 1 ? 0 : curr + 1));
  }

  manualNavigation(direction: number) {
    this.resumeAutoAdvance();
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
    this.currentSlide.set(index);
    this.resumeAutoAdvance();
  }
}
