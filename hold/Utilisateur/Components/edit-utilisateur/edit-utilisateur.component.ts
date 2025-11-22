import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { UtilisateurModel } from 'src/app/shared/Model/Utilisateur.model';
import { UtilisateurService } from '../../Services/utilisateur.service';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { AdresseService } from 'src/app/Adresses/Services/adresse.service';
import { Adresse } from 'src/app/shared/Model/Adresse';
import { RoleModel } from 'src/app/shared/Model/Role.Model';
import { CommonModule } from '@angular/common';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { ToastrModule } from 'ngx-toastr';
import { SharedModule } from 'src/app/shared/shared.module';

@Component({
    selector: 'app-edit-utilisateur',
    templateUrl: './edit-utilisateur.component.html',
    styleUrls: ['./edit-utilisateur.component.css'],
    standalone: true,
    imports: [
      CommonModule,
      ReactiveFormsModule,
      RouterModule,
      FormsModule,
      ToastrModule,
      NgbDropdownModule,
      SharedModule,
    ]
})
export class EditUtilisateurComponent {
  
userForm!: FormGroup;
utilisateur!: UtilisateurModel;
userId!:number;
subscription: Subscription[] = [];
roles: RoleModel[]=[];

constructor(
  private formBuilder: FormBuilder,
  private UtilisateurServices: UtilisateurService,
  private route: ActivatedRoute,
  private adresseServices: AdresseService
) {}

ngOnInit(): void {
  // Récupérer chId à partir des paramètres de l'URL
  this.route.params.subscribe(params => {
    this.userId = +params['id']; 
  });

  // Initialiser le formulaire
  this.userForm = this.formBuilder.group({
    nomUser: ['', Validators.required],
    prenomUser: ['', Validators.required],
    adresseUser: ['', Validators.required],
    emailUser: ['', [Validators.required, Validators.email]],
    telephoneUser: ['', Validators.required],
    dateNaissanceUser: ['', Validators.required],
    sexeUser: ['', Validators.required],
    numeroPieceIdentiteUser: ['', Validators.required],
    passwordUser: ['', Validators.required],
    roles: ['', Validators.required],
  });

  // Charger les données du centre hospitalier à éditer
    this.loadUser();
}

getRoles() {
  this.subscription.push(
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

ngOnDestroy(): void {
  // Désabonner toutes les subscriptions pour éviter les fuites de mémoire
  this.subscription.forEach(sub => sub.unsubscribe());
}



loadUser(): void {
  // Charger les données de l'utilisateur à éditer en fonction de l'ID
  this.subscription.push(
    this.UtilisateurServices.getUserById(this.userId).subscribe(
      (utilisateur: UtilisateurModel) => {
        this.utilisateur = utilisateur;
        // Remplir le formulaire avec les données existantes
        this.userForm.patchValue({
          id: undefined,
          nomUser: utilisateur.nomUser,
          prenomUser: utilisateur.prenomUser,
          adresseUser: utilisateur.adresseUser,
          passwordUser: utilisateur.passwordUser,
          telephoneUser: utilisateur.telephoneUser,
          dateNaissanceUser: utilisateur.dateNaissanceUser,
          sexeUser: utilisateur.sexeUser,
          emailUser: utilisateur.emailUser,
          numeroPieceIdentiteUser: utilisateur.numeroPieceIdentiteUser,
          roles: utilisateur.roles,
        });
      },
      (error) => {
        console.error('Erreur lors du chargement de l\'utilisateur', error);
      }
    ) 
  );
}


modifierUtilisateur() {
  console.log("modification de l'utilisateur avec l'ID : " + this.userId);
  
  // Récupérer les valeurs du formulaire
  const formData = this.userForm.value;
  
  // Créer un nouvel objet UtilisateurModel avec les valeurs du formulaire
  const utilisateurAModifier: UtilisateurModel = {
    id: undefined, // Laissez ce champ undefined, il sera rempli par le service côté serveur
    nomUser: formData.nomUser,
    prenomUser: formData.prenomUser,
    passwordUser: formData.passwordUser,
    dateNaissanceUser: formData.dateNaissanceUser,
    telephoneUser: formData.telephoneUser,
    emailUser: formData.emailUser,
    sexeUser: formData.sexeUser,
    adresseUser: formData.adresseUser,
    archived: undefined, // Laissez ce champ undefined s'il n'est pas rempli par le formulaire
    passwordChange: formData.passwordChange,
    numeroPieceIdentiteUser: formData.numeroPieceIdentiteUser,
    roles: formData.roles // Assurez-vous que formData.roles correspond au type RoleModel
  };

  console.log("Utilisateur à modifier :", utilisateurAModifier);
  
  // Appeler le service pour modifier l'utilisateur
  const userObservable = this.UtilisateurServices.editUser(utilisateurAModifier, this.userId);
  
  // Souscrire à l'observable et gérer les réponses
  this.subscription.push(
    userObservable.subscribe(
      (editUser: UtilisateurModel) => {  
        // Traitement après la modification réussie  
        console.log('Modification réussie', editUser);
        // Réinitialiser le formulaire ou effectuer d'autres actions si nécessaire
        this.userForm.reset();
      },
      (error) => { 
        console.error('Erreur lors de la modification de l\'utilisateur', error);
      }
    )
  );
}



}
