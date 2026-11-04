import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SectionHeadingComponent } from '../../shared/components/section-heading/section-heading.component';
import { TeamGridComponent } from '../home/components/team-grid/team-grid.component';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, SectionHeadingComponent, TeamGridComponent],
  template: `
    <div class="inner-hero">
      <div class="container">
        <h1>About Cloud Vantage</h1>
        <p>Architecting enterprise futures across Chennai and Madurai.</p>
      </div>
    </div>

    <section class="about-content">
      <div class="container layout">
        <div class="text-block">
          <h2>Our Story</h2>
          <p>
            Cloud Vantage Solutions, is the most reliable and preferred partner in Oracle’s illustrious realm of HCM Cloud in the Middle Eastern region and USA. Our prestigious headquarters located in the vibrant city of Madurai radiates commitment while offshore development centres nestled in India specifically Chennai & Madurai amplify our global reach and prowess. 
            Driven by commitment and enthusiasm, our tireless pursuits of innovation propel us forward.</p>
           <p>Unleashing the power of Oracle HCM Cloud we facilitate organisations streamline their human capital management processes for unparalleled efficiency. We offer a comprehensive suite of functionalities encompassing from employee Experience to HR and Benefits, to Talent Management and Recruiting, to Workforce Management, HR analytics, payroll management and more.</p>
            <p>Dedicated exclusively to Oracle Fusion HCM, we deliver tailored end-to-end human capital solutions encompassing Global HR, Payroll, Talent, Workforce Management, and Redwood UI extensions.</p>
            <p>At Cloud Vantage, we pride ourselves on our commitment to customer satisfaction. Our expert team collaborates closely with the clients to empower them with customised features and solutions that align with their unique business goals. We value transparency and open communication, building trust and long-term partnerships with our clients.</p>
            <p>Unlock the potential of innovation and discover the transformation with us.</p>
        </div>
        
        <div class="mission-block">
          <div class="mission-card">
            <h3>Our Mission</h3>
            <p>"We help manage the most important asset of any company — its people."</p>
            <p class="sub">By deploying tailored Oracle Fusion HCM solutions, we empower workforces and streamline complex human capital realities.</p>
          </div>
        </div>
      </div>
    </section>

    <section class="vvm-section">
      <div class="container">
        <div class="section-header text-center">
          <h2>Our Driving Force</h2>
          <div class="title-underline"></div>
        </div>
        
        <div class="vvm-grid">
          <div class="vvm-card">
            <div class="icon-circle">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z"></path>
                <circle cx="12" cy="12" r="3"></circle>
              </svg>
            </div>
            <h3>Our Vision</h3>
            <p>To emerge as a globally preeminent consulting firm and the most preferred 
              partner for organisations, fostering an inclusive vibrant environment where 
              clients, partners and employees discover a profound sense of belonging while
               upholding our fundamental principles.</p>
          </div>

          <div class="vvm-card">
            <div class="icon-circle">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <circle cx="12" cy="12" r="9"></circle>
                <circle cx="12" cy="12" r="5"></circle>
                <circle cx="12" cy="12" r="1"></circle>
              </svg>
            </div>
            <h3>Our Mission</h3>
            <p>Empowering organizations, realize immense potential by meticulously crafting 
              innovative Cloud Solutions through unrestrained commitment and unwavering 
              integrity ensuring unparalleled contentment within an ambiance of unbridled joy.</p>
          </div>

          <div class="vvm-card">
            <div class="icon-circle">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <path d="m12 3 2.6 5.3 5.9.9-4.2 4.1 1 5.8-5.3-2.8-5.3 2.8 1-5.8L3.5 9.2l5.9-.9L12 3Z"></path>
              </svg>
            </div>
            <h3>Our Core Values</h3>
            <ul class="values-list">
              <li><strong>Innovation:</strong> Embracing future-ready technologies.</li>
              <li><strong>Integrity:</strong> Building transparent, lasting partnerships.</li>
              <li><strong>Excellence:</strong> Delivering unsurpassed technical quality.</li>
              <li><strong>Client-Centricity:</strong> Your success is our ultimate goal.</li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <section class="trust-section">
      <div class="container text-center">
        <h2>Trusted by Global Leaders</h2>
        <div class="title-underline"></div>
        <p class="section-subtitle">We collaborate with top enterprises and strategic partners to deliver unparalleled Oracle Cloud solutions.</p>
        
        <div class="trust-grid">
          <div class="trust-image-wrapper">
            <h3 class="trust-heading">Our Valued Clients</h3>
            <div class="image-box">
              <img src="/assets/clients.png" alt="Cloud Vantage Clients" loading="lazy">
            </div>
          </div>

          <div class="trust-image-wrapper">
            <h3 class="trust-heading">Our Strategic Partners</h3>
            <div class="image-box">
              <img src="/assets/partners.png" alt="Cloud Vantage Partners" loading="lazy">
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="testimonials-section">
      <div class="container">
        <div class="section-header text-center">
          <h2>What Our Clients Say</h2>
          <div class="title-underline"></div>
        </div>
        
        <div class="testimonials-grid">
          <div class="testimonial-card">
            <div class="quote-marks">"</div>
            <p class="quote-text">Cloud Vantage completely transformed our HR operations. Their Oracle HCM implementation was seamless, and their offshore team in Chennai delivered on every promise with incredible precision.</p>
            <div class="author-info">
              <h4>HR Director</h4>
              <span>Leading Retail Enterprise, Dubai</span>
            </div>
          </div>

          <div class="testimonial-card">
            <div class="quote-marks">"</div>
            <p class="quote-text">The expertise their team brought to our complex Oracle Fusion HCM deployment and Payroll migration saved us hundreds of hours. They are not just consultants; they are true strategic partners invested in our growth.</p>
            <div class="author-info">
              <h4>Chief Financial Officer</h4>
              <span>Global Manufacturing Corp, USA</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <div style="background-color: var(--color-white); padding-top: 2rem;">
      <app-team-grid></app-team-grid>
    </div>
  `,
  styles: [`
    /* --- EXISTING STYLES --- */
    .about-content {
      padding: 6rem 0;
      background-color: var(--color-gray-50);
    }

    .layout {
      display: grid;
      grid-template-columns: 1fr;
      gap: 4rem;
      
      @media (min-width: 1024px) {
        grid-template-columns: 1.5fr 1fr;
        align-items: center;
      }
    }

    .text-block {
      h2 { font-size: 2.5rem; margin-bottom: 1.5rem; color: var(--color-primary); }
      p { color: var(--text-muted); font-size: 1.1rem; line-height: 1.8; margin-bottom: 1.5rem; }
    }

    .mission-card {
      background: var(--color-primary);
      color: #fff;
      padding: 3rem;
      border-radius: 8px;
      box-shadow: 0 20px 40px rgba(0,0,0,0.1);
      position: relative;
      overflow: hidden;
      
      &::before {
        content: '"';
        position: absolute;
        top: -20px;
        left: 20px;
        font-size: 8rem;
        color: rgba(255,255,255,0.05);
        font-family: var(--font-heading, "Outfit", sans-serif);
      }

      h3 { color: var(--color-accent); font-size: 1.5rem; margin-bottom: 1.5rem; text-transform: uppercase; letter-spacing: 1px;}
      p { font-size: 1.5rem; font-weight: 600; line-height: 1.4; margin-bottom: 1.5rem; font-style: italic; }
      .sub { font-size: 1rem; font-weight: 400; color: var(--text-muted, #64748b); font-style: normal; }
    }

    /* --- NEW SHARED STYLES --- */
    .text-center { text-align: center; }
    .section-header h2 { font-size: 2.5rem; color: var(--color-primary); margin-bottom: 10px; }
    .title-underline { width: 60px; height: 4px; background-color: var(--color-accent, #2563eb); margin: 0 auto 40px; border-radius: 2px; }
    .section-subtitle { font-size: 1.15rem; color: var(--text-muted, #475569); max-width: 700px; margin: 0 auto 50px; line-height: 1.6; }

    /* --- NEW: VISION, MISSION, VALUES STYLES --- */
    .vvm-section {
      padding: 6rem 0;
      background-color: #ffffff;
    }

    .vvm-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 30px;
      @media (min-width: 900px) { grid-template-columns: repeat(3, 1fr); }
    }

    .vvm-card {
      background: #f8fafc;
      padding: 40px 30px;
      border-radius: 12px;
      border: 1px solid #e2e8f0;
      transition: transform 0.3s ease, box-shadow 0.3s ease;
      text-align: center;

      &:hover {
        transform: translateY(-5px);
        box-shadow: 0 15px 30px rgba(0,0,0,0.08);
        border-color: var(--color-accent, #2563eb);
      }

      .icon-circle {
        width: 70px; height: 70px;
        background: rgba(37, 99, 235, 0.12);
        color: var(--color-accent, #2563eb);
        display: flex; align-items: center; justify-content: center;
        border-radius: 50%;
        margin: 0 auto 20px;
        svg { width: 30px; height: 30px; display: block; }
      }

      h3 { color: var(--color-primary); font-size: 1.5rem; margin-bottom: 15px; }
      p { color: var(--text-muted); line-height: 1.6; font-size: 1rem; }
    }

    .values-list {
      list-style: none; padding: 0; margin: 0; text-align: left;
      li {
        color: var(--text-muted); padding: 8px 0; border-bottom: 1px solid #e2e8f0; font-size: 0.95rem;
        &:last-child { border-bottom: none; }
        strong { color: var(--color-primary); display: block; margin-bottom: 2px;}
      }
    }

    /* --- NEW: CLIENTS & PARTNERS STYLES --- */
    .trust-section {
      padding: 6rem 0;
      background-color: #f8fafc;
      border-top: 1px solid #e2e8f0;
      border-bottom: 1px solid #e2e8f0;
    }

    .trust-grid {
      display: grid; grid-template-columns: 1fr; gap: 40px; max-width: 1200px; margin: 0 auto;
      @media (min-width: 992px) { grid-template-columns: 1fr 1fr; gap: 60px; }
    }

    .trust-image-wrapper { display: flex; flex-direction: column; align-items: center; }
    .trust-heading { font-size: 1.5rem; color: var(--color-primary); margin-bottom: 24px; font-weight: 600; }
    
    .image-box {
      width: 100%; border-radius: 16px; overflow: hidden;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05); background: #ffffff;
      transition: transform 0.3s ease, box-shadow 0.3s ease;
      
      &:hover { transform: translateY(-5px); box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1); }
      img { width: 100%; height: auto; display: block; object-fit: contain; }
    }

    /* --- NEW: TESTIMONIALS STYLES --- */
    .testimonials-section {
      padding: 6rem 0;
      background-color: #ffffff;
    }

    .testimonials-grid {
      display: grid; grid-template-columns: 1fr; gap: 30px;
      @media (min-width: 900px) { grid-template-columns: 1fr 1fr; }
    }

    .testimonial-card {
      background: var(--color-primary);
      padding: 40px;
      border-radius: 12px;
      color: #ffffff;
      position: relative;
      box-shadow: 0 10px 25px rgba(0, 31, 63, 0.15);

      .quote-marks {
        position: absolute; top: 20px; right: 30px;
        font-size: 6rem; font-family: var(--font-heading, "Outfit", sans-serif); color: rgba(255,255,255,0.05); line-height: 1;
      }

      .quote-text {
        font-size: 1.15rem; line-height: 1.7; font-style: italic; margin-bottom: 30px; position: relative; z-index: 2; color: #e2e8f0;
      }

      .author-info {
        border-top: 1px solid rgba(255,255,255,0.1); padding-top: 20px;
        h4 { color: var(--color-accent); font-size: 1.1rem; margin-bottom: 4px; }
        span { color: #94a3b8; font-size: 0.9rem; }
      }
    }
  `]
})
export class AboutComponent {}