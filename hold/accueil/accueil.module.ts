import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccueilComponent } from './Component/accueil/accueil.component';
import { SharedModule } from '../shared/shared.module';
import { AccueilRoutingModule } from './accueil-routing.module';



@NgModule({
  declarations: [
   
  ],
  imports: [
    AccueilComponent,
    SharedModule,
    CommonModule,
    AccueilRoutingModule
  ]
})
export class AccueilModule { }
