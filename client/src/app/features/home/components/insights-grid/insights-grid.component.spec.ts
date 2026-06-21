import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InsightsGridComponent } from './insights-grid.component';

describe('InsightsGridComponent', () => {
  let component: InsightsGridComponent;
  let fixture: ComponentFixture<InsightsGridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InsightsGridComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InsightsGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
