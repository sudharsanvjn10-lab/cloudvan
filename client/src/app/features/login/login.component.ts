import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="login-wrapper">
      <div class="login-card">
        
        <div class="login-header">
          <div class="logo-circle">
            <img src="/assets/logo.png" alt="Cloud Vantage Logo" class="logo-img">
          </div>
          <h2>Internal Portal</h2>
          <p>Authorized Cloud Vantage personnel only.</p>
        </div>

        <form class="login-form" (submit)="onSubmit($event)">
          <div class="form-group">
            <label for="email">Corporate Email</label>
            <input type="email" id="email" placeholder="name@cloudvantage.com" required>
          </div>

          <div class="form-group">
            <label for="password">Password</label>
            <input type="password" id="password" placeholder="••••••••" required>
          </div>

          <div class="form-actions">
            <a href="#" class="forgot-link" (click)="$event.preventDefault()">Forgot password?</a>
          </div>

          <button type="submit" class="btn-submit">Secure Login</button>
        </form>

        <div class="login-footer">
          <a routerLink="/" class="back-link">&larr; Back to Public Website</a>
        </div>

      </div>
    </div>
  `,
  styles: [`
    .login-wrapper {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: #F5F5F7;
      background-image: linear-gradient(135deg, #F5F5F7 0%, #E2E8F0 100%);
      padding: 20px;
      font-family: 'Inter', sans-serif;
    }

    /* --- Box/Card Effects --- */
    .login-card {
      background: #ffffff;
      width: 100%;
      max-width: 420px;
      padding: 40px;
      border-radius: 16px;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
      border: 1px solid rgba(0,0,0,0.05);
      /* Smooth transition for the hover effect */
      transition: transform 0.5s cubic-bezier(0.165, 0.84, 0.44, 1), box-shadow 0.5s ease;
    }

    /* Card lifts and shadow deepens on hover */
    .login-card:hover {
      transform: translateY(-8px);
      box-shadow: 0 30px 60px rgba(0, 0, 0, 0.12);
    }

    .login-header {
      text-align: center;
      margin-bottom: 30px;
    }

    /* --- Logo Effects --- */
    .logo-circle {
      width: 70px;
      height: 70px;
      border-radius: 50%;
      background: var(--color-primary, #001f3f);
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 20px;
      box-shadow: 0 8px 16px rgba(0, 31, 63, 0.15);
      transition: transform 0.5s ease, box-shadow 0.5s ease;
    }

    .logo-img {
      width: 60%;
      height: 60%;
      object-fit: contain;
      filter: brightness(0) invert(1);
      transition: transform 0.5s ease;
    }

    /* Logo reacts when hovering over the card */
    .login-card:hover .logo-circle {
      transform: scale(1.08) translateY(-3px);
      box-shadow: 0 12px 24px rgba(0, 31, 63, 0.25);
    }
    
    .login-card:hover .logo-img {
      transform: scale(1.1) rotate(5deg);
    }

    .login-header h2 {
      color: #1D1D1F;
      font-size: 1.6rem;
      font-weight: 700;
      margin-bottom: 5px;
      letter-spacing: -0.02em;
    }

    .login-header p {
      color: #64748b;
      font-size: 0.9rem;
    }

    .form-group {
      margin-bottom: 20px;
    }

    .form-group label {
      display: block;
      color: #1D1D1F;
      font-size: 0.85rem;
      font-weight: 600;
      margin-bottom: 8px;
      transition: color 0.3s ease;
    }

    /* --- Input Field Effects --- */
    .form-group input {
      width: 100%;
      padding: 12px 16px;
      border: 2px solid #e2e8f0;
      border-radius: 8px;
      font-size: 1rem;
      font-family: 'Inter', sans-serif;
      transition: all 0.3s cubic-bezier(0.165, 0.84, 0.44, 1);
      background: #f8fafc;
    }

    .form-group input:hover {
      border-color: #cbd5e1;
      background: #ffffff;
    }

    .form-group input:focus {
      outline: none;
      border-color: var(--color-accent, #00a8cc);
      background: #ffffff;
      transform: translateY(-2px);
      box-shadow: 0 8px 16px rgba(0, 168, 204, 0.15);
    }
    
    .form-group input:focus + label {
      color: var(--color-accent, #00a8cc);
    }

    .form-actions {
      display: flex;
      justify-content: flex-end;
      margin-bottom: 25px;
    }

    .forgot-link {
      color: var(--color-accent, #00a8cc);
      font-size: 0.85rem;
      font-weight: 500;
      text-decoration: none;
      transition: all 0.2s ease;
    }

    .forgot-link:hover {
      text-decoration: underline;
      color: #001f3f;
    }

    /* --- Button Effects --- */
    .btn-submit {
      width: 100%;
      padding: 14px;
      background: var(--color-primary, #001f3f);
      color: #ffffff;
      border: none;
      border-radius: 8px;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
      z-index: 1;
    }

    /* Button glow pseudo-element */
    .btn-submit::before {
      content: '';
      position: absolute;
      top: 0; left: 0; width: 100%; height: 100%;
      background: var(--color-accent, #00a8cc);
      z-index: -1;
      opacity: 0;
      transition: opacity 0.4s ease;
    }

    .btn-submit:hover {
      transform: translateY(-4px) scale(1.02);
      box-shadow: 0 12px 25px rgba(0, 168, 204, 0.4);
      letter-spacing: 1px;
    }

    .btn-submit:hover::before {
      opacity: 1;
    }

    .btn-submit:active {
      transform: translateY(0) scale(0.98);
      box-shadow: 0 4px 10px rgba(0, 168, 204, 0.3);
    }

    .login-footer {
      margin-top: 30px;
      text-align: center;
      padding-top: 20px;
      border-top: 1px solid #e2e8f0;
    }

    .back-link {
      color: #64748b;
      font-size: 0.9rem;
      font-weight: 500;
      text-decoration: none;
      display: inline-block;
      transition: all 0.3s ease;
    }

    .back-link:hover {
      color: #1D1D1F;
      transform: translateX(-4px); /* Gently slides to the left */
    }
  `]
})
export class LoginComponent {
  onSubmit(event: Event) {
    event.preventDefault();
    alert('This is a dummy portal. Backend authentication will be connected later!');
  }
}