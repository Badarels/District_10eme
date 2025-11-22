import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AjoutCentreHospitalierComponent } from './ajout-centre-hospitalier.component';

describe('AjoutCentreHospitalierComponent', () => {
  let component: AjoutCentreHospitalierComponent;
  let fixture: ComponentFixture<AjoutCentreHospitalierComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AjoutCentreHospitalierComponent]
    });
    fixture = TestBed.createComponent(AjoutCentreHospitalierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
