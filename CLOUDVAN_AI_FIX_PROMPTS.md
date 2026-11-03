# CloudVan UI — Complete AI Fix & Execution Prompts (`CODEBASE_AUDIT_REPORT.md` Action Plan)

Intha `.md` file-ah unga local project root folder-la save pannikonga. Namma edutha `CODEBASE_AUDIT_REPORT.md`-la irukura ella **Issues-aiyum** + **Oracle Fusion HCM-Only Content Cleanup**-aiyum step-by-step-ah auto-fix panna, keela irukura Batch Prompts-ah ovvonna copy-paste panni unga local AI editor-la (Cursor / Windsurf / VS Code Copilot) kudunga.

---

## BATCH 0: Exclusive Oracle Fusion HCM Content Cleanup (Remove ERP, SCM, EPM, CX Everywhere!)

Unga company **Oracle Fusion HCM** related services mattum thaan provide panranga. Athanaala website-la entha page-la ellam **Oracle Fusion ERP, Oracle Fusion SCM, Oracle Fusion EPM, Oracle Fusion CX** iruko atha ellam complete-ah remove panniட்டு, full-ah **Oracle Fusion HCM** modules-ah mattum showcase panna intha prompt-ah first run pannunga:

```
@workspace Execute a complete content & domain alignment cleanup across the entire codebase (`client/` and `server/`):

Our company (Cloud Vantage Solutions) exclusively provides **Oracle Fusion HCM (Human Capital Management)** consulting, implementation, customization, and support services. We DO NOT provide Oracle Fusion ERP, Oracle Fusion SCM, Oracle Fusion EPM, or Oracle Fusion CX.

1. Search & Remove Non-HCM Pillars Everywhere:
   - Scan all files across `client/src/` (including Home, Hero Carousel, Services page, About Us, Footer links, Contact service dropdowns, Careers job descriptions, and Meta tags in `index.html`) and `server/` (`server.js` seed data/mock data).
   - Completely remove all cards, tabs, bullet points, dropdown options, or paragraphs mentioning:
     - **Oracle Fusion ERP** (Financials, Procurement, Project Management, Risk Management)
     - **Oracle Fusion SCM** (Supply Chain Management, Inventory, Order Management, Logistics)
     - **Oracle Fusion EPM** (Enterprise Performance Management, Planning, Financial Close)
     - **Oracle Fusion CX** (Customer Experience, Sales, Service, Marketing)

2. Replace & Expand with Dedicated Oracle Fusion HCM Offerings:
   - Wherever ERP, SCM, EPM, or CX cards/sections existed (especially on the Home page service grid, Services page, and Footer), replace them with core **Oracle Fusion HCM** specializations so the UI layout/grid remains balanced and visually rich:
     - **Core HR & Global Human Resources** (Workforce Structures, Person Models, Journeys & Pre-boarding)
     - **Oracle Fusion Payroll & Compensation** (Global Payroll, Fast Formulas, Retro Pay, Total Compensation)
     - **Time & Labor and Absence Management** (Leave Delegation, Shift Scheduling, Accrual Plans)
     - **Talent Management & Recruiting (ORC)** (Oracle Recruiting Cloud, Performance, Goals, Learning)
     - **Redwood UI & Visual Builder Studio (VBS) Extensions** (Page Customizations, JavaScript Action Chains, Business Rules)
     - **HCM Technical Integrations & BI Reporting** (HCM Data Loader - HDL, HCM Extracts, REST APIs, OTBI & BI Publisher)

3. Update Dropdowns, Careers & Navigation:
   - In `contact.component.ts` (if there is a service inquiry subject/dropdown), ensure options only list Oracle Fusion HCM tracks.
   - In `careers.component.ts`, ensure all open job roles and descriptions are tailored to Oracle Fusion HCM Functional/Technical Consultants, Redwood VBS Developers, and Payroll Specialists (remove any ERP/SCM/EPM/CX roles).
   - In `footer.component.ts` and `header.component.ts`, ensure all service links and taglines reflect our exclusive focus as an **Oracle Fusion HCM Partner / Specialist**.
```

---

## BATCH 1: Critical Deployment, Routing & Cold-Start Fixes

