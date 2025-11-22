import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListeUserComponent } from './liste-user/liste-user.component';
import { AjoutUserComponent } from './ajout-user/ajout-user.component';

const routes: Routes = [
  { path: '', component: ListeUserComponent },
  { path: 'ajout', component: AjoutUserComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsersRoutingModule { }

