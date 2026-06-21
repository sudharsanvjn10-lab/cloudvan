import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamGridComponent } from './team-grid.component';

describe('TeamGridComponent', () => {
  let component: TeamGridComponent;
  let fixture: ComponentFixture<TeamGridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TeamGridComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TeamGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
