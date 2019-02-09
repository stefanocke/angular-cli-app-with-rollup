import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Comp20Component } from './comp20.component';

describe('Comp20Component', () => {
  let component: Comp20Component;
  let fixture: ComponentFixture<Comp20Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Comp20Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Comp20Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
