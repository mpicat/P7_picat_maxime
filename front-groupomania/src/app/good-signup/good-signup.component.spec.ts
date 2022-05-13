import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GoodSignupComponent } from './good-signup.component';

describe('GoodSignupComponent', () => {
  let component: GoodSignupComponent;
  let fixture: ComponentFixture<GoodSignupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GoodSignupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GoodSignupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
