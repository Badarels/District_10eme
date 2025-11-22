import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common'; // Importer CommonModule


import { AjouterUtilisateurComponent } from './Components/ajouter-utilisateur/ajouter-utilisateur.component';
import { ListeUtilisateurComponent } from './Components/liste-utilisateur/liste-utilisateur.component';
import { EditUtilisateurComponent } from './Components/edit-utilisateur/edit-utilisateur.component';
import { ProfilUtilisateurComponent } from './Components/profil-utilisateur/profil-utilisateur.component';



@NgModule({
  imports: [
  
    RouterModule.forChild([
      {
        path: '',
        component: ListeUtilisateurComponent,
      },
      {
        path: 'ajout',
        component: AjouterUtilisateurComponent,
      },
      {
        path: 'edit/:id',
        component: EditUtilisateurComponent,
      },
      {
        path: 'profil/:id',
        component: ProfilUtilisateurComponent,
      },
      {
        path: 'edit-utilisateur/:id',
        component: EditUtilisateurComponent,
      },
      {
        path: 'profil-utilisateur/:id',
        component: ProfilUtilisateurComponent,
      }
    ])
    
  ],
  exports: [RouterModule]
})
export class UtilisateurRoutingModule { }
