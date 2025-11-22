import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import { MatStepperModule } from '@angular/material/stepper';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatChipsModule } from '@angular/material/chips';

import { ConsultationsRoutingModule } from './consultations-routing.module';
import { ListeConsultationComponent } from './liste-consultation/liste-consultation.component';
import { AjoutConsultationComponent } from './ajout-consultation/ajout-consultation.component';
import { ConsultationFormComponent } from './consultation-form/consultation-form.component';
import { ConsultationFormV2Component } from './consultation-form-v2/consultation-form-v2.component';

@NgModule({
  declarations: [
    // Les composants non-standalone vont ici
  ],
  imports: [
    CommonModule,
    ConsultationsRoutingModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatButtonModule,
    MatCardModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    MatTabsModule,
    MatStepperModule,
    MatDividerModule,
    MatTooltipModule,
    MatChipsModule,
    // Importer les composants autonomes
    ConsultationFormV2Component,
    ListeConsultationComponent,
    AjoutConsultationComponent,
    ConsultationFormComponent
  ],
  // Exporter les composants qui doivent être utilisés ailleurs
  exports: [
    ListeConsultationComponent,
    AjoutConsultationComponent,
    ConsultationFormComponent,
    ConsultationFormV2Component
  ]
})
export class ConsultationsModule { }
