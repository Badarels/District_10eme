import { Component, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { EmployeComponent } from './Component/employe/employe.component';
import { AjoutEmployeComponent } from './Component/ajout-employe/ajout-employe.component';
import { EditEmployeComponent } from './Component/edit-employe/edit-employe.component';
import { ProfilEmployeComponent } from './Component/profil-employe/profil-employe.component';



@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: EmployeComponent
      },
      {
        path: 'ajout',
        component: AjoutEmployeComponent
      },
      {
        path: 'edit/:id',
        component: EditEmployeComponent
      },
      {
        path: 'profil/:id',
        component: ProfilEmployeComponent
      },
      // Anciens chemins maintenus pour la rétrocompatibilité
      {
        path: 'liste-employe',
        redirectTo: ''
      },
      {
        path: 'Ajout-employe',
        redirectTo: 'ajout'
      }
    ])
  ],
  exports: [RouterModule]
})
export class EmployeRoutingModule { }
