import { Directive, ElementRef, inject } from '@angular/core';

/**
 * Cursor-follow spotlight for cards.
 * Sets --mx / --my CSS custom properties; the component's ::after paints the glow.
 */
@Directive({
  selector: '[appSpotlight]',
  standalone: true,
})
export class SpotlightDirective {
  private el = inject(ElementRef);

  constructor() {
    const node = this.el.nativeElement as HTMLElement;
    node.addEventListener('mousemove', (e: MouseEvent) => {
      const r = node.getBoundingClientRect();
      node.style.setProperty('--mx', `${e.clientX - r.left}px`);
      node.style.setProperty('--my', `${e.clientY - r.top}px`);
    });
  }
}
