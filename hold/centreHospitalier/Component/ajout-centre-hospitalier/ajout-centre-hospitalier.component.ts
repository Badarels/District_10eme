import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { CentreHospitalier } from 'src/app/shared/Model/CentreHospitalier';
import { CentreHospitalierService } from '../../Services/centre-hospitalier.service';
import { Adresse } from 'src/app/shared/Model/Adresse';
import { AdresseService } from 'src/app/Adresses/Services/adresse.service';
import { ToastService } from 'src/app/Utilisateur/Services/toast.service';

@Component({
    selector: 'app-ajout-centre-hospitalier',
    templateUrl: './ajout-centre-hospitalier.component.html',
    styleUrls: ['./ajout-centre-hospitalier.component.css'],
    standalone: false
})
export class AjoutCentreHospitalierComponent implements OnInit {

  centreHospitalier!: CentreHospitalier;
  subscribtion=[] as Subscription[];
  ChForm!:FormGroup;
  showDropdown: boolean = false;
  selectedAddress: any; 
  submitted: boolean= false;
  adresseSelectionnee: any = null;  // Stocke l'adresse sélectionnée
  adresses = [] as Adresse[];
  adresse=new Adresse();
  searchText: string ="";
  afficherFormulaireAdresse: boolean = false;
  adresse_id: number | undefined;

  constructor(
    private centrehsoptalierServices: CentreHospitalierService,
    private toastService: ToastService,
    private formBuilder: FormBuilder,
    private adresseServices: AdresseService){}

  ngOnInit(): void {
    this.initForm();
    this.getAdresse();
  }

  initForm() {
    this.ChForm = this.formBuilder.group({
      nom_ch: ['', Validators.required],
      email_ch: ['', [Validators.required, Validators.email]],
      telephone: ['', Validators.required],
      siret: ['', Validators.required],
      adresse_id: [this.adresse_id, Validators.required], 
      // Ajoutez d'autres contrôles si nécessaire
    });
  }

selectAddress(address: Adresse) {
  this.selectedAddress = address;
  this.adresse_id = address.id;
  this.showDropdown = false; // Masquer la liste déroulante après la sélection
}

deselectAddress() {
  this.selectedAddress = null;
  this.showDropdown = false; // Ne pas dérouler la liste après la désélection
}

toggleDropdown(){
  this.showDropdown = !this.showDropdown;
}

getAdresse(){
  this.adresseServices.getAllAdresses() 
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

  AjouterCH(){
    const formData = this.ChForm.value;
    const nouveauCentreHospitalier: CentreHospitalier = {
      nom_ch: formData.nom_ch,
      email_ch: formData.email_ch,  
      telephone: formData.telephone,
      siret: formData.siret,
      adresse: this.selectedAddress,
      adresse_id: this.adresse_id,
    };
    console.log(nouveauCentreHospitalier);
    // Appeler le service pour ajouter le nouveau Centre Hospitalier
    const chObservable = this.centrehsoptalierServices.addCh(nouveauCentreHospitalier);
    this.subscribtion.push(
      chObservable.subscribe(
        (addedCentreHospitalier: CentreHospitalier) => {
          // Traitement après l'ajout réussi
          console.log('Ajout réussi', addedCentreHospitalier);
          this.toastService.showSuccessToast()  
          // Réinitialiser le formulaire ou effectuer d'autres actions si nécessaire
          this.ChForm.reset();
        },
        (error) => {
          console.error('Erreur lors de l\'ajout du centre hospitalier', error);
        }
      )
    );
  }
}
