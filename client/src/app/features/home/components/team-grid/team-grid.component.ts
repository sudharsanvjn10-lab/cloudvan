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
            
            <div class="photo-wrapper" (click)="openBio(member)">
              <img [src]="member.photoUrl" [alt]="member.name" class="photo" loading="lazy">
              <div class="hover-action">
                <span>View Profile</span>
              </div>
            </div>
            
            <div class="info">
              <h3 class="clickable-name" (click)="openBio(member)">{{ member.name }}</h3>
              <p class="title">{{ member.title }}</p>
              <button class="btn-read-more" (click)="openBio(member)">
                Read More <span class="arrow">→</span>
              </button>
            </div>
            
          </div>
        </div>
      </div>
    </section>

    <div class="modal-overlay" *ngIf="selectedMember()" (click)="closeBio()">
      <div class="modal-content" (click)="$event.stopPropagation()">
        <button class="close-btn" (click)="closeBio()">&times;</button>
        
        <div class="modal-body">
          <div class="modal-photo-container">
            <img [src]="selectedMember()?.photoUrl" [alt]="selectedMember()?.name" class="modal-photo">
          </div>
          <div class="modal-info">
            <h2>{{ selectedMember()?.name }}</h2>
            <p class="modal-title">{{ selectedMember()?.title }}</p>
            <div class="divider"></div>
            <p class="modal-bio">{{ selectedMember()?.bio }}</p>
            <div class="socials">
              <a href="#" aria-label="LinkedIn">in</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    /* --- Main Section --- */
    .team-section { 
      padding: 6rem 0; 
      background-color: #f8fafc; /* Light gray background */
      font-family: 'Inter', sans-serif;
    }
    
    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 20px;
    }

    .team-grid {
      display: grid; 
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); 
      gap: 3rem 2rem; 
      margin: 40px auto 0;
    }

    /* --- Card & Hover Effects --- */
    .team-card { 
      text-align: center; 
      transition: transform 0.3s ease;
    }
    
    .team-card:hover {
      transform: translateY(-5px); /* Entire card lifts slightly */
    }
    
    .photo-wrapper {
      position: relative; 
      width: 200px; 
      height: 200px; 
      margin: 0 auto 1.5rem;
      border-radius: 50%; 
      overflow: hidden; 
      box-shadow: 0 10px 25px rgba(0,0,0,0.1);
      cursor: pointer; /* Indicates it's clickable */
      background-color: #e2e8f0; /* Fallback color if image is broken */
    }
    
    .photo { 
      width: 100%; 
      height: 100%; 
      object-fit: cover; 
      transition: transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275); 
    }

    /* The "View Profile" Hover Overlay */
    .hover-action {
      position: absolute; 
      top: 0; left: 0; width: 100%; height: 100%;
      background: rgba(0, 168, 204, 0.85); /* Teal transparent */
      color: #fff; 
      display: flex; justify-content: center; align-items: center;
      opacity: 0; 
      transition: opacity 0.3s ease;
      font-weight: 600;
      letter-spacing: 1px;
      text-transform: uppercase;
      font-size: 0.9rem;
    }
    
    .photo-wrapper:hover .photo { transform: scale(1.1); }
    .photo-wrapper:hover .hover-action { opacity: 1; }
    
    /* --- Info Section --- */
    .info h3.clickable-name { 
      font-size: 1.3rem; 
      margin-bottom: 0.25rem; 
      color: #001f3f; 
      cursor: pointer;
      transition: color 0.3s ease;
    }
    
    .info h3.clickable-name:hover {
      color: #00a8cc; /* Name turns teal on hover */
    }

    .info .title { 
      color: #64748b; 
      font-weight: 500; 
      font-size: 0.9rem; 
      text-transform: uppercase; 
      letter-spacing: 1px;
      margin-bottom: 12px;
    }

    .btn-read-more {
      background: none;
      border: none;
      color: #00a8cc;
      font-weight: 600;
      font-size: 0.9rem;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      padding: 0;
      transition: color 0.3s;
    }

    .btn-read-more .arrow {
      margin-left: 5px;
      transition: transform 0.3s;
    }

    .btn-read-more:hover { color: #001f3f; }
    .btn-read-more:hover .arrow { transform: translateX(4px); }

    /* =========================================
       Modal (Read More Detail Section)
       ========================================= */
    .modal-overlay {
      position: fixed;
      top: 0; left: 0; width: 100%; height: 100vh;
      background: rgba(0, 31, 63, 0.7);
      backdrop-filter: blur(8px);
      z-index: 2000;
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 20px;
      animation: fadeIn 0.3s ease-out;
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    .modal-content {
      background: #ffffff;
      width: 100%;
      max-width: 700px;
      border-radius: 16px;
      position: relative;
      overflow: hidden;
      box-shadow: 0 25px 50px rgba(0,0,0,0.25);
      animation: slideUp 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
    }

    @keyframes slideUp {
      from { transform: translateY(30px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }

    .close-btn {
      position: absolute;
      top: 15px; right: 20px;
      background: none; border: none;
      font-size: 2rem; color: #94a3b8;
      cursor: pointer; z-index: 10;
      transition: color 0.2s;
    }
    
    .close-btn:hover { color: #001f3f; }

    .modal-body {
      display: flex;
      flex-direction: column;
    }

    @media (min-width: 600px) {
      .modal-body { flex-direction: row; }
    }

    .modal-photo-container {
      width: 100%;
      height: 250px;
      background: #f1f5f9;
    }
    
    @media (min-width: 600px) {
      .modal-photo-container { width: 40%; height: auto; min-height: 300px; }
    }

    .modal-photo {
      width: 100%; height: 100%; object-fit: cover;
    }

    .modal-info {
      padding: 40px 30px;
      width: 100%;
      text-align: left;
    }
    
    @media (min-width: 600px) {
      .modal-info { width: 60%; }
    }

    .modal-info h2 { color: #001f3f; font-size: 1.8rem; margin-bottom: 5px; }
    .modal-title { color: #00a8cc; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; font-size: 0.9rem;}
    
    .divider {
      height: 3px; width: 40px; background: #00a8cc; margin: 20px 0; border-radius: 2px;
    }

    .modal-bio { color: #475569; line-height: 1.7; font-size: 1rem; margin-bottom: 25px; }

    .socials a {
      display: inline-flex; justify-content: center; align-items: center;
      width: 36px; height: 36px; border-radius: 50%; background: #f1f5f9;
      color: #001f3f; font-weight: bold; font-size: 0.9rem; text-decoration: none; transition: 0.3s;
    }
    .socials a:hover { background: #00a8cc; color: #fff; transform: translateY(-3px); box-shadow: 0 4px 10px rgba(0,168,204,0.3);}
  `]
})
export class TeamGridComponent {
  
  // State to hold the currently clicked member for the modal
  selectedMember = signal<TeamMember | null>(null);

  // 100% Manual Data - Replaced all photos with the dummy jeevan.png
  team = signal<TeamMember[]>([
    {
      id: '1', name: 'Jeevanantham R.', title: 'Founder & Director',
      bio: 'Lead Oracle HCM Cloud Solution Architect with over 20+ years of extensive experience and expertise. Oversees Service Delivery and Global operations. Prior to founding Cloud Vantage, held key positions at Bahwan Cybertek, Hexaware Transsys, and others.',
      photoUrl: '/assets/jeevan.png' 
    },
    {
      id: '2', name: 'Mahendran P', title: 'Delivery Head',
      bio: '18+ years of overall IT experience in Oracle and related technologies, with hands-on project implementation experience in Agile methodology. Leads the EBS Technical Competency spanning EBS Technical, Fusion ERP, Fusion HCM, and Fusion Integration (OIC/ICS/SOA).',
      photoUrl: '/assets/jeevan.png'
    },
    {
      id: '3', name: 'Ilampooranan C.S', title: 'Technical Head',
      bio: 'Over two decades of experience in Oracle Developer Suite and Oracle EBS. Leads implementation of customized solutions for clients, with deep understanding of the Oracle HCM Cloud Suite.',
      photoUrl: '/assets/jeevan.png' 
    },
    {
      id: '4', name: 'Srinivas A', title: 'Sales and Marketing Specialist',
      bio: 'Driven by a passion for identifying and delivering solutions aligned with client needs. Responsible for crafting and executing sales strategy, fostering growth, and leading business development initiatives.',
      photoUrl: '/assets/jeevan.png' 
    }
  ]);

  // Methods to handle the Modal
  openBio(member: TeamMember) {
    this.selectedMember.set(member);
    document.body.style.overflow = 'hidden'; // Prevents background scrolling when modal is open
  }

  closeBio() {
    this.selectedMember.set(null);
    document.body.style.overflow = 'auto'; // Restores background scrolling
  }
}