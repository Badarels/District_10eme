import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainContaintsComponent } from './main-containts.component';

describe('MainContaintsComponent', () => {
  let component: MainContaintsComponent;
  let fixture: ComponentFixture<MainContaintsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MainContaintsComponent]
    });
    fixture = TestBed.createComponent(MainContaintsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
