import { Routes } from '@angular/router';

export const routes: Routes = [
  { 
    path: '', 
    loadComponent: () => import('./features/home/home.component').then(c => c.HomeComponent),
    title: 'Cloud Vantage Solutions | Oracle Consulting'
  },
  { 
    path: 'about', 
    loadComponent: () => import('./features/about/about.component').then(c => c.AboutComponent),
    title: 'About Us | Cloud Vantage Solutions'
  },
  { 
    path: 'services', 
    loadComponent: () => import('./features/services/services.component').then(c => c.ServicesComponent),
    title: 'Oracle Cloud Services | Cloud Vantage Solutions'
  },
  { 
    path: 'insights', 
    loadComponent: () => import('./features/insights/insights.component').then(c => c.InsightsComponent),
    title: 'Insights & News | Cloud Vantage Solutions'
  },
  { 
    path: 'careers', 
    loadComponent: () => import('./features/careers/careers.component').then(c => c.CareersComponent),
    title: 'Careers | Cloud Vantage Solutions'
  },
  { 
    path: 'contact', 
    loadComponent: () => import('./features/contact/contact.component').then(c => c.ContactComponent),
    title: 'Contact Us | Cloud Vantage Solutions'
  },
  { 
    path: 'login', 
    loadComponent: () => import('./features/login/login.component').then(c => c.LoginComponent),
    title: 'Internal Portal | Cloud Vantage Solutions'
  },
  { path: '**', redirectTo: '' } // Fallback for 404s
];