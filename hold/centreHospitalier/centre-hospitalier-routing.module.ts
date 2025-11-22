import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListeCentreHospitalierComponent } from './Component/liste-centre-hospitalier/liste-centre-hospitalier.component';

import { RouterModule } from '@angular/router';
import { AjoutCentreHospitalierComponent } from './Component/ajout-centre-hospitalier/ajout-centre-hospitalier.component';
import { EditCentreHospitalierComponent } from './Component/edit-centre-hospitalier/edit-centre-hospitalier.component';



@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: ListeCentreHospitalierComponent
      },
      {
        path: 'ajout',
        component: AjoutCentreHospitalierComponent
      },
      {
        path: 'edit/:id',
        component: EditCentreHospitalierComponent
      },
      // Anciens chemins maintenus pour la rétrocompatibilité
      {
        path: 'list-CentreHospitalier',
        redirectTo: ''
      },
      {
        path: 'Ajout-CentreHospitalier',
        redirectTo: 'ajout'
      },
      {
        path: 'edit-CentreHospitalier/:id',
        redirectTo: 'edit/:id'
      }
  ])
],
exports: [RouterModule]
})
export class CentreHospitalierRoutingModule {}
