import { trigger, transition, style, query, animate, group } from '@angular/animations';

export const fadeAnimation = trigger('routeAnimations', [
  transition('* <=> *', [
    /* 1. Setup: Lock widths to prevent shrinking during animation */
    query(':enter, :leave', [
      style({
        width: '100%'
      })
    ], { optional: true }),
    
    /* 2. Old Page: Set to absolute so it floats perfectly over the new page */
    query(':leave', [
      style({
        position: 'absolute',
        top: 0,
        left: 0,
        zIndex: 10
      })
    ], { optional: true }),
    
    /* 3. New Page: Start completely invisible but in standard document flow 
          (this keeps the footer perfectly at the bottom) */
    query(':enter', [
      style({ 
        opacity: 0
      })
    ], { optional: true }),

    /* 4. The Fix: Synchronized Crossfade.
          Both animations run at the exact same time (400ms) with no delays. 
          This eliminates the white "flash" entirely. */
    group([
      query(':leave', [
        animate('400ms ease-in-out', style({ opacity: 0 }))
      ], { optional: true }),
      
      query(':enter', [
        animate('400ms ease-in-out', style({ opacity: 1 }))
      ], { optional: true })
    ])
  ])
]);