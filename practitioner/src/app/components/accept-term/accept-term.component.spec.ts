import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcceptTermComponent } from './accept-term.component';

describe('AcceptTermComponent', () => {
  let component: AcceptTermComponent;
  let fixture: ComponentFixture<AcceptTermComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AcceptTermComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AcceptTermComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
