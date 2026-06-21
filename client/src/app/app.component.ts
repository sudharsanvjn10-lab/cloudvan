import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './core/layout/header/header.component';
import { FooterComponent } from './core/layout/footer/footer.component';
import { fadeAnimation } from './route-animations';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, FooterComponent],
  animations: [fadeAnimation],
  template: `
    <app-header></app-header>
    
    <!-- Animation Wrapper -->
    <main class="route-workspace" [@routeAnimations]="prepareRoute(outlet)">
      <!-- #outlet reference allows the animation trigger to know when the route changes -->
      <router-outlet #outlet="outlet"></router-outlet>
    </main>

    <app-footer></app-footer>
  `,
  styles: [`
    .route-workspace {
      /* Crucial: Keeps the fading-out page locked to the top of this container */
      position: relative; 
      display: block;
      width: 100%;
      
      /* Stops any side-to-side jitter or scrollbar flashing during the crossfade */
      overflow: hidden; 
      
      /* Ensures the footer stays pushed to the bottom even during the split-second transition */
      min-height: 100vh; 
    }
  `]
})
export class AppComponent {
  
  // This function tells the animation trigger exactly when the route has changed
  prepareRoute(outlet: RouterOutlet) {
    return outlet && outlet.activatedRouteData && outlet.isActivated ? outlet.activatedRoute : '';
  }
}