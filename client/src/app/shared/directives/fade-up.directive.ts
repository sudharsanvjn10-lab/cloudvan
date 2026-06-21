import { Directive, ElementRef, OnInit, Renderer2, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Directive({
  selector: '[appFadeUp]',
  standalone: true
})
export class FadeUpDirective implements OnInit {
  private el = inject(ElementRef);
  private renderer = inject(Renderer2);
  private platformId = inject(PLATFORM_ID);

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      // Set initial state
      this.renderer.setStyle(this.el.nativeElement, 'opacity', '0');
      this.renderer.setStyle(this.el.nativeElement, 'transform', 'translateY(40px)');
      this.renderer.setStyle(this.el.nativeElement, 'transition', 'opacity 0.8s ease-out, transform 0.8s cubic-bezier(0.2, 0.8, 0.2, 1)');

      // Create observer
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            this.renderer.setStyle(this.el.nativeElement, 'opacity', '1');
            this.renderer.setStyle(this.el.nativeElement, 'transform', 'translateY(0)');
            observer.unobserve(this.el.nativeElement); // Only animate once
          }
        });
      }, { threshold: 0.15 }); // Trigger when 15% visible

      observer.observe(this.el.nativeElement);
    }
  }
}