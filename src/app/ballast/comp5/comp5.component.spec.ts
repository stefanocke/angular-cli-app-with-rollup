import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Comp5Component } from './comp5.component';

describe('Comp5Component', () => {
  let component: Comp5Component;
  let fixture: ComponentFixture<Comp5Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Comp5Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Comp5Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
