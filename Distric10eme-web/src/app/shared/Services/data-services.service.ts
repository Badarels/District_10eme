import { Injectable } from '@angular/core';
import { Medecin } from '../Model/Medecin';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ListeCentreHospitalierComponent } from 'src/app/centreHospitalier/Component/liste-centre-hospitalier/liste-centre-hospitalier.component';

@Injectable({
  providedIn: 'root'
})
export class DataServicesService {

  selectedIdMedecin:any;

constructor(private modalService: NgbModal){}
  setSelectedIdMedecin(medecinId: number) {
    this.selectedIdMedecin = medecinId;
  } 

  getSelectedIdMedecin() {
    return this.selectedIdMedecin;
  }

  afficherModalConfirmation(): Promise<boolean> {
    const modalRef = this.modalService.open("", { centered: true });
    return modalRef.result;
  }
}
