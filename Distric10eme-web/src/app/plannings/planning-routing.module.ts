import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PlanningComponent } from './Component/planning/planning.component';



@NgModule({

  imports: [
    RouterModule.forChild([
      {
        path: 'plannig',
        component: PlanningComponent,
      },
    ])
  ],
  exports: [RouterModule]
})
export class PlanningRoutingModule { }
