import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LinksForTeacherComponent } from './links-for-teacher.component';

describe('LinksForTeacherComponent', () => {
  let component: LinksForTeacherComponent;
  let fixture: ComponentFixture<LinksForTeacherComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LinksForTeacherComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LinksForTeacherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
