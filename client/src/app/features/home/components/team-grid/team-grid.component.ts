import { Component, OnInit, HostListener, inject, signal } from '@angular/core';
import { FadeUpDirective } from '../../../../shared/directives/fade-up.directive';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { catchError, of } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { SectionHeadingComponent } from '../../../../shared/components/section-heading/section-heading.component';

export interface TeamMember {
  id: string | number;
  name: string;
  title: string;
  bio: string;
  photoUrl: string;
  linkedin?: string;
}

@Component({
  selector: 'app-team-grid',
  standalone: true,
  imports: [CommonModule, SectionHeadingComponent, FadeUpDirective],
  template: `
    <section class="team-section">
      <div class="container">
        <app-section-heading 
          title="Our Leadership" 
          subtitle="The architects behind our global Oracle Fusion HCM delivery model."
          align="center">
        </app-section-heading>

        <div class="team-grid">
          <div class="team-card" *ngFor="let member of team(); let i = index" appFadeUp [delay]="i * 120">
            
            <div class="photo-wrapper" (click)="openBio(member)">
              <img [src]="member.photoUrl" [alt]="member.name" class="photo" loading="lazy" (error)="onImgError($event)">
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
            <img [src]="selectedMember()?.photoUrl" [alt]="selectedMember()?.name" class="modal-photo" (error)="onImgError($event)">
          </div>
          <div class="modal-info">
            <h2>{{ selectedMember()?.name }}</h2>
            <p class="modal-title">{{ selectedMember()?.title }}</p>
            <div class="divider"></div>
            <p class="modal-bio">{{ selectedMember()?.bio }}</p>
            <div class="socials" *ngIf="selectedMember()?.linkedin">
              <a [href]="selectedMember()?.linkedin" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn Profile">in</a>
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
      background-color: #f8fafc;
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
      transform: translateY(-5px);
    }

    .photo-wrapper {
      position: relative;
      width: 200px;
      height: 200px;
      margin: 0 auto 20px;
      border-radius: 50%;
      overflow: hidden;
      cursor: pointer;
      box-shadow: 0 10px 25px rgba(0,0,0,0.08);
      border: 4px solid #ffffff;
      transition: all 0.3s ease;
    }

    .team-card:hover .photo-wrapper {
      box-shadow: 0 15px 35px rgba(37, 99, 235, 0.2);
      border-color: #2563eb;
    }

    .photo { 
      width: 100%; 
      height: 100%; 
      object-fit: cover; 
      transition: transform 0.5s ease;
    }

    .team-card:hover .photo {
      transform: scale(1.08);
    }

    .hover-action {
      position: absolute;
      top: 0; left: 0; width: 100%; height: 100%;
      background: rgba(15, 23, 42, 0.6);
      backdrop-filter: blur(2px);
      display: flex; justify-content: center; align-items: center;
      opacity: 0;
      transition: opacity 0.3s ease;
      span {
        color: #ffffff;
        font-size: 0.85rem;
        font-weight: 600;
        background: #2563eb;
        padding: 6px 14px;
        border-radius: 20px;
        transform: translateY(10px);
        transition: transform 0.3s ease;
      }
    }

    .photo-wrapper:hover .hover-action {
      opacity: 1;
      span { transform: translateY(0); }
    }

    /* Text & Read More */
    .info { padding: 0 10px; }
    
    .clickable-name { 
      font-size: 1.35rem; 
      color: #0f172a; 
      margin-bottom: 5px; 
      font-weight: 700;
      cursor: pointer;
      transition: color 0.2s;
    }
    
    .clickable-name:hover { color: #2563eb; }

    .title { 
      color: #2563eb; 
      font-size: 0.9rem; 
      font-weight: 600; 
      margin-bottom: 12px;
      letter-spacing: 0.3px;
    }

    .btn-read-more {
      background: none; border: none;
      color: #64748b;
      font-size: 0.85rem;
      font-weight: 600;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      transition: all 0.2s;
      padding: 4px 8px;
      border-radius: 4px;
    }

    .btn-read-more .arrow { transition: transform 0.2s; }
    
    .btn-read-more:hover {
      color: #0f172a;
      .arrow { transform: translateX(4px); }
    }

    /* --- Modal Overlay & Animation --- */
    .modal-overlay {
      position: fixed;
      top: 0; left: 0; width: 100%; height: 100vh;
      background: rgba(15, 23, 42, 0.7);
      backdrop-filter: blur(8px);
      z-index: 2000;
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 20px;
      animation: fadeIn 0.3s ease;
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    .modal-content {
      background: #ffffff;
      width: 100%;
      max-width: 700px;
      border-radius: 20px;
      position: relative;
      overflow: hidden;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
      border: 1px solid rgba(255, 255, 255, 0.1);
      animation: slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1);
    }

    @keyframes slideUp {
      from { transform: translateY(40px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }

    .close-btn {
      position: absolute;
      top: 15px; right: 20px;
      background: none; border: none;
      font-size: 2rem; color: #64748b;
      cursor: pointer; z-index: 10;
      transition: color 0.3s;
    }
    
    .close-btn:hover { color: #0f172a; }

    .modal-body {
      display: flex;
      flex-direction: column;
    }

    @media (min-width: 600px) {
      .modal-body { flex-direction: row; }
    }

    .modal-photo-container {
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 30px;
      background: #f8fafc;
    }
    
    @media (min-width: 600px) {
      .modal-photo-container { width: 40%; }
    }

    .modal-photo {
      width: 180px; 
      height: 180px; 
      border-radius: 50%;
      object-fit: cover;
      box-shadow: 0 10px 25px rgba(0,0,0,0.1);
      border: 3px solid #ffffff;
    }

    .modal-info {
      padding: 40px 30px;
      width: 100%;
      text-align: left;
    }
    
    @media (min-width: 600px) {
      .modal-info { width: 60%; }
    }

    .modal-info h2 { color: #0f172a; font-size: 1.8rem; margin-bottom: 5px; font-weight: 700; }
    .modal-title { color: #2563eb; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; font-size: 0.9rem;}
    
    .divider {
      height: 3px; width: 40px; background: #2563eb; margin: 20px 0; border-radius: 2px;
    }

    .modal-bio { color: #475569; line-height: 1.7; font-size: 1rem; margin-bottom: 25px; }

    .socials a {
      display: inline-flex; justify-content: center; align-items: center;
      width: 36px; height: 36px; border-radius: 50%; background: #f1f5f9;
      color: #0f172a; font-weight: bold; font-size: 0.9rem; text-decoration: none; transition: 0.3s;
    }
    .socials a:hover { background: #2563eb; color: #fff; transform: translateY(-3px); box-shadow: 0 4px 10px rgba(37,99,235,0.3);}
  `]
})
export class TeamGridComponent implements OnInit {
  private http = inject(HttpClient);

