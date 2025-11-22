import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgbModule, NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { ToastrModule } from 'ngx-toastr';
import { PersonnelRoutingModule } from './personnel-routing.module';
import { ListePersonnelComponent } from './liste-personnel/liste-personnel.component';
import { AjoutPersonnelComponent } from './ajout-personnel/ajout-personnel.component';
import { EditPersonnelComponent } from './edit-personnel/edit-personnel.component';
import { PersonnelDetailsComponent } from './personnel-details/personnel-details.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    NgbModule,
    NgbDatepickerModule,
    ToastrModule,
    PersonnelRoutingModule,
    ListePersonnelComponent,
    AjoutPersonnelComponent,
    EditPersonnelComponent,
    PersonnelDetailsComponent
  ]
})
export class PersonnelModule { }

