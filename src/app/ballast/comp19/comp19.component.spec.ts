import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Comp19Component } from './comp19.component';

describe('Comp19Component', () => {
  let component: Comp19Component;
  let fixture: ComponentFixture<Comp19Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Comp19Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Comp19Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
