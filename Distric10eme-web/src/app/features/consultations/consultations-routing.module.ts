import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListeConsultationComponent } from './liste-consultation/liste-consultation.component';
import { AjoutConsultationComponent } from './ajout-consultation/ajout-consultation.component';
import { EditConsultationComponent } from './edit-consultation/edit-consultation.component';

const routes: Routes = [
  { path: '', component: ListeConsultationComponent },
  { path: 'ajout', component: AjoutConsultationComponent },
  { path: 'edit/:id', component: EditConsultationComponent },
  { path: 'nouvelle-consultation', component: AjoutConsultationComponent },
  { 
    path: 'consultation', 
    children: [
      { path: 'nouvelle', component: AjoutConsultationComponent },
      { path: 'editer/:id', component: EditConsultationComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConsultationsRoutingModule { }
