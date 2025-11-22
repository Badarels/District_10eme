import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListeCentreHospitalierComponent } from './liste-centre-hospitalier.component';

describe('ListeCentreHospitalierComponent', () => {
  let component: ListeCentreHospitalierComponent;
  let fixture: ComponentFixture<ListeCentreHospitalierComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListeCentreHospitalierComponent]
    });
    fixture = TestBed.createComponent(ListeCentreHospitalierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
