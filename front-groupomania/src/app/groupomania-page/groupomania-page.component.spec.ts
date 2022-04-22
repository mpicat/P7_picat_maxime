import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupomaniaPageComponent } from './groupomania-page.component';

describe('GroupomaniaPageComponent', () => {
  let component: GroupomaniaPageComponent;
  let fixture: ComponentFixture<GroupomaniaPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GroupomaniaPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupomaniaPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
