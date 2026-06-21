import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WhyCloudVantageComponent } from './why-cloud-vantage.component';

describe('WhyCloudVantageComponent', () => {
  let component: WhyCloudVantageComponent;
  let fixture: ComponentFixture<WhyCloudVantageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WhyCloudVantageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WhyCloudVantageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
