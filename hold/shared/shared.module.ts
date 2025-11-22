import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { NgbDatepickerI18n, NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { I18nDatepicker } from './i18n-datepicker';

import { MissionPipe } from '../pipe/mission.pipe';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule,
    NgbDatepickerModule
  ],
  declarations: [
    MissionPipe
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule,
    NgbDatepickerModule,
    MissionPipe
  ],
  providers: [
    I18nDatepicker,
    { provide: NgbDatepickerI18n, useClass: I18nDatepicker }
  ]
})
export class SharedModule { }
