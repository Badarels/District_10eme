import { TestBed } from '@angular/core/testing';

import { CentreHospitalierService } from './centre-hospitalier.service';

describe('CentreHospitalierService', () => {
  let service: CentreHospitalierService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CentreHospitalierService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
