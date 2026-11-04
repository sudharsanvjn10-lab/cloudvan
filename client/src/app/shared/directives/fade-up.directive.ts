import { Directive, ElementRef, OnInit, Renderer2, Input, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Directive({
  selector: '[appFadeUp]',
  standalone: true
})
export class FadeUpDirective implements OnInit {
  @Input() delay: number = 0; // Delay in milliseconds

  private el = inject(ElementRef);
  private renderer = inject(Renderer2);
  private platformId = inject(PLATFORM_ID);

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      // Set initial state
      this.renderer.setStyle(this.el.nativeElement, 'opacity', '0');
      this.renderer.setStyle(this.el.nativeElement, 'transform', 'translateY(28px)');
      this.renderer.setStyle(this.el.nativeElement, 'filter', 'blur(8px)');
      const transitionStr = `opacity 0.8s ease-out ${this.delay}ms, transform 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${this.delay}ms, filter 0.8s ease-out ${this.delay}ms`;
      this.renderer.setStyle(this.el.nativeElement, 'transition', transitionStr);

      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            this.renderer.setStyle(this.el.nativeElement, 'opacity', '1');
            this.renderer.setStyle(this.el.nativeElement, 'transform', 'translateY(0)');
            this.renderer.setStyle(this.el.nativeElement, 'filter', 'blur(0)');
            observer.unobserve(this.el.nativeElement); // Only animate once
          }
        });
      }, { threshold: 0.1 });

      observer.observe(this.el.nativeElement);
    }
  }
}
