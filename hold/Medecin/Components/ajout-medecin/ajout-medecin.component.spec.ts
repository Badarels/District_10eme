import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AjoutMedecinComponent } from './ajout-medecin.component';

describe('AjoutMedecinComponent', () => {
  let component: AjoutMedecinComponent;
  let fixture: ComponentFixture<AjoutMedecinComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AjoutMedecinComponent]
    });
    fixture = TestBed.createComponent(AjoutMedecinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
