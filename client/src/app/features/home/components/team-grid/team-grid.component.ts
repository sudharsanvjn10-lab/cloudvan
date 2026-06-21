import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SectionHeadingComponent } from '../../../../shared/components/section-heading/section-heading.component';

export interface TeamMember {
  id: string;
  name: string;
  title: string;
  bio: string;
  photoUrl: string;
}

@Component({
  selector: 'app-team-grid',
  standalone: true,
  imports: [CommonModule, SectionHeadingComponent],
  template: `
    <section class="team-section">
      <div class="container">
        <app-section-heading 
          title="Our Leadership" 
          subtitle="The architects behind our global enterprise delivery model."
          align="center">
        </app-section-heading>

        <div class="team-grid">
          <div class="team-card" *ngFor="let member of team()">
            <div class="photo-wrapper">
              <img [src]="member.photoUrl" [alt]="member.name" class="photo" loading="lazy">
              <div class="bio-overlay">
                <p>{{ member.bio }}</p>
                <div class="socials">
                  <a href="#" aria-label="LinkedIn">in</a>
                </div>
              </div>
            </div>
            <div class="info">
              <h3>{{ member.name }}</h3>
              <p class="title">{{ member.title }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .team-section { padding: 6rem 0; background-color: var(--color-gray-50, #f8fafc); }
    .team-grid {
      display: grid; grid-template-columns: 1fr; gap: 3rem; max-width: 1000px; margin: 0 auto;
      @media (min-width: 768px) { grid-template-columns: repeat(2, 1fr); }
      @media (min-width: 1024px) { grid-template-columns: repeat(4, 1fr); gap: 2rem; }
    }
    .team-card { text-align: center; }
    
    .photo-wrapper {
      position: relative; width: 200px; height: 200px; margin: 0 auto 1.5rem;
      border-radius: 50%; overflow: hidden; /* Crucial for keeping overlay inside circle */
      box-shadow: 0 10px 25px rgba(0,0,0,0.1);
      @media (min-width: 1024px) { width: 180px; height: 180px; }
    }
    
    .photo { width: 100%; height: 100%; object-fit: cover; transition: transform 0.5s ease; }
    
    .bio-overlay {
      position: absolute; top: 0; left: 0; width: 100%; height: 100%;
      background: rgba(0, 31, 63, 0.92); /* Dark navy transparent */
      color: #fff; display: flex; flex-direction: column; justify-content: center; align-items: center;
      padding: 1.2rem; opacity: 0; transition: opacity 0.4s ease;
      overflow-y: auto; /* Allows scrolling if bio is slightly too long */
    }
    
    .bio-overlay p { font-size: 0.8rem; line-height: 1.5; margin-bottom: 1rem; }
    
    .socials a {
      display: inline-flex; justify-content: center; align-items: center;
      width: 30px; height: 30px; border-radius: 50%; background: #00a8cc;
      color: #fff; font-weight: bold; font-size: 0.8rem; text-decoration: none; transition: 0.3s;
    }
    .socials a:hover { background: #fff; color: #00a8cc; }
    
    /* The Hover Triggers */
    .photo-wrapper:hover .photo { transform: scale(1.15); }
    .photo-wrapper:hover .bio-overlay { opacity: 1; }
    
    .info h3 { font-size: 1.2rem; margin-bottom: 0.25rem; color: #001f3f; }
    .info .title { color: #00a8cc; font-weight: 600; font-size: 0.85rem; text-transform: uppercase; letter-spacing: 0.5px;}
  `]
})
export class TeamGridComponent {
  // 100% Manual Data - Bypassing the backend
  team = signal<TeamMember[]>([
    {
      id: '1', name: 'Jeevanantham R.', title: 'Founder & Director',
      bio: 'Lead Oracle HCM Cloud Solution Architect with over 20+ years of extensive experience and expertise. Oversees Service Delivery and Global operations.',
      photoUrl: '/assets/jeevan.jpg' // Save his photo as jeevan.jpg in your assets folder
    },
    {
      id: '2', name: 'Mahendran P', title: 'Delivery Head',
      bio: '18+ years of overall IT experience in Oracle and related technologies, with hands-on project implementation experience in Agile methodology.',
      photoUrl: '/assets/mahendran.jpg' // Save his photo as mahendran.jpg
    },
    {
      id: '3', name: 'Ilampooranan C.S', title: 'Technical Head',
      bio: 'Over two decades of experience in Oracle Developer Suite and Oracle EBS. Leads implementation of customized solutions for clients.',
      photoUrl: '/assets/ilampooranan.jpg' // Save his photo as ilampooranan.jpg
    },
    {
      id: '4', name: 'Srinivas A', title: 'Sales and Marketing Specialist',
      bio: 'Driven by a passion for identifying and delivering solutions aligned with client needs. Responsible for crafting and executing sales strategy.',
      photoUrl: '/assets/srinivas.jpg' // Save his photo as srinivas.jpg
    }
  ]);
}