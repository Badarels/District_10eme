import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfilMedecinComponent } from './profil-medecin.component';

describe('ProfilMedecinComponent', () => {
  let component: ProfilMedecinComponent;
  let fixture: ComponentFixture<ProfilMedecinComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProfilMedecinComponent]
    });
    fixture = TestBed.createComponent(ProfilMedecinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