Render.com-la host panniruka live site-la (`https://cloudvan-ui.onrender.com/`) API work aagathathu, page refresh panna 404 varrathu, matrum initial blank white screen prachanaiya fix panna intha prompt-ah podunga:

```
@workspace Based on `CODEBASE_AUDIT_REPORT.md`, execute the following CRITICAL fixes right now:

1. Production API URL Fix (`client/src/environments/environment.ts`):
   - Currently `environment.ts` has `apiUrl: 'http://localhost:3000/api'` even when `production: true`.
   - Create `client/src/environments/environment.development.ts` for `http://localhost:3000/api` (if not already split in `angular.json`) and update `environment.ts` so it points to the production backend URL (or uses a clean production API base URL).

2. Render SPA Routing 404 Fix (`_redirects`):
   - Create a file `client/src/_redirects` containing:
     `/* /index.html 200`
   - Register `src/_redirects` inside `client/angular.json` under `projects -> client -> architect -> build -> options -> assets` so refreshing routes like `/services`, `/careers`, or `/login` on Render never gives a 404 error.

3. Initial Preloader & SEO Meta Tags (`client/src/index.html`):
   - Add proper `<meta name="description">`, `<meta name="keywords">`, and OpenGraph tags (`og:title`, `og:description`, `og:image`, `og:url`, `twitter:card`) for "Cloud Vantage Solutions — Oracle Fusion HCM Specialists" pointing to `https://cloudvan-ui.onrender.com/`.
   - Inside `<app-root></app-root>`, add a lightweight, pure-CSS royal-blue/navy loading spinner + "Cloud Vantage Solutions" brand text so visitors don't see a blank white screen during Render cold starts or initial JS bundle load. (Angular will automatically replace `<app-root>` inner content once bootstrapped).
```

---

## BATCH 2: Broken CSS, Dead Links (`href="#"`) & Duplicate File Cleanup

Contact page-la udanjiruka Registered Office card styling, mobile logout button issue, matrum dead links-ah fix panna intha prompt-ah podunga:

```
@workspace Based on `CODEBASE_AUDIT_REPORT.md`, execute these UI & Code Cleanup fixes across the Angular client:

1. Fix Broken CSS Class (`client/src/app/features/contact/contact.component.ts` Lines 59-64):
   - Change `<div class="Registered Office">` to `<div class="office registered-office">` so the `.office` SCSS rules (around Line 101) properly style the Registered Office card.

2. Fix Mobile Logout Anti-Pattern (`client/src/app/core/layout/header/header.component.ts` Line 95):
   - Replace `<a href="#" (click)="onLogout($event)">` with a semantic `<button type="button" class="logout-btn" (click)="onLogout()">` and ensure its SCSS matches the mobile drawer link styling without causing `#` hash jumps.

3. Fix Dead `href="#"` Links:
   - In `client/src/app/shared/components/card/card.component.ts` (Line 15): Replace `<a href="#" class="read-more">` with a dynamic `@Input() link?: string` using `[routerLink]="link"` (or only render the link if `@Input() link` is provided, preventing top-of-page scroll jumps).
   - In `client/src/app/features/home/components/team-grid/team-grid.component.ts` (Line 63): Add an optional `linkedin?: string` field to the team member interface/data, bind `[href]="selectedMember()?.linkedin"` with `target="_blank" rel="noopener"`, or hide the LinkedIn badge if no URL is present.

4. Remove Dead/Duplicate Files & Unused Directives:
   - Delete the duplicate file `client/src/app/shared/components/button/component.ts`.
   - Apply `FadeUpDirective` (`client/src/app/shared/directives/fade-up.directive.ts`) to key section headers on the Home page so it is actively utilized, or clean up unused shared declarations.
```

---

## BATCH 3: API Integration, Loading Spinners, Error Banners & Auth Interceptor

Forms double-submit aagurathu, backend down-ah iruntha user-ku error theriyathathu, matrum `/api/team` connect aagathatha fix panna intha prompt-ah podunga:

```
@workspace Based on `CODEBASE_AUDIT_REPORT.md`, execute these API, State, and Security upgrades:

