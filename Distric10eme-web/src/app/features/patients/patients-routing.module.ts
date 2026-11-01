import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListePatientComponent } from './liste-patient/liste-patient.component';
import { AjoutPatientComponent } from './ajout-patient/ajout-patient.component';
import { EditPatientComponent } from './edit-patient/edit-patient.component';
import { PatientDetailsComponent } from './patient-details/patient-details.component';

const routes: Routes = [
  {
    path: '',
    component: ListePatientComponent
  },
  {
    path: 'ajout',
    component: AjoutPatientComponent
  },
  {
    path: 'edit/:id',
    component: EditPatientComponent
  },
  {
    path: 'details/:id',
    component: PatientDetailsComponent
  },
  {
    path: 'details',
    redirectTo: '',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PatientsRoutingModule { }

