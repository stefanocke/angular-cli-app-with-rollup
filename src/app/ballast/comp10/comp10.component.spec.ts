import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { Comp10Component } from './comp10.component';

describe('Comp10Component', () => {
  let component: Comp10Component;
  let fixture: ComponentFixture<Comp10Component>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ Comp10Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Comp10Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
