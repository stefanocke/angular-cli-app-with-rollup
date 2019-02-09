import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Comp16Component } from './comp16.component';

describe('Comp16Component', () => {
  let component: Comp16Component;
  let fixture: ComponentFixture<Comp16Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Comp16Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Comp16Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
