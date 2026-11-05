import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeroCarouselComponent } from './hero-carousel.component';

describe('HeroCarouselComponent', () => {
  let component: HeroCarouselComponent;
  let fixture: ComponentFixture<HeroCarouselComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeroCarouselComponent],
      providers: [provideHttpClient(), provideRouter([])]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeroCarouselComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
