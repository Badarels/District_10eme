import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListeConsultationComponent } from './liste-consultation/liste-consultation.component';
import { AjoutConsultationComponent } from './ajout-consultation/ajout-consultation.component';
import { ConsultationFormComponent } from './consultation-form/consultation-form.component';
import { ConsultationFormV2Component } from './consultation-form-v2/consultation-form-v2.component';

const routes: Routes = [
  { path: '', component: ListeConsultationComponent },
  { path: 'ajout', component: AjoutConsultationComponent },
  { path: 'nouvelle-consultation', component: ConsultationFormComponent },
  { 
    path: 'consultation', 
    children: [
      { path: 'nouvelle', component: ConsultationFormV2Component },
      { path: 'editer/:id', component: ConsultationFormV2Component }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConsultationsRoutingModule { }

