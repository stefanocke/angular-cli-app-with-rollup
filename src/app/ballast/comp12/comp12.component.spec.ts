import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { Comp12Component } from './comp12.component';

describe('Comp12Component', () => {
  let component: Comp12Component;
  let fixture: ComponentFixture<Comp12Component>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ Comp12Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Comp12Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
