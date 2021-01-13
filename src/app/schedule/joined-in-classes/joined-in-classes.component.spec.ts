import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JoinedInClassesComponent } from './joined-in-classes.component';

describe('JoinedInClassesComponent', () => {
  let component: JoinedInClassesComponent;
  let fixture: ComponentFixture<JoinedInClassesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JoinedInClassesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JoinedInClassesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
