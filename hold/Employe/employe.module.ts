import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { EmployeRoutingModule } from './employe-routing.module';
import { SharedModule } from '../shared/shared.module';
import { NgbDropdownModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AjoutEmployeComponent } from './Component/ajout-employe/ajout-employe.component';
import { EditEmployeComponent } from './Component/edit-employe/edit-employe.component';
import { ProfilEmployeComponent } from './Component/profil-employe/profil-employe.component';
import { EmployeComponent } from './Component/employe/employe.component';
import { EmployePipe } from '../pipe/employe.pipe';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    SharedModule,
    EmployeRoutingModule,
    NgbDropdownModule,
    NgbModule,
    AjoutEmployeComponent,   
    EditEmployeComponent,    
    ProfilEmployeComponent,  
    EmployeComponent,        
    EmployePipe              
  ]
})
export class EmployeModule {}
