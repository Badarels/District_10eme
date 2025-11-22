import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgbDropdownModule, NgbModalModule, NgbDatepickerModule, NgbTimepickerModule } from '@ng-bootstrap/ng-bootstrap';

import { SharedModule } from '../shared/shared.module';
import { PlanningRoutingModule } from './planning-routing.module';
import { PlanningComponent } from './Component/planning/planning.component';

@NgModule({
  declarations: [
    PlanningComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    NgbDropdownModule,
    NgbModalModule,
    NgbDatepickerModule,
    NgbTimepickerModule,
    SharedModule,
    PlanningRoutingModule
  ]
})
export class PlanningModule { }
