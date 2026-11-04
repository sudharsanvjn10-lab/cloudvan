import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-why-cloud-vantage',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="why-cvs-section">
      <div class="container wrapper">
        <div class="header-area">
          <h2>Why Cloud Vantage Solutions?</h2>
          <p>Delivering measurable business value through deep technical expertise and strategic global deployment.</p>
        </div>

         <div class="tab-interface"
              (mouseenter)="stopAutoCycle()" (mouseleave)="startAutoCycle()">
          <div class="tab-nav" role="tablist">
            <button 
              *ngFor="let tab of tabs; let i = index"
              role="tab"
              [attr.aria-selected]="activeTab() === i"
              [class.active]="activeTab() === i"
              (click)="selectTab(i)"
            >
              {{ tab.title }}
            </button>
          </div>

          <div class="tab-content-area">
            <div 
              *ngFor="let tab of tabs; let i = index"
              class="tab-pane"
              [class.active]="activeTab() === i"
              role="tabpanel"
            >
              <div class="pane-inner">
                <div class="text-content">
                  <h3>{{ tab.heading }}</h3>
                  <p>{{ tab.body }}</p>
                  <ul class="feature-list" *ngIf="tab.features">
                    <li *ngFor="let feature of tab.features">
                      <svg class="check" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                      {{ feature }}
                    </li>
                  </ul>
                </div>
                <div class="image-content" [style.backgroundImage]="'url(' + tab.imageUrl + ')'"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .why-cvs-section {
      padding: 6rem 0;
      background-color: var(--color-gray-50);
    }

    .header-area {
      text-align: center;
      margin-bottom: 4rem;
      h2 { font-size: clamp(2rem, 3vw, 2.5rem); margin-bottom: 1rem; color: var(--color-primary); }
      p { color: var(--text-muted); font-size: 1.125rem; max-width: 700px; margin: 0 auto; }
    }

    .tab-interface {
      display: flex;
      flex-direction: column;
      background: #fff;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 10px 30px rgba(0,0,0,0.05);

      @media (min-width: 1024px) {
        flex-direction: row;
        min-height: 450px;
      }
    }

    .tab-nav {
      display: flex;
      flex-direction: row;
      background: var(--color-primary);
      overflow-x: auto;
      
      @media (min-width: 1024px) {
        flex-direction: column;
        width: 300px;
        flex-shrink: 0;
      }

      button {
        background: transparent;
        border: none;
        color: var(--color-on-dark-muted, #94a3b8);
        padding: 1rem 1.25rem;
        text-align: left;
        font-family: inherit;
        font-size: 0.95rem;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s;
        border-bottom: 2px solid transparent;
        white-space: normal;
        flex: 1 1 33%;
        min-width: 0;
        line-height: 1.35;

        @media (min-width: 1024px) {
          flex: none;
          padding: 1.5rem 2rem;
          font-size: 1.1rem;
          border-bottom: none;
          border-left: 4px solid transparent;
          white-space: normal;
        }

        &:hover { background: rgba(255,255,255,0.05); color: #fff; }

        &.active {
          color: #fff;
          background: rgba(255,255,255,0.1);
          border-bottom-color: var(--color-accent);
          @media (min-width: 1024px) {
            border-bottom-color: transparent;
            border-left-color: var(--color-accent);
          }
        }
      }
    }

    .tab-content-area {
      flex-grow: 1;
      position: relative;
    }

    .tab-pane {
      display: none;
      height: 100%;
      &.active {
        display: block;
        animation: fadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1);
      }
    }

    .pane-inner {
      display: flex;
      flex-direction: column;
      height: 100%;

      @media (min-width: 768px) {
        flex-direction: row;
      }
    }

    .text-content {
      flex: 1;
      padding: 3rem;
      display: flex;
      flex-direction: column;
      justify-content: center;

      h3 { font-size: 1.75rem; color: var(--color-primary); margin-bottom: 1rem; }
      p { color: var(--text-muted); line-height: 1.7; margin-bottom: 1.5rem; }
    }

    .feature-list {
      list-style: none;
      padding: 0;
      li {
        display: flex; align-items: center; gap: 10px;
        margin-bottom: 0.75rem; color: var(--text-main); font-weight: 600;
        .check { width: 18px; height: 18px; flex: none; color: #fff; background: var(--color-accent, #2563eb); padding: 3px; border-radius: 50%; }
      }
    }

    .image-content {
      flex: 1;
      min-height: 300px;
      background-size: cover;
      background-position: center;
      position: relative;
      overflow: hidden;
    }

    /* Slow living zoom on the tab photo */
    .image-content::before {
      content: '';
      position: absolute;
      inset: -4%;
      background-image: inherit;
      background-size: cover;
      background-position: center;
      animation: slowZoom 16s ease-in-out infinite alternate;
      will-change: transform;
    }

    @keyframes slowZoom {
      from { transform: scale(1); }
      to { transform: scale(1.1); }
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(16px); filter: blur(6px); }
      to { opacity: 1; transform: translateY(0); filter: blur(0); }
    }
  `]
})
export class WhyCloudVantageComponent implements OnInit, OnDestroy {
  activeTab = signal(0);
  private autoCycleInterval: any;
  private prefersReducedMotion = typeof window !== 'undefined'
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  tabs = [
    {
      title: 'The Vantage Advantage',
      heading: '20+ Years of Oracle Cloud Mastery',
      body: 'Founded by industry veterans with extensive real-world experience, we don\'t just implement software; we architect scalable solutions that map precisely to your business objectives across real estate, healthcare, and logistics sectors.',
      features: ['Industry-Specific Customizations', 'Rapid Implementation Methodology', 'Post-Go-Live Managed Services'],
      imageUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=800&auto=format&fit=crop'
    },
    {
      title: 'Global Delivery Model',
      heading: 'Onshore Strategy, Offshore Precision',
      body: 'Headquartered in Madurai with state-of-the-art offshore delivery centers in Chennai and Madurai, India. This hybrid model guarantees enterprise-grade architectural design coupled with highly cost-effective, round-the-clock technical execution and support.',
      features: ['Madurai Strategic HQ', 'Chennai & Madurai Delivery Centers', '24/7 Technical Support Lifecycle'],
      imageUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=800&auto=format&fit=crop'
    },
    {
      title: 'Cross-Sector Expertise',
      heading: 'Built for Complex Environments',
      body: 'We specialize in deploying Oracle Fusion modules in industries with rigid compliance, massive workforces, and intricate supply chains. Whether it is oil & gas drilling or retail pharmacy, we know how to configure the cloud for your reality.',
      features: ['Real Estate & Investment', 'Oil, Gas & Automotive', 'Pharmacy & Healthcare'],
      imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=800&auto=format&fit=crop'
    }
  ];

  ngOnInit() {
    this.startAutoCycle();
  }

  ngOnDestroy() {
    this.stopAutoCycle();
  }

  startAutoCycle() {
    this.stopAutoCycle();
    if (this.prefersReducedMotion) return;
    this.autoCycleInterval = setInterval(() => {
      this.activeTab.update(current => (current + 1) % this.tabs.length);
    }, 6000);
  }

  stopAutoCycle() {
    if (this.autoCycleInterval) {
      clearInterval(this.autoCycleInterval);
      this.autoCycleInterval = null;
    }
  }

  selectTab(index: number) {
    this.activeTab.set(index);
    this.startAutoCycle(); // restart the timer rather than killing it forever
  }
}