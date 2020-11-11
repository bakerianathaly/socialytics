import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CuentaInstagramComponent } from './cuenta-instagram.component';

describe('CuentaInstagramComponent', () => {
  let component: CuentaInstagramComponent;
  let fixture: ComponentFixture<CuentaInstagramComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CuentaInstagramComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CuentaInstagramComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
