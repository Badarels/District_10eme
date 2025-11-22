import { NgModule } from '@angular/core';
import { RendezVousRoutingModule } from './rendezvous-routing.module';
import { ListeRendezVousComponent } from './liste-rendezvous/liste-rendezvous.component';
import { AjoutRendezVousComponent } from './ajout-rendezvous/ajout-rendezvous.component';

@NgModule({
  imports: [
    RendezVousRoutingModule,
    ListeRendezVousComponent,
    AjoutRendezVousComponent
  ]
})
export class RendezVousModule { }

