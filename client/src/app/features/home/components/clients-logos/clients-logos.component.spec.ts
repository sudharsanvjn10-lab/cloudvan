import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientsLogosComponent } from './clients-logos.component';

describe('ClientsLogosComponent', () => {
  let component: ClientsLogosComponent;
  let fixture: ComponentFixture<ClientsLogosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientsLogosComponent],
      providers: [provideHttpClient(), provideRouter([])]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClientsLogosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
