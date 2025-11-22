import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { AjouterUtilisateurComponent } from './Components/ajouter-utilisateur/ajouter-utilisateur.component';
import { UtilisateurRoutingModule } from './utilisateur-routing.module';
import { ListeUtilisateurComponent } from './Components/liste-utilisateur/liste-utilisateur.component';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { EditUtilisateurComponent } from './Components/edit-utilisateur/edit-utilisateur.component';
import { ProfilUtilisateurComponent } from './Components/profil-utilisateur/profil-utilisateur.component';
import { UsersPipe } from '../pipe/users.pipe';





@NgModule({

  imports: [
    ListeUtilisateurComponent,
    EditUtilisateurComponent,
    ProfilUtilisateurComponent,
    AjouterUtilisateurComponent,
    SharedModule,
    CommonModule,
    UtilisateurRoutingModule,
    NgbDropdownModule
  ]
})
export class UtilisateurModule { 

  
}
