import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./component/mission/mission.component').then(m => m.MissionComponent)
  },
  {
    path: 'ajout-mission',
    loadComponent: () => import('./component/ajout-mission/ajout-mission.component').then(m => m.AjoutMissionComponent)
  },
  {
    path: 'edit-mission/:id',
    loadComponent: () => import('./component/edit-mission/edit-mission.component').then(m => m.EditMissionComponent)
  },
  {
    path: 'profil-mission/:id',
    loadComponent: () => import('./component/profil-mission/profil-mission.component').then(m => m.ProfilMissionComponent)
  },
  // Anciens chemins maintenus pour la rétrocompatibilité
  {
    path: 'list-mission',
    redirectTo: ''
  },
  {
    path: 'Ajout-mission',
    redirectTo: 'ajout-mission'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MissionRoutingModule { }
