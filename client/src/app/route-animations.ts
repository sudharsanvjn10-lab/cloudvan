import { trigger, transition, style, query, animate, group } from '@angular/animations';

export const fadeAnimation = trigger('routeAnimations', [
  transition('* <=> *', [
    /* 1. Setup: Lock widths to prevent layout jumps during transitions */
    query(':enter, :leave', [
      style({
        width: '100%'
      })
    ], { optional: true }),
    
    /* 2. Old Page: Shift slightly up and fade out */
    query(':leave', [
      style({
        position: 'absolute',
        top: 0,
        left: 0,
        zIndex: 10,
        opacity: 1,
        transform: 'scale(1) translateY(0)'
      })
    ], { optional: true }),
    
    /* 3. New Page: Start slightly lower, scaled down, and fully transparent */
    query(':enter', [
      style({ 
        opacity: 0,
        transform: 'scale(0.985) translateY(16px)'
      })
    ], { optional: true }),

    /* 4. Coordinated Animation: Execute both transitions simultaneously using 
          a premium out-quint easing function for hardware-accelerated fluid motion. */
    group([
      query(':leave', [
        animate('500ms cubic-bezier(0.16, 1, 0.3, 1)', style({ 
          opacity: 0, 
          transform: 'scale(1.015) translateY(-8px)'
        }))
      ], { optional: true }),
      
      query(':enter', [
        animate('600ms cubic-bezier(0.16, 1, 0.3, 1)', style({ 
          opacity: 1, 
          transform: 'scale(1) translateY(0)'
        }))
      ], { optional: true })
    ])
  ])
]);