import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { Comp4Component } from './comp4.component';

describe('Comp4Component', () => {
  let component: Comp4Component;
  let fixture: ComponentFixture<Comp4Component>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ Comp4Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Comp4Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
