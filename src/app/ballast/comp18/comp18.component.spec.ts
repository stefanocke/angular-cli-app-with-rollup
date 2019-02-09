import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Comp18Component } from './comp18.component';

describe('Comp18Component', () => {
  let component: Comp18Component;
  let fixture: ComponentFixture<Comp18Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Comp18Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Comp18Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
