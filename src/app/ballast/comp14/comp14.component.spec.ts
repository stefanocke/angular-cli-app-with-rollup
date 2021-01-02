import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { Comp14Component } from './comp14.component';

describe('Comp14Component', () => {
  let component: Comp14Component;
  let fixture: ComponentFixture<Comp14Component>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ Comp14Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Comp14Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
