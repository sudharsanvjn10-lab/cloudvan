import { TestBed } from '@angular/core/testing';
import { ElementRef, Renderer2, PLATFORM_ID } from '@angular/core';
import { FadeUpDirective } from './fade-up.directive';

describe('FadeUpDirective', () => {
  it('should create an instance', () => {
    TestBed.configureTestingModule({
      providers: [
        FadeUpDirective,
        { provide: ElementRef, useValue: new ElementRef(document.createElement('div')) },
        { provide: Renderer2, useValue: { setStyle: () => {}, removeStyle: () => {} } },
        { provide: PLATFORM_ID, useValue: 'browser' }
      ]
    });
    const directive = TestBed.inject(FadeUpDirective);
    expect(directive).toBeTruthy();
  });
});
