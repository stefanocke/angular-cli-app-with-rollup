import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { Comp5Component } from './comp5.component';

describe('Comp5Component', () => {
  let component: Comp5Component;
  let fixture: ComponentFixture<Comp5Component>;

  beforeEach(waitForAsync(() => {
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