1. Form Loading & Error Feedback (`contact.component.ts` & `careers.component.ts`):
   - In both `client/src/app/features/contact/contact.component.ts` and `client/src/app/features/careers/careers.component.ts`:
     - Add Angular Signals: `isSubmitting = signal(false)` and `errorMessage = signal<string | null>(null)`.
     - Disable the submit button while `isSubmitting()` is true and change button text to `"Submitting..."` with a small CSS spinner to prevent duplicate database entries.
     - In the `.subscribe({ error: (err) => ... })` block, set a clear user-friendly message in `errorMessage` and display a styled red alert banner in the template instead of only logging to `console.error()`.

2. Connect Team Grid to Backend API (`client/src/app/features/home/components/team-grid/team-grid.component.ts`):
   - Inject `HttpClient` and fetch team members from `${environment.apiUrl}/team` (`GET /api/team` already exists in `server/server.js` Line 87).
   - Use the existing hardcoded team array as a seamless fallback inside `catchError()` so the UI always renders even if the backend is offline.

3. Add Functional HTTP Auth Interceptor (`client/src/app/core/interceptors/auth.interceptor.ts`):
   - Create an Angular 18 functional `HttpInterceptorFn` that:
     a) Automatically attaches `Authorization: Bearer <token>` from `localStorage` for admin API requests.
     b) Catches `401 Unauthorized` or `403 Forbidden` responses, clears expired `localStorage` session data, and redirects to `/login`.
   - Register it in `client/src/app/app.config.ts` inside `provideHttpClient(withFetch(), withInterceptors([authInterceptor]))`.
```

---

## BATCH 4: Asset & Image Optimization (6MB -> Under 800KB)

`client/src/assets/`-la irukura heavy images (`logo3.png` 1.4MB, `clients.png` 1MB, portraits ~600KB each)-ah compress panni page speed-ah 5x fast aakka intha prompt-ah podunga:

```
@workspace Check `client/src/assets/` as noted in `CODEBASE_AUDIT_REPORT.md`.
Total image assets exceed 6 MB (`logo3.png` ~1.4MB, `clients.png` ~1.0MB, `logo.png` ~800KB, and team portrait PNGs ~600KB each).

1. Write and run a quick Node.js script (using `sharp` or built-in tools) to compress all PNGs in `client/src/assets/` losslessly/near-losslessly so each image is under 150KB without changing dimensions or visual quality.
2. Add `loading="lazy"` and explicit `width`/`height` attributes to non-hero `<img>` tags across components (such as `team-grid`, `clients`, and `footer`) to improve First Contentful Paint (FCP) and prevent layout shifts (CLS).
3. Delete the temporary compression script once the assets in `client/src/assets/` are optimized.
```

---

## BATCH 5: Dynamic Jobs API & Admin Portal Upgrade (Optional Enhancement)

Careers page-la hardcoded-ah irukura jobs-ah database & Admin Portal kooda connect panna intha prompt-ah podunga:

```
@workspace Based on Item #11 in `CODEBASE_AUDIT_REPORT.md`:
Currently, `client/src/app/features/careers/careers.component.ts` uses a static hardcoded `jobs = [...]` array.

1. In `server/server.js`, add a `GET /api/jobs` endpoint (and `POST /api/jobs` + `DELETE /api/jobs/:id` protected by `authenticateToken`) with a MySQL `jobs` table auto-initialization (falling back to the default Oracle Fusion HCM jobs list if DB is unavailable).
2. In `careers.component.ts`, fetch the jobs list from `${environment.apiUrl}/jobs` with the local hardcoded array as a fallback on error.
3. In the Admin Portal (`login.component.ts`), add a clean section allowing logged-in Admins to add or remove job openings dynamically.
```

---

## Verification Checklist (Ellam Mudinja Apram Check Panna)

Ovvoru Batch-um run panni mudichathum, terminal-la intha build & grep test prompt-ah kudunga:

```
@workspace 
1. Search the entire codebase (`client/src/` and `server/`) for any remaining occurrences of "ERP", "SCM", "EPM", or "CX" (case-insensitive) to verify 100% removal.
2. Run `npm run build` inside `client/` to verify there are zero TypeScript compilation errors, broken imports, or SCSS budget warnings, and summarize all files modified.
```
