import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServicesPillarsComponent } from './services-pillars.component';

describe('ServicesPillarsComponent', () => {
  let component: ServicesPillarsComponent;
  let fixture: ComponentFixture<ServicesPillarsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServicesPillarsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ServicesPillarsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
