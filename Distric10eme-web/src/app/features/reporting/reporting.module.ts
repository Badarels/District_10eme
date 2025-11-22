import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReportingRoutingModule } from './reporting-routing.module';
import { ReportingComponent } from './reporting.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    ReportingRoutingModule,
    ReportingComponent
  ]
})
export class ReportingModule { }

