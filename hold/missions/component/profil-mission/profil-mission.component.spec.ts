import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfilMissionComponent } from './profil-mission.component';

describe('ProfilMissionComponent', () => {
  let component: ProfilMissionComponent;
  let fixture: ComponentFixture<ProfilMissionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProfilMissionComponent]
    });
    
    fixture = TestBed.createComponent(ProfilMissionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
