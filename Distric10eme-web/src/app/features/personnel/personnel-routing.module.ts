import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListePersonnelComponent } from './liste-personnel/liste-personnel.component';
import { AjoutPersonnelComponent } from './ajout-personnel/ajout-personnel.component';
import { EditPersonnelComponent } from './edit-personnel/edit-personnel.component';
import { PersonnelDetailsComponent } from './personnel-details/personnel-details.component';

const routes: Routes = [
  {
    path: '',
    component: ListePersonnelComponent
  },
  {
    path: 'ajout',
    component: AjoutPersonnelComponent
  },
  {
    path: 'edit/:id',
    component: EditPersonnelComponent
  },
  {
    path: 'details/:id',
    component: PersonnelDetailsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PersonnelRoutingModule { }

