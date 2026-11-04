import { Directive, ElementRef, Input, OnInit, Renderer2, inject, PLATFORM_ID, NgZone } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Directive({
  selector: '[appCountUp]',
  standalone: true
})
export class CountUpDirective implements OnInit {
  @Input('appCountUp') targetValue: number = 0;
  @Input() prefix: string = '';
  @Input() suffix: string = '';
  @Input() duration: number = 1500; // Duration in ms

  private el = inject(ElementRef);
  private renderer = inject(Renderer2);
  private platformId = inject(PLATFORM_ID);
  private ngZone = inject(NgZone);
  private hasAnimated = false;

  ngOnInit() {
    if (!isPlatformBrowser(this.platformId)) {
      // In SSR or non-browser environments, render final value immediately
      this.renderer.setProperty(this.el.nativeElement, 'textContent', `${this.prefix}${this.targetValue}${this.suffix}`);
      return;
    }

    // Keep the rendered final value until the counter is actually visible.
    this.renderer.setProperty(this.el.nativeElement, 'textContent', `${this.prefix}${this.targetValue}${this.suffix}`);

    // Reduced motion: show the number, never animate it.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !this.hasAnimated) {
          this.hasAnimated = true;
          this.ngZone.runOutsideAngular(() => {
            this.animateCount();
          });
          observer.unobserve(this.el.nativeElement);
        }
      });
    }, { threshold: 0.2 });

    observer.observe(this.el.nativeElement);
  }

  private animateCount() {
    const start = 0;
    const end = this.targetValue;
    const duration = this.duration;
    const startTime = performance.now();

    const step = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out cubic: 1 - pow(1 - progress, 3)
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(start + (end - start) * easeOut);

      this.renderer.setProperty(this.el.nativeElement, 'textContent', `${this.prefix}${current}${this.suffix}`);

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        this.renderer.setProperty(this.el.nativeElement, 'textContent', `${this.prefix}${end}${this.suffix}`);
      }
    };

    requestAnimationFrame(step);
  }
}
