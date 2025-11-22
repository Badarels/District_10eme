import { NgModule } from '@angular/core';
import { PatientsRoutingModule } from './patients-routing.module';
import { ListePatientComponent } from './liste-patient/liste-patient.component';
import { AjoutPatientComponent } from './ajout-patient/ajout-patient.component';
import { EditPatientComponent } from './edit-patient/edit-patient.component';
import { PatientDetailsComponent } from './patient-details/patient-details.component';

@NgModule({
  imports: [
    PatientsRoutingModule,
    ListePatientComponent,
    AjoutPatientComponent,
    EditPatientComponent,
    PatientDetailsComponent
  ]
})
export class PatientsModule { }

