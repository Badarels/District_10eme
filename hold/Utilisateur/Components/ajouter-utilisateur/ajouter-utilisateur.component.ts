import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { RoleModel } from 'src/app/shared/Model/Role.Model';
import { UtilisateurModel } from 'src/app/shared/Model/Utilisateur.model';
import { UtilisateurService } from '../../Services/utilisateur.service';
//import { ToastrService } from 'ngx-toastr';
import { ToastService } from 'src/app/Utilisateur/Services/toast.service'
//import toastr from 'toastr';

import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';
import { ListeUtilisateurComponent } from '../liste-utilisateur/liste-utilisateur.component';

@Component({
    selector: 'app-ajouter-utilisateur',
    templateUrl: './ajouter-utilisateur.component.html',
    styleUrls: ['./ajouter-utilisateur.component.css'],
    standalone: true, 
    imports: [
      CommonModule,
      ReactiveFormsModule,
      HttpClientModule,
      RouterModule,
      FormsModule,
    ]
})
export class AjouterUtilisateurComponent implements OnInit{
  

  subscriptions = [] as Subscription[];
  connectedUser = new UtilisateurModel();

  roles = [] as RoleModel[];
  role=new RoleModel();
 // forme = new FormeModel();
  utilisateur = new UtilisateurModel();
  userForm!: FormGroup;

constructor(
  private UtilisateurServices: UtilisateurService,
  private toastService: ToastService
  ){}

private initForm(utilisateur: UtilisateurModel){
  if(utilisateur){
    if(utilisateur && utilisateur.id){
    this.role = utilisateur && utilisateur.roles ? utilisateur.roles : new RoleModel();
    }
    this.userForm=new FormGroup({
      'nomuser':new FormControl(utilisateur?.nomUser,[Validators.required]),
      'prenomuser': new FormControl(utilisateur?.prenomUser, [Validators.required]),
      'adresseuser': new FormControl(utilisateur?.adresseUser, [Validators.required]),
      'passworduser': new FormControl(utilisateur?.passwordUser, [Validators.required]),
      'telephoneuser': new FormControl(utilisateur?.telephoneUser, [Validators.required]),
      'datenaissuser': new FormControl(utilisateur?.dateNaissanceUser,[Validators.required]),
      'sexeuser': new FormControl(utilisateur?.sexeUser, [Validators.required]),
      'emailuser': new FormControl(utilisateur?.emailUser, [Validators.required]),
      'ineuser': new FormControl(utilisateur?.numeroPieceIdentiteUser, [Validators.required]),
      'role': new FormControl(null, [Validators.required]),
    });
  }else{
    this.userForm=new FormGroup({
      'nomuser':new FormControl(null,[Validators.required]),
      'prenomuser': new FormControl(null, [Validators.required]),
      'adresseuser': new FormControl(null,[Validators.required]),
      'passworduser': new FormControl(null, [Validators.required]),
      'telephoneuser': new FormControl(null, [Validators.required]),
      'datenaissuser': new FormControl(null,[Validators.required]),
      'sexeuser': new FormControl(null, [Validators.required]),
      'emailuser': new FormControl(null, [Validators.required]),
      'ineuser': new FormControl(null, [Validators.required]),
      'role': new FormControl(null, [Validators.required]),
    })
  }
}

  ngOnInit(): void {
      this.initForm(new UtilisateurModel());
      this.getRoles();
  }

  shouldShowNomRequiredError() {
    const nomuser = this.userForm.controls['nomuser'];
    return nomuser.touched && nomuser.hasError('required');
  }
  shouldShowPrenomRequiredError() {
    const prenomuser= this.userForm.controls['prenomuser'];
    return prenomuser.touched && prenomuser.hasError('required');
  }
  shouldShowEmailuserRequiredError() {
    const emailuser= this.userForm.controls['emailuser'];
    return emailuser.touched && emailuser.hasError('required');
  }

  shouldShowPassworduserRequiredError() {
    const passworduser = this.userForm.controls['passworduser'];
    return passworduser.touched && passworduser.hasError('required');
  }
  
  shouldShowAdresseRequiredError() {
    const adresseuser = this.userForm.controls['adresseuser'];
    return adresseuser.touched && adresseuser.hasError('required');
  }
  shouldShowTelephoneRequiredError() {
    const telephoneuser = this.userForm.controls['telephoneuser'];
    return telephoneuser.touched && telephoneuser.hasError('required');
  }

  shouldShowDateNaissanceRequiredError() {
    const datenaissuser = this.userForm.controls['datenaissuser'];
    return datenaissuser.touched && datenaissuser.hasError('required');
  }
  shouldShowSexeRequiredError() {
    const sexeuser = this.userForm.controls['sexeuser'];
    return sexeuser.touched && sexeuser.hasError('required');
  }
  shouldShowIneRequiredError() {
    const ineuser = this.userForm.controls['ineUser'];
    return ineuser.touched && ineuser.hasError('ineUser');
  }

 /* showCustomToast() {
    this.toastr.success('Message personnalisé', 'Titre personnalisé', {
      timeOut: 3000, // Temps en millisecondes avant que la notification disparaisse (facultatif)
      progressBar: true, // Afficher une barre de progression (facultatif)
      closeButton: true, // Afficher un bouton de fermeture (facultatif)
      positionClass: 'toast-top-right', // Position de la notification (facultatif)
    });
  }*/

  getRoles() {
    this.subscriptions.push(
      this.UtilisateurServices.getRoles().subscribe(
        (data: any) => {
          // Assurez-vous que la structure des données correspond à ce que vous attendez
          // Si les utilisateurs sont directement dans 'data', vous pouvez faire comme ceci :
          this.roles = data;
          console.log(this.roles)  
        },
        (error) => {
          console.error('Erreur lors de la récupération des Roles :', error);
        }
      )
    );
  }

  onSaveUtilisateurs() {
    if (this.userForm.valid) {
      const formData = this.userForm.value;
      if (this.utilisateur) {
        this.utilisateur.nomUser = formData.nomuser;
        this.utilisateur.prenomUser = formData.prenomuser;
        this.utilisateur.adresseUser = formData.adresseuser;
        this.utilisateur.passwordUser = formData.passworduser;
        this.utilisateur.dateNaissanceUser = formData.datenaissuser;
        this.utilisateur.telephoneUser = formData.telephoneuser;
        this.utilisateur.sexeUser = formData.sexeuser;
        this.utilisateur.emailUser = formData.emailuser;
        this.utilisateur.numeroPieceIdentiteUser = formData.ineuser;
        this.utilisateur.roles = formData.role; // Assurez-vous que formData.role contient l'objet de rôle sélectionné
        console.log(formData.role.id);
        const userObservable = this.utilisateur.id
          ? this.UtilisateurServices.editUser(this.utilisateur, this.utilisateur.id)
          : this.UtilisateurServices.addUser(this.utilisateur);
  
        this.subscriptions.push(
          userObservable.subscribe(
            () => {
              console.log('Utilisateur ajouté ou mis à jour avec succès.');
              this.toastService.showSuccessToast();
              // Réinitialiser le formulaire après la soumission
              this.userForm.reset();
            },
            (error) => {
              console.error('Erreur lors de l\'ajout ou de la mise à jour de l\'utilisateur :', error);
              this.toastService.showErrorToast();
            }
          )
        );
      }
    }
  }
  
  
}
