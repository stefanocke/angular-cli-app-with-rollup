import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Comp13Component } from './comp13.component';

describe('Comp13Component', () => {
  let component: Comp13Component;
  let fixture: ComponentFixture<Comp13Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Comp13Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Comp13Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
