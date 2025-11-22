import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { CentreHospitalierRoutingModule } from './centre-hospitalier-routing.module';
import { ListeCentreHospitalierComponent } from './Component/liste-centre-hospitalier/liste-centre-hospitalier.component';
import { SearchCHPipe } from '../pipe/search-ch.pipe';
import { AjoutCentreHospitalierComponent } from './Component/ajout-centre-hospitalier/ajout-centre-hospitalier.component';
import { MatMenuModule } from '@angular/material/menu';
import { NgbDropdownModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { EditCentreHospitalierComponent } from './Component/edit-centre-hospitalier/edit-centre-hospitalier.component';


@NgModule({
  declarations: [
   ListeCentreHospitalierComponent,
   AjoutCentreHospitalierComponent,
   EditCentreHospitalierComponent,
   SearchCHPipe
  ],
  imports: [
    SharedModule,
    CommonModule,
    CentreHospitalierRoutingModule,
    [MatMenuModule],
    NgbDropdownModule,
    NgbModule,
  ]
})
export class CentreHospitalierModule { }
