import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AjoutMissionComponent } from './ajout-mission.component';

describe('AjoutMissionComponent', () => {
  let component: AjoutMissionComponent;
  let fixture: ComponentFixture<AjoutMissionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AjoutMissionComponent]
    });
    fixture = TestBed.createComponent(AjoutMissionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
