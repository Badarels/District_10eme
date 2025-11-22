import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListeRendezVousComponent } from './liste-rendezvous/liste-rendezvous.component';
import { AjoutRendezVousComponent } from './ajout-rendezvous/ajout-rendezvous.component';

const routes: Routes = [
  { path: '', component: ListeRendezVousComponent },
  { path: 'ajout', component: AjoutRendezVousComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RendezVousRoutingModule { }

