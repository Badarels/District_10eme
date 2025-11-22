import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditCentreHospitalierComponent } from './edit-centre-hospitalier.component';

describe('EditCentreHospitalierComponent', () => {
  let component: EditCentreHospitalierComponent;
  let fixture: ComponentFixture<EditCentreHospitalierComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditCentreHospitalierComponent]
    });
    fixture = TestBed.createComponent(EditCentreHospitalierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