  selectedMember = signal<TeamMember | null>(null);

  @HostListener('document:keydown.escape')
  onEscape() {
    if (this.selectedMember()) {
      this.closeBio();
    }
  }

  onImgError(event: Event) {
    const img = event.target as HTMLImageElement;
    img.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="%232563eb"><circle cx="50" cy="38" r="22" opacity="0.8"/><circle cx="50" cy="98" r="40" opacity="0.6"/></svg>';
  }

  private fallbackTeam: TeamMember[] = [
    {
      id: '1', name: 'Jeevanantham R.', title: 'Founder & Director',
      bio: 'Jeevanantham R, the founder and director of Cloud Vantage Solutions is a lead Oracle HCM Cloud Solution Architect who brings over 20+ years of extensive experience and expertise to the table. With a strong commitment to delivering innovative solutions, he plays a pivotal role in spearheading the growth and success of our company. In his capacity, he oversees Service Delivery and Global operations. Prior to founding Cloud Vantage he held key positions at renowned companies, including Bahwan Cybertek, Hexaware Transsys and others.',
      photoUrl: '/assets/jeevanantham.png',
      linkedin: 'https://www.linkedin.com/company/cloud-vantage-solutions/'
    },
    {
      id: '2', name: 'Mahendran P', title: 'Delivery Head',
      bio: 'With more than 18 years of overall IT experience in Oracle and related Technologies involving a spectrum of responsibilities, Mahendran P has hands-on project implementation experience in Agile methodology. At Cloud Vantage Solutions, he leads the Oracle Fusion HCM Core Architecture, Fast Formulas, and Fusion Integration (OIC/ICS/SOA) competence tracks.',
      photoUrl: '/assets/mahendran.png',
      linkedin: 'https://www.linkedin.com/company/cloud-vantage-solutions/'
    },
    {
      id: '3', name: 'Ilampooranan C.S', title: 'Technical Head',
      bio: 'C. S. ILAMPOORANAN, who serves as technical lead forms an integral part of the Cloud Vantage Solutions team. With over two decades of experience in Oracle Developer Suite and Oracle EBS experience, he takes charge of implementing customised solutions for our clients. His deep understanding of Oracle HCM Cloud Suite, coupled with passion for technology, enables him to provide guidance and expertise in delivering highly effective solutions.',
      photoUrl: '/assets/ilampooranan.png',
      linkedin: 'https://www.linkedin.com/company/cloud-vantage-solutions/'
    },
    {
      id: '4', name: 'Srinivas A', title: 'Sales and Marketing Specialist',
      bio: 'Srinivas A, our dedicated Sales and Marketing Specialist is driven by a profound passion for identifying and delivering solutions that precisely align with our clients needs and expectations. In his role, he assumes responsibility for crafting and executing our sales strategy, fostering growth and undertaking business development initiatives that drive the success of Cloud Vantage Solutions.',
      photoUrl: '/assets/srinivas.png',
      linkedin: 'https://www.linkedin.com/company/cloud-vantage-solutions/'
    }
  ];

  team = signal<TeamMember[]>(this.fallbackTeam);

  ngOnInit() {
    this.http.get<TeamMember[]>(`${environment.apiUrl}/team`)
      .pipe(catchError(() => of(this.fallbackTeam)))
      .subscribe(data => {
        if (data && data.length > 0) {
          this.team.set(data);
        }
      });
  }

  openBio(member: TeamMember) {
    this.selectedMember.set(member);
    document.body.style.overflow = 'hidden';
  }

  closeBio() {
    this.selectedMember.set(null);
    document.body.style.overflow = 'auto';
  }
}
