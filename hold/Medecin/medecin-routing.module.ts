import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ListeMedecinComponent } from './Components/liste-medecin/liste-medecin.component';
import { AjoutMedecinComponent } from './Components/ajout-medecin/ajout-medecin.component';
import { ProfilMedecinComponent } from './Components/profil-medecin/profil-medecin.component';




@NgModule({
  imports: [
    RouterModule.forChild([
      // Route par défaut (liste des médecins)
      {
        path: '',
        component: ListeMedecinComponent,
        data: { title: 'Liste des médecins' }
      },
      // Route pour l'ajout d'un médecin
      {
        path: 'ajout',
        component: AjoutMedecinComponent,
        data: { title: 'Ajouter un médecin' }
      },
      // Route pour le profil d'un médecin
      {
        path: 'profil/:id',
        component: ProfilMedecinComponent,
        data: { title: 'Profil du médecin' }
      },
      // Redirections pour la rétrocompatibilité
      {
        path: 'listMedecin',
        redirectTo: '',
        pathMatch: 'full'
      },
      {
        path: 'list-medecin',
        redirectTo: ''
      },
      {
        path: 'liste-medecin',
        redirectTo: '',
        pathMatch: 'full'
      },
      // Redirection pour l'ajout avec l'ancienne URL
      {
        path: 'ajoutMedecin',
        redirectTo: 'ajout',
        pathMatch: 'full'
      },
      {
        path: 'Ajout-medecin',
        redirectTo: 'ajout'
      },
      // Redirections pour les profils
      {
        path: 'profilMedecin/:id',
        redirectTo: 'profil/:id'
      },
      {
        path: 'profil-medecin/:id',
        redirectTo: 'profil/:id'
      },
      // Redirection pour toutes les autres routes vers la liste
      {
        path: '**',
        redirectTo: ''
      }
    ])
  ],
  exports: [RouterModule]
})
export class MedecinRoutingModule { }
