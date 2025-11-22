import { Component, OnInit, ViewChild } from '@angular/core';
import { Medecin } from 'src/app/shared/Model/Medecin';
import { MedecinService } from '../../Services/medecin.service';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Adresse } from 'src/app/shared/Model/Adresse';
import { Observable, Subscription, catchError, switchMap, tap } from 'rxjs';

import { AdresseService } from 'src/app/Adresses/Services/adresse.service';
import { Specialite } from 'src/app/shared/Model/Specialite';

import { ToastrService } from 'ngx-toastr';
import { CommonModule, formatDate } from '@angular/common';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { RouterModule } from '@angular/router';
import { NgbDatepickerModule, NgbTimepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { MissionRoutingModule } from 'src/app/missions/mission-routing.module';
import { SearchAdressePipe } from "../../../pipe/search-adresse.pipe";




@Component({
    selector: 'app-ajout-medecin',
    templateUrl: './ajout-medecin.component.html',
    styleUrls: ['./ajout-medecin.component.css'],
    standalone: true,
       imports: [
    MissionRoutingModule,
    CommonModule,
    ReactiveFormsModule,
    NgbDatepickerModule,
    NgbTimepickerModule,
    MatMenuModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    FormsModule,
    RouterModule,
    SearchAdressePipe
],
})
export class AjoutMedecinComponent implements OnInit{

  @ViewChild('dropdown') dropdown: any;
  medecin= new  Medecin();
  adresse=new Adresse();
  medecinForm!: FormGroup;
  adresseForm!: FormGroup;
  Specialite: Specialite[] = [];
  adresses: Adresse[] = [];
  filtreText: string = '';
  selectedAddress: any; 
  submitted: boolean= false;
  adresseSelectionnee: any = null;  // Stocke l'adresse sélectionnée
  specialiteSelectionnee: Specialite | null = null;
  specialitesSelectionnees: Specialite[] = [];
  showDropdown: boolean = false;
  adresse_id: number | undefined;

  

 
  subscriptions = [] as Subscription[];

  afficherFormulaireAdresse: boolean = false;


  constructor(
    private medecinservices: MedecinService,
     private adresseServices: AdresseService,
     private formBuilder: FormBuilder,
     private toastServices: ToastrService
     ){}

    // Méthode pour récupérer les spécialités
  getSpecialite() {
    this.medecinservices.getSpecialite()
      .subscribe(
        (specialite: any) => {
          this.Specialite = specialite;
          console.log("specilaite"+this.Specialite);
        },
        (error) => {
          console.error('Une erreur s\'est produite lors de la récupération de la spécialité:', error);
        }
      );
  }
    // Méthode pour récupérer les adresses

  getAdresse() {
    this.medecinservices.getAdresse() 
      .subscribe(
        (Adresse: any) => {
          this.adresses = Adresse;
          console.log("Adresses"+this.adresses);  
        },
        (error) => {
          console.error('Une erreur s\'est produite lors de la récupération de l\'adresse :', error);       
         }
      );
  }

  // Fonction appelée lorsqu'une adresse est sélectionnée
 /* selectAddress(adresse: any) {
    this.selectedAddress = adresse;
  }*/

  selectAddress(address: Adresse) {
    this.selectedAddress = address;
    this.adresse_id = address.id;
    this.showDropdown = false; // Masquer la liste déroulante après la sélection
  }
  
  deselectAddress() {
    this.selectedAddress = null;
    this.showDropdown = false; // Ne pas dérouler la liste après la désélection
  }
 
  toggleDropdown() {
    this.showDropdown = !this.showDropdown;
  }

// La fonction pour sélectionner/désélectionner une spécialité
selectSpecialite(specialite: Specialite): void {
  // Vérifiez si la spécialité est déjà sélectionnée
  if (this.specialiteSelectionnee === specialite) {
    // Si oui, désélectionnez en la mettant à null
    this.specialiteSelectionnee = null;
  } else {
    // Sinon, sélectionnez la spécialité
    this.specialiteSelectionnee = specialite;
  }
}

// La fonction pour ajouter ou retirer une spécialité de la liste
toggleSpecialiteSelection(specialite: Specialite): void {
  const index = this.specialitesSelectionnees.indexOf(specialite);
  if (index !== -1) {
    // Si la spécialité est déjà dans la liste, retirez-la
    this.specialitesSelectionnees.splice(index, 1);
  } else {
    // Sinon, ajoutez-la à la liste
    this.specialitesSelectionnees.push(specialite);
  }
}

  onCheckboxChange(specialite: any) {
    if (!specialite.checked) {
      // Si la checkbox est décochée, effacez la spécialité sélectionnée
      this.specialiteSelectionnee = null;
    }
  }
  
  basculerFormulaireAdresse() {
    this.afficherFormulaireAdresse = !this.afficherFormulaireAdresse;
  }

  ngOnInit(): void {
    this.getSpecialite(); 
    this.getAdresse();
    this.initForm();
  }

  get f(){
    return this.medecinForm.controls;
  }

  initForm() {
    this.medecinForm = this.formBuilder.group({
      nomMedecin: ['', Validators.required],
      prenomMedecin: ['', Validators.required],
      dateNaissanceMedecin: ['', Validators.required],
      dateEcheance: ['', Validators.required],
      lieuNaissanceMedecin: ['', Validators.required],
      numeroRpps: ['', Validators.required],
      emailMedecin: ['', [Validators.required, Validators.email]], // Changement ici
      numeroSecuriteSocialeMedecin: ['', Validators.required],
      inscription_A_lordre: ['', Validators.required],
      telephoneMedecin_1: ['', Validators.required],
      telephoneMedecin_2: ['', Validators.required],
      sexeMedecin: ['', Validators.required],
      statutMedecin: ['', Validators.required],
      nomRue: ['', Validators.required],
      numeroRue: ['', Validators.required],
      complement: ['', Validators.required],
      departement: ['', Validators.required],
      ville: ['', Validators.required],
      region: ['', Validators.required],
      codePostal: ['', Validators.required],
      qualifications: ['', Validators.required],
      //adresse_id: [this.adresse_id, Validators.required], 
      specialites: [[], Validators.required],
      // Ajoutez d'autres contrôles si nécessaire
    });
  }
  ajoutMedecin() {
    /*if (!this.medecinForm.valid || this.specialitesSelectionnees.length === 0) {
      // Vérifiez si le formulaire est valide et s'il y a des spécialités sélectionnées
      return; // Si non, arrêtez l'exécution de la méthode
    }*/
  
    const formData = this.medecinForm.value;
    const nouveauMedecin: Medecin = {
      nomMedecin: formData.nomMedecin,
      prenomMedecin: formData.prenomMedecin,
      dateDeNaissanceMedecin: formData.dateNaissanceMedecin,
      lieuDeNaissanceMedecin: formData.lieuNaissanceMedecin,
      emailMedecin: formData.emailMedecin,
      numeroRpps: formData.numeroRpps,
      numeroSecuriteSocialeMedecin: formData.numeroSecuriteSocialeMedecin,
      inscription_A_lordre: formData.inscription_A_lordre,
      telephoneMedecin_1: formData.telephoneMedecin_1,
      telephoneMedecin_2: formData.telephoneMedecin_2,
      sexeMedecin: formData.sexeMedecin,
      qualifications: formData.qualifications,
      statutMedecin: formData.statutMedecin,
      dateEcheance: formData.dateEcheance,
      specialites: this.specialitesSelectionnees,
      adresse: this.selectedAddress,
      id: undefined // Laissez le serveur attribuer l'ID
    };
  
    let medecinObservable: Observable<Medecin>;
  
    if (this.selectedAddress) {
      medecinObservable = this.medecinservices.ajoutMedecin(nouveauMedecin);
    } else {
      const nouvelleAdresse: Adresse = {
        nomRue: formData.nomRue,
        numeroRue: formData.numeroRue,
        departement: formData.departement,
        ville: formData.ville,
        region: formData.region,
        codePostal: formData.codePostal,
        complement: formData.complement,
        id: undefined // Laissez le serveur attribuer l'ID
      };
  
      // Appelez le service pour ajouter la nouvelle adresse
      medecinObservable = this.adresseServices.ajoutAdresse(nouvelleAdresse).pipe(
        switchMap((addedAdresse: Adresse) => {
          // Enregistrez l'adresse nouvellement ajoutée dans le médecin
          nouveauMedecin.adresse = addedAdresse;
          // Appelez ensuite le service pour ajouter le nouveau médecin
          return this.medecinservices.ajoutMedecin(nouveauMedecin);
        })
      );
    }
  
    medecinObservable.subscribe(
      (addedMedecin: Medecin) => {
        console.log('Ajout réussi', addedMedecin);
        this.toastServices.success();
        // Réinitialiser le formulaire après l'ajout réussi
        this.medecinForm.reset();
      },
      (error) => {
        console.error('Erreur lors de l\'ajout du médecin', error);
        // Gérer l'erreur ici
      }
    );
  }
  
  

shouldShowNomRequiredError() {
  const nomMedecin = this.medecinForm.controls['nomMedecin'];
  return nomMedecin.touched && nomMedecin.hasError('required');
}

shouldShowPrenomRequiredError() {
  const prenomMedecin = this.medecinForm.controls['prenomMedecin'];
  return prenomMedecin.touched && prenomMedecin.hasError('required');
}

shouldShowDateNaissanceMedecinRequiredError() {
  const dateNaissanceMedecin = this.medecinForm.controls['dateNaissanceMedecin'];
  return dateNaissanceMedecin.touched && dateNaissanceMedecin.hasError('required');
}

shouldShowLieuNaissanceMedecinRequiredError() {
  const lieuNaissanceMedecin = this.medecinForm.controls['lieuNaissanceMedecin'];
  return lieuNaissanceMedecin.touched && lieuNaissanceMedecin.hasError('required');
}

shouldShowNumeroRppsRequiredError() {
  const numeroRpps = this.medecinForm.controls['numeroRpps'];
  return numeroRpps.touched && numeroRpps.hasError('required');
}

shouldShowEmailMedecinRequiredError() {
  const emailMedecin = this.medecinForm.controls['emailMedecin'];
  return emailMedecin.touched && emailMedecin.hasError('required');
}

shouldShowNumeroSecuriteSocialeMedecinRequiredError() {
  const numeroSecuriteSocialeMedecin = this.medecinForm.controls['numeroSecuriteSocialeMedecin'];
  return numeroSecuriteSocialeMedecin.touched && numeroSecuriteSocialeMedecin.hasError('required');
}

shouldShowinscription_A_lordreRequiredError() {
  const inscription_A_lordre = this.medecinForm.controls['inscription_A_lordre'];
  return inscription_A_lordre.touched && inscription_A_lordre.hasError('required');
}

shouldShowTelephoneMedecin_1RequiredError() {
  const telephoneMedecin_1 = this.medecinForm.controls['telephoneMedecin_1'];
  return telephoneMedecin_1.touched && telephoneMedecin_1.hasError('required');
}

shouldShowTelephoneMedecin_2RequiredError() {
  const telephoneMedecin_2 = this.medecinForm.controls['telephoneMedecin_2'];
  return telephoneMedecin_2.touched && telephoneMedecin_2.hasError('required');
}

shouldShowSexeMedecinRequiredError() {
  const sexeMedecin = this.medecinForm.controls['sexeMedecin'];
  return sexeMedecin.touched && sexeMedecin.hasError('required');
}

shouldShowStatutMedecinRequiredError() {
  const statutMedecin = this.medecinForm.controls['statutMedecin'];
  return statutMedecin.touched && statutMedecin.hasError('required');
}

shouldShowNomRueAdresseRequiredError() {
  const nomRue = this.medecinForm.controls['nomRue'];
  return nomRue.touched && nomRue.hasError('required');
}

shouldShowNumeroRueAdresseRequiredError() {
  const numeroRue = this.medecinForm.controls['numeroRue'];
  return numeroRue.touched && numeroRue.hasError('required');
}

shouldShowComplementAdresseRequiredError() {
  const complement = this.medecinForm.controls['complement'];
  return complement.touched && complement.hasError('required');
}

shouldShowDepartementAdresseRequiredError() {
  const departement = this.medecinForm.controls['departement'];
  return departement.touched && departement.hasError('required');
}

shouldShowVilleAdresseRequiredError() {
  const ville = this.medecinForm.controls['ville'];
  return ville.touched && ville.hasError('required');
}

shouldShowRegionAdresseRequiredError() {
  const  region = this.medecinForm.controls['region'];
  return region.touched && region.hasError('required');
}

shouldShowCodePostalAdresseRequiredError() {
  const  codePostal = this.medecinForm.controls['codePostal'];
  return codePostal.touched && codePostal.hasError('required');
}

// Dans ngOnDestroy ou là où vous nettoyez vos abonnements
ngOnDestroy() {
  this.subscriptions.forEach(sub => sub.unsubscribe());
}

} 


