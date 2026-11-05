import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CareersComponent } from './careers.component';
import { environment } from '../../../environments/environment';

describe('CareersComponent', () => {
  let component: CareersComponent;
  let fixture: ComponentFixture<CareersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CareersComponent],
      providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([])]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CareersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    TestBed.inject(HttpTestingController).expectOne(`${environment.apiUrl}/jobs`).flush([]);
  });

  afterEach(() => TestBed.inject(HttpTestingController).verify());

  it('preserves an empty jobs list', () => {
    expect(component.jobsState()).toBe('loading');
    expect(component.jobs()).toEqual([]);
    TestBed.inject(HttpTestingController).expectOne(`${environment.apiUrl}/jobs`).flush([]);
    fixture.detectChanges();
    expect(component.jobsState()).toBe('loaded');
    expect(fixture.nativeElement.textContent).toContain('There are no open positions');
  });

  it('shows an outage without sample jobs', () => {
    TestBed.inject(HttpTestingController).expectOne(`${environment.apiUrl}/jobs`)
      .flush({}, { status: 503, statusText: 'Unavailable' });
    fixture.detectChanges();
    expect(component.jobs()).toEqual([]);
    expect(fixture.nativeElement.textContent).toContain('Openings are temporarily unavailable');
  });
});
