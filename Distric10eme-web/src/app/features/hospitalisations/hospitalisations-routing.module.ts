import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListeHospitalisationComponent } from './liste-hospitalisation/liste-hospitalisation.component';
import { AjoutHospitalisationComponent } from './ajout-hospitalisation/ajout-hospitalisation.component';

const routes: Routes = [
  { path: '', component: ListeHospitalisationComponent },
  { path: 'ajout', component: AjoutHospitalisationComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HospitalisationsRoutingModule { }

