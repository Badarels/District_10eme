import { NgModule } from '@angular/core';
import { HospitalisationsRoutingModule } from './hospitalisations-routing.module';
import { ListeHospitalisationComponent } from './liste-hospitalisation/liste-hospitalisation.component';
import { AjoutHospitalisationComponent } from './ajout-hospitalisation/ajout-hospitalisation.component';

@NgModule({
  imports: [
    HospitalisationsRoutingModule,
    ListeHospitalisationComponent,
    AjoutHospitalisationComponent
  ]
})
export class HospitalisationsModule { }

