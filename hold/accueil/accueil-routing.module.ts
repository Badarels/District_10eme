import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AccueilComponent } from './Component/accueil/accueil.component';



@NgModule({

  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: AccueilComponent,
      }
    ])
  ],
  exports: [RouterModule]

})
export class AccueilRoutingModule { }
