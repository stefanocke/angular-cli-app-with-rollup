import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Comp15Component } from './comp15.component';

describe('Comp15Component', () => {
  let component: Comp15Component;
  let fixture: ComponentFixture<Comp15Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Comp15Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Comp15Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
