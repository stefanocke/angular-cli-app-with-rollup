import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Comp7Component } from './comp7.component';

describe('Comp7Component', () => {
  let component: Comp7Component;
  let fixture: ComponentFixture<Comp7Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Comp7Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Comp7Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
